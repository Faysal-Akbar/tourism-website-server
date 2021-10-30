const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqp1u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db("hero_traveller");
        const placeCollection = database.collection("places");
        const bookedCollection = database.collection("booked");

        // GET API
        app.get('/places', async(req, res) => {
        const cursor = placeCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
        });

        //Find a document
        app.get('/places/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await placeCollection.findOne(query);
            res.send(result);
        })

        // POST API
        app.post('/addBooking', async(req, res) => {
            const booking = req.body;
            const result = await bookedCollection.insertOne(booking);
            res.send(result);
        });

        //GET my orders via email
        app.get('/myOrders/:email', async(req, res) => {
            const email = req.params.email;
            const cursor = bookedCollection.find({email: email});
            const result = await cursor.toArray();
            res.send(result);
        });

        //DELETE API
        app.delete('/myOrders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookedCollection.deleteOne(query);
            res.send(result);
        });

        // GET all orders
        app.get('/manageOrders', async(req, res) => {
            const orders = bookedCollection.find({});
            const result = await orders.toArray();
            res.send(result);
        });

        //POST an offer
        app.post('/addOffer', async(req, res) => {
            const offer = req.body;
            const result = await placeCollection.insertOne(offer);
            res.send(result);
        });
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Hero Traveller')
})

app.listen(port, () => {
  console.log("Server Running at Port", port);
})