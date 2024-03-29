const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6w1pi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

// async function
async function run() {
    try {
        await client.connect();
        const database = client.db('expressExit');
        const servicesCollection = database.collection('services');


        console.log("all routes should work")
        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:serviceId', async (req, res) => {
            const serviceId = req.params.serviceId;
            const query = { _id: ObjectId(serviceId) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });


        //DELETE 
        app.delete('/services/:serviceId', async (req, res) => {
            const serviceId = req.params.serviceId;
            const query = { _id: ObjectId(serviceId) }
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Express Exit Server Is Running');
});

// app.get('/hello', (req,res)=>{
//     res.send('hello updated here')
// })

app.listen(port, () => {
    console.log('Server running at port', port);
})



///////
// https://express-exit-server-site-oxxyexek0-mownitaa.vercel.app/
//////

