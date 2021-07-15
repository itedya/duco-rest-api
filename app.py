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
import traceback
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
DB_TIMEOUT = 5
SAVE_TIME = 5
app = Flask(__name__)
app.config.from_mapping(config)
cache = Cache(app)

transactions = []
last_transactions_update = 0
miners = []
last_miners_update = 0
balances = []
last_balances_update = 0
use_cache = True


def _success(result, code: int = 200):
    return jsonify(success=True, result=result), code


def _error(string, code=400):
    return jsonify(success=False, message=string), code


def row_to_transaction(row):
    return {
        'datetime': str(row[0]),
        'sender': str(row[1]),
        'recipient': str(row[2]),
        'amount': float(row[3]),
        'hash': str(row[4]),
        'memo': str(row[5])
    }


def get_all_transactions():
    global last_transactions_update
    global transactions

    now = time()
    if now - last_balances_update < SAVE_TIME*2:
        pass
        # print(f'returning a copy of transactions')
    else:
        try:
            with sqlconn(CONFIG_TRANSACTIONS, timeout=DB_TIMEOUT) as conn:
                print(f'fetching transactions from {DATABASE}')
                datab = conn.cursor()
                datab.execute("SELECT * FROM Transactions")
                rows = datab.fetchall()
                print(f'done fetching transactions from {DATABASE}')

            transactions = {}
            for row in rows:
                transactions[row[4]] = row_to_transaction(row)

            last_transactions_update = time()
        except:
            pass

    return transactions


def get_transactions(username: str):
    # transactions for user
    transactions = get_all_transactions()

    user_transactions = []
    for transaction in transactions:
        if (transactions[transaction]["sender"] == username
            or transactions[transaction]["recipient"] == username):
            user_transactions.append(transactions[transaction])

    return user_transactions


def row_to_miner(row):
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


def get_all_miners():
    global last_miners_update
    global miners

    now = time()
    if now - last_miners_update < SAVE_TIME*2:
        pass
        # print(f'returning a copy of miners')
    else:
        try:
            with sqlconn(CONFIG_MINERAPI, timeout=DB_TIMEOUT) as conn:
                print(f'fetching miners from {DATABASE}')
                datab = conn.cursor()
                datab.execute("SELECT * FROM Miners")
                rows = datab.fetchall()
                print(f'done fetching miners from {DATABASE}')

            miners = {}
            for row in rows:
                try:
                    miners[row[1]].append(row_to_miner(row))
                except:
                    miners[row[1]] = []
                    miners[row[1]].append(row_to_miner(row))

            last_miners_update = time()
        except:
            pass

    return miners


@app.route("/miners/<username>")
@cache.cached()
def get_miners_api(username: str):
    # Get all miners
    try:
        miners = get_all_miners()
        return _success(miners[username])
    except:
        return _error("No miners detected on that account")

def get_miners(username: str):
    # For /users/
    miners = get_all_miners()
    return miners[username]


def row_to_balance(row):
    return {
        'username': str(row[0]),
        'balance': float(row[3])
    }


def get_all_balances():
    global last_balances_update
    global balances

    now = time()
    if now - last_balances_update < SAVE_TIME*3:
        pass
        # print(f'returning a copy of balances')
    else:
        with sqlconn(DATABASE, timeout=DB_TIMEOUT) as conn:
            print(f'fetching balances from {DATABASE}')
            datab = conn.cursor()
            datab.execute("SELECT * FROM Users")
            rows = datab.fetchall()
            print(f'done fetching balances from {DATABASE}')

        balances = {}
        for row in rows:
            balances[row[0]] = row[3]

        last_balances_update = time()

    return balances


def get_balance(username: str):
    balances = get_all_balances()
    balance = {
        "username": username,
        "balance": balances[username]
    }
    return balance


@app.route("/users/<username>")
@cache.cached()
def api_get_user_objects(username: str):
    try:
        balance = get_balance(username)
    except Exception as e:
        return _error("This user doesn't exist")

    try:
        miners = get_miners(username)
    except Exception as e:
        miners = []

    try:
        transactions = get_transactions(username)
    except Exception as e:
        transactions = []

    result = {
        'balance': balance,
        'miners': miners,
        'transactions': transactions
    }

    return _success(result)


@app.route("/transactions/<hash>")
@cache.cached()
def get_transaction_by_hash(hash: str):
    # Get all transactions
    try:
        transactions = get_all_transactions()
        for transaction in transactions:
            if transactions[transaction]["hash"] == hash:
                return _success(transactions[transaction])
        return _success("No transaction found")
    except Exception as e:
        return _error("This transaction doesn't exist")


@app.route("/balances/<username>")
@cache.cached()
def api_get_user_balance(username: str):
    try:
        return _success(get_balance(username))
    except Exception as e:
        return _error("This user doesn't exist")

@app.route("/balances")
@cache.cached()
def api_get_all_balances():
    try:
        return _success(get_all_balances())
    except Exception as e:
        return _error("Error fetching balances: " + str(e))


@app.route("/transactions")
@cache.cached()
def api_get_all_transactions():
    try:
        return _success(get_all_transactions())
    except Exception as e:
        return _error("Error fetching transactions: " + str(e))


@app.route("/miners")
@cache.cached()
def api_get_all_miners():
    try:
        return _success(get_all_miners())
    except Exception as e:
        return _error("Error fetching miners: " + str(e))


@app.route("/statistics")
@cache.cached()
def get_api_data():
    data = {}
    with open(API_JSON_URI, 'r') as f:
        try:
            data = json.load(f)
        except:
            pass

    return jsonify(data)
