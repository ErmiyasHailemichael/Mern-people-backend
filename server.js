// Dependencies

//get .env vars
require("dotenv").config();

//get port and db url
const { PORT, DATABASE_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");

 const morgan = require('morgan')
 const cors = require('cors')


//Database connection
mongoose.connect(DATABASE_URL);

//connection event
mongoose.connection
  .on("open", () => console.log("You are connected to MongoDB"))
  .on("close", () => console.log("You are disconnected from MongoDB"))
  .on("error", (error) => console.log(error));

//Model
const PeopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String,
});

const People = mongoose.model("People", PeopleSchema);

// MIDDLEWARE
app.use(cors()) // prevents cross origin resource sharing errors, allows access to server from all origins i.e. react frontend
app.use(morgan("dev")) // loggs details of all server hits to terminal
app.use(express.json()) // parse json bodies from request
app.use(express.urlencoded({extended: false})) // to use url encoded

// Routes ---- IDUC
app.get("/", (req, res) => {
  res.send("hello world");
});

//index
app.get('/people', async(req, res)=>{
    try{
        res.status(200).json( await People.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})


//create
app.post('/people', async (req, res)=>{
    try{
        await People.create(req.body)
        res.status(200).json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

//delete
app.delete('/people/:id', async (req, res) =>{
    try {
        res.status(200).json( await People.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})


//update
app.put('/people/:id', async (req, res)=> {
    try {
        res.status(200).json( await People.findOneAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})


app.listen(PORT, () => console.log(`Listen to port ${PORT}`));
