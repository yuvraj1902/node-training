const express = require("express")
const cors = require("cors")
const helmet= require("helmet")
const app = express()
app.use(express.json())
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.use(helmet())

app.use("/health", (req, res) => {
    res.send({message:"Everything running fine"})
})

module.exports = app;
