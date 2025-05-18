const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const connectToMongo = async()=>{
  try {
      await mongoose.connect(process.env.mongoURI, {
      });
    
    console.log("Connected to Mongo Successfully");
    
 } catch (error) {
    console.log("Error Connecting to Mongo",error.message);
  }
};
module.exports = connectToMongo;