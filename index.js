const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tdjlbxg.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    client.connect();
    const accountantsCollection = client.db("mcsDb").collection("accountants");

    app.get("/accountants", async (req, res) => {
      const result = await accountantsCollection.find().toArray();
      res.send(result);
    });
    app.get("/accountants/:id", async (req, res) => {
        try {
          const id = req.params.id;
          console.log("ID:", id);
          const query = { _id: new ObjectId(id) };
          const result = await accountantsCollection.findOne(query);
          if (result) {
            res.json(result); // Send the accountant data as JSON
          } else {
            res.status(404).json({ error: "Accountant not found" });
          }
        } catch (error) {
          console.error("Error fetching accountant data:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("MCS server is running");
});
app.listen(port, () => {
  console.log(`MCS server side running on port ${port}`);
});
