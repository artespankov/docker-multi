const keys = require('./keys');


// EXPRESS APP SETUP
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// App - object for receiving requests and send back responses for React app
const app = express();
// Cors - Cross Origin Resource Sharing
// Allows to communicate between one domain (React app)
// and another domain (Express API)
app.use(cors());
// BodyParse - parser to decode requests incoming
// from React app and encode responses
// returned by Express API
app.use(bodyParser.json());


// POSTGRES CLIENT SETUP
const { Pool } = require('pg');
const pgClient = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    database: keys.pgDatabase,
    user: keys.pgUser,
    password: keys.pgPassword
});
pgClient.on('error', () => console.log('Lost PG connection'));
pgClient.query('CREATE TABLE IF NOT EXISTS fib_values (number INT)')
.catch(err => console.log(err));


// REDIS CLIENT SETUP
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();


// EXPRESS ROUTE HANDLERS
app.get('/', (req, res) => {
    res.send('Welcome back Home, pilgrim!');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM fib_values');
    res.send(values.rows);
});

app.get('/values/current', async (req, res) =>{
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    })
});

app.post('/values', async (req, res) => {
    const index = req.body.index;
    if(parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }
    redisClient.hset('values', index, "Nothing yet!");
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO fib_values(number) VALUES($1)', [index]);
    res.send({working: true});
});

app.listen(5000, err => {
    console.log('Listening');
});