const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// MongoDB connection
const url = "mongodb://127.0.0.1:27017"; // Local MongoDB
const client = new MongoClient(url);
const dbName = "schoolDB";

async function main() {
  await client.connect();
  console.log("✅ Connected to MongoDB");
  const db = client.db(dbName);
  const students = db.collection("students");

  // CREATE student
  app.post("/students", async (req, res) => {
    const data = req.body;
    const result = await students.insertOne(data);
    res.json(result);
  });

  // READ students
  app.get("/students", async (req, res) => {
    const allStudents = await students.find().toArray();
    res.json(allStudents);
  });

  // UPDATE student
  app.put("/students/:name", async (req, res) => {
    const { name } = req.params;
    const updateData = req.body;
    const result = await students.updateOne({ name }, { $set: updateData });
    res.json(result);
  });

  // DELETE student
  app.delete("/students/:name", async (req, res) => {
    const { name } = req.params;
    const result = await students.deleteOne({ name });
    res.json(result);
  });

  app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
}

main().catch(console.error);
