// INDEX.JS
const express = require('express')
const app = express()
var morgan = require('morgan');

const api_public = require('./routes/public');
// const api_user = require('./routes/user');
// const api_admin = require('./routes/admin');


app.use(morgan('dev'));
app.use('/', api_public);

 
// app.use('/api/user', jwt({
//   secret: process.env.jwt_secret
// }), API_User);




app.get('/', (req, res ) => {
  res.send('API root')
})
// export the server middleware
module.exports = {
  path: '/api',
  handler: app
}