const express = require('express')
const ctr_public = require('../controllers/ctr_public')
// const Login = require('../controllers/Ctr_Login')
// const Lyfs = require('../controllers/Ctr_Lyfs')
// const Ctr_Suggestion = require('../controllers/Ctr_Suggestion');

// const Profile = require('../controllers/Ctr_Profile')
// const Ctr_Paypal = require('../controllers/Ctr_Paypal')

// var Recaptcha = require('express-recaptcha').Recaptcha;
// var recaptcha = new Recaptcha('recaptcha', '6Ld6CIgUAAAAABPlOG-mZPPA1XnnE80wu9oz5aLR');

const router = express.Router()


router.get('/names', ctr_public.GET_NAMES);
 
// router.post('/Login', Login.Login)
 

module.exports = router
