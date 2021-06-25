import os
import sys
import json
from typing import Optional
from flask import Flask, request, jsonify
from sqlite3 import connect as sqlconn
from time import sleep, time
from bcrypt import checkpw
from re import match
from collections import OrderedDict
from operator import itemgetter
from Server import (
    DATABASE,
    DB_TIMEOUT,
    CONFIG_MINERAPI,
    CONFIG_TRANSACTIONS,
    API_JSON_URI,
    global_last_block_hash,
    now,
    SAVE_TIME
)
from flask_caching import Cache

config = {
    "DEBUG": False,
    "CACHE_TYPE": "SimpleCache",
    "CACHE_DEFAULT_TIMEOUT": 5
}

app = Flask(__name__)
app.config.from_mapping(config)
cache = Cache(app)

use_cache = True

minersapi = []
last_miner_update = 0

balances = []
last_balances_update = 0

transactions = []
last_transactions_update = 0

#                                                          #
# =================== RESPONSE HELPERS =================== #
#                                                          #


def _success(result, code: int = 200):
    return jsonify(success=True, result=result), code


def _error(string, code=400):
    return jsonify(success=False, message=string), code

#                                                     #
# =================== SQL HELPERS =================== #
#                                                     #


def _create_sql_filter(count, key, value):
    if count == 0:
        statement = [f'WHERE {key}']
    else:
        statement = [f'AND {key}']

    comparison_components = value.split(':')
    arg = value
    if len(comparison_components) == 1:
        statement.append('=')
    else:
        if comparison_components[0] == 'lt':
            statement.append('<')
        elif comparison_components[0] == 'lte':
            statement.append('<=')
        elif comparison_components[0] == 'gt':
            statement.append('>')
        elif comparison_components[0] == 'gte':
            statement.append('>=')
        elif comparison_components[0] == 'ne':
            statement.append('<>')

        arg = comparison_components[1]

    statement += '?'

    return (' '.join(statement), arg)


def _create_sql_or_filter(keys, value):
    statement = []
    args = []

    for idx, key in enumerate(keys):
        if idx == 0:
            statement.append(f'WHERE {key} = ?')
        else:
            statement.append(f'OR {key} = ?')
        args.append(value)

    return (' '.join(statement), args)


def _create_sql_sort(field):
    statement = [f'ORDER BY']
    comparison_components = field.split(':')
    statement.append(comparison_components[0])
    try:
        statement.append(comparison_components[1])
    except:
        pass

    return ' '.join(statement)


def _create_sql_limit(amount):
    return ('LIMIT ?', amount)


def _create_sql(sql, request_args={}):
    statement = [sql]
    args = []
    filter_count = 0

    for k, v in request_args.items():
        if str(k).lower() not in ['sort', 'limit']:
            if str(k).lower() != 'or':
                fil = _create_sql_filter(filter_count, k, v)
                statement.append(fil[0])
                args.append(fil[1])
                filter_count += 1

            else:
                components = v.split(':')
                keys = components[0].split(',')
                fil = _create_sql_or_filter(keys, components[1])
                statement.append(fil[0])
                args += fil[1]

    try:
        sort = request_args['sort']
        statement.append(_create_sql_sort(sort))
    except:
        pass

    try:
        limit = request_args['limit']
        limit = _create_sql_limit(int(limit))
        statement.append(limit[0])
        args.append(limit[1])
    except:
        pass

    return (' '.join(statement), args)


def _sql_fetch_one(db: str, statement: str, args: tuple = ()):
    with sqlconn(db, timeout=DB_TIMEOUT) as conn:
        datab = conn.cursor()
        datab.execute(statement, args)

        return datab.fetchone()


def _sql_fetch_all(db: str, statement: str, args: tuple = ()):
    rows = []
    with sqlconn(db, timeout=DB_TIMEOUT) as conn:
        datab = conn.cursor()
        datab.execute(statement, args)
        rows = datab.fetchall()
        datab.close()
    conn.close()
    return rows

#                                              #
# =================== USER =================== #
#                                              #


@app.route("/users/<username>")
def api_get_user_objects(username: str):
    miners = _get_user_miners(username)

    try:
        transactions = _get_user_transactions(username)
    except:
        transactions = []

    try:
        balance = _get_user_balance(username)
    except:
        balance = {}

    result = {
        'balance': balance,
        'miners': miners,
        'transactions': transactions
    }

    return _success(result)

#                                                  #
# =================== BALANCES =================== #
#                                                  #


