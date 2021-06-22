const { response, request } = require('express')
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

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

      // Encriptar contraseña
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync( password, salt );


      await user.save();

      // Generar JWT
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

// UserLogin
const userLogin = async(req, resp = response ) => {

   const { email, password } = req.body
   
   try {
        
      const user = await User.findOne({ email });

      if ( !user ) {
         return resp.status(400).json({
            ok: false,
            msg: 'El usuario no existe con ese emails'
         });
      }

      // Confirmar los passwords
      const validPassword = bcrypt.compareSync( password, user.password );

      if ( !validPassword ) {
         return resp.status(400).json({
            ok: false,
            msg: 'Incorrect password'
         });
   }

      // Generar JWT
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
         msg: 'Por favor hable con el administrador'
      });
   }
}

// funcion para renovar el token
const renewToken = async(req, resp = response ) => {
   const { uid, name } = req;

   // Generar JWT
   const token = await generarJWT( uid, name );

   resp.json({
      ok: true,
      token
   })
}

module.exports = {
   createUser,
   userLogin,
   renewToken,
}