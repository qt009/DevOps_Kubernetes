const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbHost = process.env.DATABASE_HOST || 'localhost';
const dbPort = process.env.DATABASE_PORT || '27017';
const dbName = process.env.DATABASE_NAME || 'test';
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;

const url = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
let db;

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  db = client.db(dbName);
  console.log('Connected to MongoDB');

  // Check if the 'users' collection exists and create it if it doesn't
  const collections = await db.listCollections({ name: 'users' }).toArray();
  if (collections.length === 0) {
    console.log('Creating "users" collection...');
    await db.createCollection('users');
    await db.collection('users').createIndex({ "name": 1 }, { unique: true });
    console.log('"users" collection created.');
  } else {
    console.log('"users" collection already exists.');
  }
});

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Add a user
app.post('/users', (req, res) => {
  const user = { name: req.body.name, password: req.body.password };
  db.collection('users').insertOne(user, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.redirect('/');
    }
  });
});

// List all users (API endpoint)
app.get('/users', (req, res) => {
  db.collection('users').find().toArray((err, users) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(users);
    }
  });
});

// Delete a user
app.post('/delete-user', (req, res) => {
  const userId = req.body.userId;
  db.collection('users').deleteOne({ _id: new ObjectId(userId) }, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.deletedCount === 0) {
      res.status(404).send('User not found');
    } else {
      res.redirect('/');
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
