# Duco REST API
This repository is completely rewritten source code of Duino-Coin REST API.

## Local development

### 1. Install packages 

``` npm i ```

### 2. Create Database

``` typeorm migration:run ```

### 3. Create ```.env``` file

Copy ```.env.example``` file and rename it to ```.env```. Make sure all variables in file are correct. 

### 4. Run

``` npm start ```

## Things to check before pull request

1. How much rounds bcrypt has set in tcp server, then set same amount in ```.env``` and ```.env.example```  file
