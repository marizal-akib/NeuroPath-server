const express = require('express');
const app = express()
const cors = require('cors')
const { ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;



// middleware
// app.use(cors());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://neuropath-d1a3c.web.app"
    ],
    credentials: true,
    optionSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}));
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.pg0uvv0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const userCollection = client.db('neuronDB').collection('users')
        const patientCollection = client.db('neuronDB').collection('patient')




        // patient api
        app.post('/newPatient', async (req, res) => {
            const newPatient = req.body
            const result = await patientCollection.insertOne(newPatient);
            res.send(result);
        })

        app.get('/patient', async (req, res) => {
            const result = await patientCollection.find().toArray();
            res.send(result);
        })
        app.get('/patients', async (req, res) => {
            const id = req.query?.id
            let query = {}
            if (req.query?.id) {
                query = { _id: new ObjectId(id) }
            }
            console.log(query);
            const cursor = patientCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Neuron is on')
})

app.listen(port, () => {
    console.log(`Neuron is at ${port}`);
})
