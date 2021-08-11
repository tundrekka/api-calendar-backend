const { response, request } = require('express')
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

/**
 * @description Register a user, Insert the user in the DB and automatically logged him
 */
const createUser = async( req = request, resp = response) => {

   const { email, password } = req.body;

   try {
      let user = await User.findOne({ email });

      if ( user ) {
         return resp.status(400).json({
            ok: false,
            msg: 'The user already exists'
         });
      }

      user = new User( req.body );

      // Encrypt password
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync( password, salt );


      await user.save();

      // Generate JWT
      const token = await generarJWT( user.id, user.name );

      resp.status(201).json({
         ok: true,
         uid: user.id,
         name: user.name,
         token
      })
         
   } catch (error) {
      console.log(error)
      resp.status(500).json({
         ok: false,
         msg: 'Please talk with the administrator'
      });
   }
   }

/**
 * @description Function to log in
 */
const userLogin = async(req, resp = response ) => {

   const { email, password } = req.body
   
   try {
        
      const user = await User.findOne({ email });

      if ( !user ) {
         return resp.status(400).json({
            ok: false,
            msg: 'No user with that email in the Database'
         });
      }

      // Confirm the password
      const validPassword = bcrypt.compareSync( password, user.password );

      if ( !validPassword ) {
         return resp.status(400).json({
            ok: false,
            msg: 'Incorrect password'
         });
   }

      // Generate JWT
      const token = await generarJWT( user.id, user.name );

      resp.status(200).json({
         ok: true,
         uid: user.id,
         name: user.name,
         token
      })


   } catch (error) {
      console.log(error);
      resp.status(500).json({
         ok: false,
         msg: 'Please talk with the administrator'
      });
   }
}

/**
 * @description generates a new JWT
 */
const renewToken = async(req, resp = response ) => {
   const { uid, name } = req;

   // Generate JWT
   const token = await generarJWT( uid, name );

   resp.json({
      ok: true,
      token,
      uid,
      name
   })
}

module.exports = {
   createUser,
   userLogin,
   renewToken,
}