module.exports = require('knex')({
  client: 'mysql',
  connection: {
    user: 'root',
    password: 'root',
    host: 'localhost',
    database: 'db_example',
  }
});
