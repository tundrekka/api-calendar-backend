const moment = require("moment")

const isDate = (value, rest ) => {

   const { start, end } = rest.req.body

   // se podria validar que la fecha end NO sea menor a la fecha start

   if( !value ) return false
   
   const fecha = moment( value )

   if( fecha.isValid() ) {
      return true
   }
   else {
      return false
   }

}

module.exports = {
   isDate
}