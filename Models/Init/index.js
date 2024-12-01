const mongoose = require("mongoose");

const initData = require("./data.js");

const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Main function to connect to DB and initialize data
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await initDB();
  } catch (err) {
    console.log("Error connecting to DB:", err);
  }
}

async function initDB() {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "66b9d6483507d279b8c31148"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.log("Error initializing data:", err);
  }
}

main();
