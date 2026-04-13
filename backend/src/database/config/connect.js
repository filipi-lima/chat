const mongoose = require("mongoose");
require("dotenv").config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Banco de dados conectado com sucesso!")
    } catch (error) {
        console.log("Erro ao se conectar com o banco de dados:", error)
    }
}

module.exports = connectDB
