/*
   host + /api/events
*/
const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events-controller');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/field-validator');
const { isDate } = require('../helpers/isDate');

const router = express.Router()

router.use( validarJWT )

// Get events
router.get( '/', getEvents)

// Create a new event
router.post( '/', 
   [
      check('title', 'Es obligatorio el title').not().isEmpty(),
      check('start', 'Start date is required').custom( isDate ),
      check('end', 'End date is required').custom( isDate ),
      fieldValidator
   ],
   createEvent )

// Update events
router.put( '/:id', 
   [
      check('title', 'Es obligatorio el title').not().isEmpty(),
      check('start', 'Start date is required').custom( isDate ),
      check('end', 'End date is required').custom( isDate ),
      fieldValidator
   ], 
   updateEvent )

// Delete events
router.delete( '/:id', deleteEvent )

module.exports = router