const { response } = require('express')
const Event = require('../models/Event')

const getEvents = async(req, res = response) => {

   try {
      
      const events = await Event.find().populate('user', 'name')

      res.json({
         ok: true,
         events
      })

   } catch (error) {
      console.log(error)
      res.status(500).json({
         ok: false,
         msg: 'Talk with the administrator'
      })
   }



}

const createEvent = async(req, res = response) => {

   const event = new Event( req.body )
   try {
      event.user = req.uid
      const eventSaved = await event.save()

      res.json({
         ok: true,
         event: eventSaved
      })
      
   } catch (error) {
      console.log(error)
      res.status(500).json({
         ok: false,
         msg: 'Talk with the administrator'
      })
   }
}

const updateEvent = async(req, res = response) => {

   const eventId = req.params.id

   try {
      const event = await Event.findById( eventId )

      if( !event ) {
         res.status(404).json({
            ok: false,
            msg: 'invalid id event, it does not exists'
         })
      }

      if( event.user.toString() !== req.uid ) {
         return res.status(401).json({
            ok: false,
            msg: 'you do not have privilegies to edit this'
         })
      }

      const newEvent = {
         ...req.body,
         user: req.uid,

      }

      const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, {new: true} )

      res.json({
         ok: true,
         event: updatedEvent
      })

   } catch (error) {
      console.log(error)
      res.status(500).json({
         ok: false,
         msg: 'talk with the administrator'
      })
   }

}

const deleteEvent = async(req, res = response) => {

   const eventId = req.params.id

   try {
      const event = await Event.findById( eventId )

      if( !event ) {
         return res.status(404).json({
            ok: false,
            msg: 'invalid id event, it does not exists'
         })
      }

      if( event.user.toString() !== req.uid ) {
         return res.status(401).json({
            ok: false,
            msg: 'you does not have privilegies to delete this'
         })
      }

      const updatedEvent = await Event.findByIdAndDelete( eventId)

      res.json({ ok: true})

   } catch (error) {
      console.log(error)
      res.status(500).json({
         ok: false,
         msg: 'talk with the administrator'
      })
   }


}

module.exports = {
   getEvents,
   createEvent,
   updateEvent,
   deleteEvent,
}
