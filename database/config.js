const mongoose = require('mongoose');
// mongodb://mern_user:BYswKhAirvvgscKs@localhost:27017/calendar_mern
// mongodb+srv://dbTundrekka:dbTundrekkaGithub1990Mongo@cluster0.comsi.mongodb.net/test/mern_calendar

const dbConnection = async() => {

   try {
      //TODO llenar la variable de entorno DB_CNN
      await mongoose.connect( process.env.DB_CNN , {
         useNewUrlParser: true, 
         useUnifiedTopology: true,
         useCreateIndex: true
      });

      console.log('DB Online');


   } catch (error) {
      console.log(error);
      throw new Error('Error trying to initiate DB');
   }

}

module.exports = {
   dbConnection
}
