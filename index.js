const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.port || 3000;

// ---middleware---
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://smartdbUser:6UeDdOdDJZSPjQAZ@himelcluster.fxzuftr.mongodb.net/?appName=HimelCluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Smart server is running");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("smart_db");
    const productsCollection = db.collection("products");
    const bidsCollection = db.collection("bids");

    // ----Get All Products----
    app.get("/products", async (req, res) => {
      // const projectFields = { title: 1, price_min: 1, price_max: 1, image: 1 };
      // const cursor = productsCollection
      //   .find()
      //   .sort({ price_min: -1 })
      //   .skip(2)
      //   .limit(2)
      //   .project(projectFields);

      console.log(req.query);
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }

      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // ----Get One Products----
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    // ----Create Products----
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    // ----Update Products----
    app.patch("/products/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: new ObjectId(id) };
      updatedProduct = req.body;
      const update = {
        $set: updatedProduct,
      };
      const result = await productsCollection.updateOne(query, update);
      res.send(result);
    });

    // ----Delete Products----
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // ------------For Bids-----------

    // ----Get All Bids-------
    app.get("/bids", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.buyer_email = email;
      }

      const cursor = bidsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // -----Create Bid-----
    app.post("/bids", async (req, res) => {
      const newBid = req.body;
      const result = await bidsCollection.insertOne(newBid);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`smart server is running port : ${port}`);
});
