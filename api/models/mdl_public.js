const db_example = require('../helpers/database');
const bcrypt = require('bcrypt');



exports.get_users = (email) => {
  return db_example.select().from('t_dat_users').then((rows) => {
    return rows;
  })
}


exports.checkUser = async (password, passwordHash) => {
  const match = await bcrypt.compare(password, passwordHash);
  console.log(match);
  return match;

}

exports.GetUser = (email) => {

  return new Promise(async (resolve, reject) => {

    mysql.select({
      table: 't_dat_user',
      conditions: {
        email: email,
        // is_active: 1,
      },
      limit: 1,
      show_query: false
    }, (err, result) => {
      console.log(result);
      if (err) reject('Error al verificar el Email, intenta mas tarde');
      if (result.length > 0) {
        resolve(result[0]);
      } else {
        reject('El usuario no esta registrado');
      }
    });

  });
}
