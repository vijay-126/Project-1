const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");
let Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("sucessful connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  mongoose.connect(Mongo_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "681eef58093d4b231c028e46",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
