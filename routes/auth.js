/*
   host + /api/auth
*/
const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const { createUser, userLogin, renewToken } = require('../controllers/auth')
const { fieldValidator } = require('../middlewares/field-validator')
const { validarJWT } = require('../middlewares/validar-jwt')

// Register
router.post(
   '/new', 
   [ // middlewares
      check('name', 'name is required').not().isEmpty(),
      check('email', 'email is invalid').isEmail(),
      check('password', 'Password must be at least 6 characters').isLength({min: 6}),
      fieldValidator
   ], 
   createUser)

// Login
router.post(
   '/', 
   [ // middlewares
      check('email', 'email is invalid').isEmail(),
      check('password', 'Password must be at least 6 characters').isLength({min: 6}),
      fieldValidator
   ],
   userLogin)

router.get('/renew', validarJWT, renewToken)
module.exports = router