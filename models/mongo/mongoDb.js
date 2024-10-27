const mongoose = require('mongoose')

require('dotenv').config()

mongoose.set('strictQuery', true);

async function main() {
    await mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.kq5tp.mongodb.net/`);
    console.log('conectado com sucesso banco mongo db')
}

main().catch((err) => console.log(err));

module.exports= main;