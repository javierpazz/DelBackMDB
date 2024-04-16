const mongoose = require('mongoose');


const dbConnection = async() => {
    try {
        
        // await mongoose.connect( 'mongodb://127.0.0.1:27017/sdb', {
        await mongoose.connect( 'mongodb+srv://admin:admin123456@chatapp.fe0krcf.mongodb.net/sdb', {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB Online');


    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar BD');
    }

}
dbConnection()


module.exports = {
    dbConnection
}
