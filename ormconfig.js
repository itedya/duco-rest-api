const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;

module.exports = [
  {
    "name": "default",
    "type": "sqlite",
    "database": "database/database.db",
    "synchronize": false,
    "migrations": [
      "database/migrations/*.js"
    ],
    "entities": [
      "app/entities/*.js"
    ],
    strategy: new SnakeNamingStrategy(),
  }
]