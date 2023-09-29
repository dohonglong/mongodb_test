const { MongoClient } = require("mongodb");
require("dotenv").config();

// Replace the following with your Atlas connection string
const url = `${process.env.MONGO_URI}`;
const client = new MongoClient(url);

// Reference the database to use
const dbName = "gettingStarted";

async function run() {
  try {
    // Connect to the Atlas cluster
    await client.connect();
    const db = client.db(dbName);

    // Reference the "people" collection in the specified database
    const col = db.collection("people");

    // Create a new document
    let personDocument = {
      name: { first: "Long", last: "Do" },
      birth: new Date(1998, 9, 1), // May 23, 1912
      // death: new Date(1954, 5, 7), // May 7, 1954
      contribs: ["Hello", "My name", "is"],
      views: 1250000,
    };

    // Insert the document into the specified collection
    const p = await col.insertOne(personDocument);

    // Find and return the document
    const filter = { "name.last": "Turing" };
    const document = await col.findOne(filter);
    console.log("Document found:\n" + JSON.stringify(document));
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