def _row_to_balance(row):
    return {
        'username': str(row[0]),
        'balance': float(row[3])
    }


def _get_balances():
    statement = _create_sql('SELECT * FROM Users')

    rows = _sql_fetch_all(DATABASE, statement[0], statement[1])
    return [_row_to_balance(row) for row in rows]


def _fetch_balances():
    global last_balances_update
    global balances
    now = time()
    if now - last_balances_update < SAVE_TIME:
        return balances.copy()

    print(f'fetching balances from {DATABASE}')
    balances = _get_balances()
    print(f'done fetching balances from {DATABASE}')
    last_balances_update = time()

    return balances.copy()


@app.route("/balances")
@cache.cached(timeout=5)
def api_get_balances():
    if 'username' in request.args:
        return api_get_user_balance(request.args['username'])

    if use_cache:
        balances = _fetch_balances()
        return _success(balances)

    try:
        balances = _get_balances()
        return _success(balances)
    except Exception as e:
        return _error(f'Error fetching balances: {e}')


def _get_user_balance(username: str):
    # Get the balance of a user
    row = _sql_fetch_one(
        DATABASE, '''SELECT * 
        FROM Users 
        WHERE username = ? 
        ORDER BY balance DESC''',
        (username,))

    if not row:
        raise Exception(f'User \'{username}\' not found')

    return _row_to_balance(row)


@app.route("/balances/<username>")
def api_get_user_balance(username: str):
    if use_cache:
        balances = _fetch_balances()
        balance = [b for b in balances if b['username']
                   == username][0] if 0 < len(balances) else {}
        return _success(balance)

    try:
        balance = _get_user_balance(username)
        return _success(balance)
    except Exception as e:
        return _error(f'Error fetching balance: {e}')

#                                                      #
# =================== TRANSACTIONS =================== #
#                                                      #


def _row_to_transaction(row):
    return {
        'datetime': str(row[0]),
        'sender': str(row[1]),
        'recipient': str(row[2]),
        'amount': float(row[3]),
        'hash': str(row[4]),
        'memo': str(row[5])
    }


def _get_transactions(
        username: Optional[str] = None,
        sender: Optional[str] = None,
        recipient: Optional[str] = None,
        sort: Optional[str] = None):
    # Get all transactions
    # args = request.args.to_dict()
    args = {}

    # Remove all keys except for or, limit, sort
    if username:
        args['or'] = f'username,recipient:{str(username)}'

    # The DB uses `username` for `sender`
    if sender:
        args['username'] = sender

    if recipient:
        args['recipient'] = recipient

    # Adjust the sort key for datefield
    if sort:
        if 'datetime' in sort:
            args['sort'] = sort.replace('datetime', 'timestamp')

    statement = _create_sql('SELECT * FROM Transactions', args)

    rows = _sql_fetch_all(CONFIG_TRANSACTIONS, statement[0], statement[1])
    return [_row_to_transaction(row) for row in rows]


def _fetch_transactions():
    global last_transactions_update
    global transactions
    now = time()
    if now - last_transactions_update < 15:
        return transactions.copy()

    print(f'fetching transactions from {CONFIG_TRANSACTIONS}')
    transactions = _get_transactions()
    last_transactions_update = time()

    return transactions.copy()


@app.route("/transactions")
@cache.cached(timeout=5)
def api_get_transactions():

    username = request.args.get('username', None)
    sender = request.args.get('sender', None)
    recipient = request.args.get('recipient', None)
    sort = request.args.get('sort', None)

    if use_cache:
        transactions = _fetch_transactions()

        if username:
            transactions = [t for t in transactions if (
                t['sender'] == username or t['recipient'] == username)]

        elif sender and recipient:
            transactions = [t for t in transactions if (
                t['sender'] == sender and t['recipient'] == recipient)]

        elif sender:
            transactions = [t for t in transactions if t['sender'] == sender]

        elif recipient:
            transactions = [
                t for t in transactions if t['recipient'] == recipient]

        if sort:
            if 'datetime' in sort:
                reverse = 'desc' not in sort
                transactions = sorted(
                    transactions, key=lambda k: k['datetime'], reverse=reverse)

        return _success(transactions)

    try:
        transactions = _get_transactions(
            username=username, sender=sender, recipient=recipient, sort=sort)
        return _success(transactions)
    except Exception as e:
        return _error(f'Error fetching transactions: {e}')


