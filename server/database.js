// Kumuha ng environment variables mula sa .env file
require("dotenv").config();

// Import ng mga kinakailangang modules mula sa mongodb
const { MongoClient, ServerApiVersion } = require("mongodb");

// Setup ng MongoDB URI at mga options
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/"; // Default na URI kung walang nakuhang value mula sa .env

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

// Lumikha ng client variable
let client;

// Function para kumonekta sa MongoDB
const connectToMongoDB = async () => {
  if (!client) {
    try {
      client = await MongoClient.connect(uri, options);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.log(error);
    }
  }
  return client;
};

// Function para makuha ang nakakonnek na client
const getConnectedClient = () => client;

// I-export ang mga function na kailangan sa ibang parte ng application
module.exports = { connectToMongoDB, getConnectedClient };