# Duco REST API
This repository is completely rewritten source code of Duino-Coin REST API.

## 🟥🟥🟥🟥 WARNING 🟥🟥🟥🟥

**THIS PROJECT HAS NEW REDESIGNED DATABASE**. Old one was bad (no primary keys, no foreign keys, no unique attributes and so on). **New database won't fit to other services built for old database.** If project leaders decide to accept pull request, It is necessary to redesign services for new database.

## 🟥🟥🟥🟥 WARNING 🟥🟥🟥🟥

## Things to check before pull request

1. How much rounds bcrypt has set in tcp server, then set same amount in ```.env``` and ```.env.example```  file


## Local development tools

File ```insomnia.json``` is file with data to <a href="https://insomnia.rest/">insomnia</a> (program Postman-like).
From it you can do requests to your local DuinoCoin REST API.

## How to start local development

### 1. Install packages 

``` npm i ```

### 2. Create Database

``` npm run typeorm:run ```

### 3. Create ```.env``` file

Copy ```.env.example``` file and rename it to ```.env```. Make sure all variables in file are correct. 

### 4. Run

``` npm run dev ```