def _get_user_transactions(username=None):
    # Get all transactions
    username = request.args.get('username', username)
    sender = request.args.get('sender', None)
    recipient = request.args.get('recipient', None)
    sort = request.args.get('sort', None)

    if use_cache:
        transactions = _fetch_transactions()

        if username:
            transactions = [t for t in transactions if (
                t['sender'] == username or t['recipient'] == username)]

        elif sender and recipient:
            transactions = [t for t in transactions if (
                t['sender'] == sender and t['recipient'] == recipient)]

        elif sender:
            transactions = [t for t in transactions if t['sender'] == sender]

        elif recipient:
            transactions = [
                t for t in transactions if t['recipient'] == recipient]

        if sort:
            if 'datetime' in sort:
                transactions = sorted(
                    transactions, key=lambda k: k['timestamp'])

        return transactions

    return _get_transactions(username=username, sort='timestamp:desc')


def _get_transaction(hash_id: str):
    # Get a transaction by its hash
    if use_cache:
        _fetch_transactions()
        transactions = transactions.copy()
        transaction = [t for t in transactions if t['hash']
                       == hash_id][0] if 0 < len(transactions) else {}
        return transaction

    row = _sql_fetch_one(
        CONFIG_TRANSACTIONS, '''SELECT * 
        FROM Transactions 
        WHERE hash = ?''',
        (hash_id,))

    if not row:
        raise Exception(f'Transaction \'{hash_id}\' does not exist')

    return _row_to_transaction(row)


@app.route("/transactions/<hash_id>")
def api_get_transaction(hash_id):
    try:
        transaction = _get_transaction(hash_id)
        return _success(transaction)
    except Exception as e:
        return _error(f'Error fetching transaction: {e}')

#                                                #
# =================== MINERS =================== #
#                                                #


def _row_to_miner(row):
    return {
        "threadid":   row[0],
        "username":   row[1],
        "hashrate":   row[2],
        "sharetime":  row[3],
        "accepted":   row[4],
        "rejected":   row[5],
        "diff":       row[6],
        "software":   row[7],
        "identifier": row[8],
        "algorithm":  row[9]
    }


def _fetch_miners():
    # Internal function get fetch miners from DB
    now = time()
    global last_miner_update
    global minersapi
    if now - last_miner_update < 20:
        return

    print(f'fetching miners from {CONFIG_MINERAPI}')
    miners = []
    try:
        rows = _sql_fetch_all(CONFIG_MINERAPI, 'SELECT * FROM Miners')
        for row in rows:
            miners.append(_row_to_miner(row))
    except Exception as e:
        print(f'Exception getting miners: {e}')
        pass

    minersapi = miners
    last_miner_update = time()
    print(f'done fetching miners from {CONFIG_MINERAPI}')


def _get_miners():
    # Get all miners
    _fetch_miners()
    miners = minersapi.copy()
    if 'username' in request.args.keys():
        miners = [m for m in miners if m['username']
                  == request.args['username']]
    return miners


@app.route("/miners")
@cache.cached(timeout=5)
def api_get_miners():
    return _success(_get_miners())


def _get_miner(threadid):
    # Get specific miner by its `threadid`
    miners = _get_miners()

    miner = [m for m in miners if m['threadid'] == threadid]
    if miner:
        miner = miner[0]
    else:
        miner = {}

    return miner


@app.route("/miners/<threadid>")
def api_get_miner(threadid):
    return _success(_get_miner(threadid))


def _get_user_miners(username):
    # Get miners for user
    miners = _get_miners()

    return [m for m in miners if m['username'] == username]

#                                             #
# =================== API =================== #
#                                             #


def _get_api_data():
    # Internal function to get API data from JSON file
    data = {}
    with open(API_JSON_URI, 'r') as f:
        try:
            data = json.load(f)
        except:
            pass

    return data


def formatted_hashrate(hashrate: int, accuracy: int):
    """ Input: hashrate as int
        Output rounded hashrate with scientific prefix as string """
    if hashrate >= 900000000:
        prefix = " GH/s"
        hashrate = hashrate / 1000000000
    elif hashrate >= 900000:
        prefix = " MH/s"
        hashrate = hashrate / 1000000
    elif hashrate >= 900:
        prefix = " kH/s"
        hashrate = hashrate / 1000
    else:
        prefix = " H/s"
    return str(round(hashrate, accuracy)) + str(prefix)


@app.route("/statistics")
@cache.cached(timeout=5)
def get_api_data():
    # Return API Data object
    return jsonify(_get_api_data())
