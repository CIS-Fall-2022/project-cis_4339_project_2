const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan"); //better debugging
const cors = require("cors");
//allow using a .env file
require("dotenv").config();   

//creates a new instance of express application
const app = express();

// add cors header to the server
app.use(cors({
  origin: '*'
}));

//sets up mongoose for the mongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connection Success!");
  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);
  });

//declare port number for the api
if (process.env.ORGANIZATION==1){
  const PORT = process.env.PORTA;
  app.listen(PORT, () => {
    console.log("Server started listening on port : ", PORT);
  });}
else if (process.env.ORGANIZATION==2){
  const PORT = process.env.PORTB;
  app.listen(PORT, () => {
    console.log("Server started listening on port : ", PORT);
  });
} else{ (process.env.ORGANIZATION==3)
  const PORT = process.env.PORTC
  app.listen(PORT, () => {
    console.log("Server started listening on port : ", PORT);
  });
};
//setup
app.use(express.json());
app.use(morgan("dev"));

//import routes
const primaryDataRoute  = require('./routes/primaryData');
const eventsDataRoute  = require('./routes/eventsData');
const orgDataRoute  = require('./routes/orgData');
//setup middle ware for routes
app.use('/primaryData', primaryDataRoute);
app.use('/eventData', eventsDataRoute);
app.use('/orgData', orgDataRoute);


//error handler
app.use(function (err, req, res, next) {
  if (!err) {
    return next();
  }
  // logs error and error code to console
  console.error(err.message, req);
  if (!err.statusCode)
    err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
