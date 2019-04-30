const Joi = require('joi');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

app.use(express.json());

//Dummy Data
const coins = [
   { id: 1, name: 'Dolar'},
   { id: 2, name: 'Colon'},
   { id: 3, name: 'Euro'}
];

// Routes handler
app.get('/api/coins', (req, res) => {
   res.send(coins);
});

app.post('/api/coins', (req, res) => {
   const result = validateCoin(req.body);
   if(result.error){ //400 Bad Request
      res.status(400).send(result.error.details[0].message);
      return;
   }
   const coin = {
      id: coins.length + 1,
      name: req.body.name
   };
   coins.push(coin);
   res.send(coin);
});

app.put('/api/coin/:id', (req, res) => {
   const coin = coins.find(c => c.id === parseInt(req.params.id));
   if (!coin){ // 404 Not found
      res.status(404).send('Moneda no encontrada.');
      return;
   }

   const result = validateCoin(req.body);
   if(result.error){ // 400 Bad Request
      res.status(400).send(result.error.details[0].message);
      return;
   }

  coin.name = req.body.name;
  res.send(coin);
});

app.delete('/api/coin/:id', (req, res) => {
   const coin = coins.find(c => c.id === parseInt(req.params.id));
   if (!coin) {
      res.status(404).send('Moneda no encontrada.');
      return;
   }

   const index = coins.indexOf(coin);
   coins.splice(index, 1);

   res.send(coin);
});


app.get('/api/coin/:id', (req, res) => {
   const coin = coins.find(c => c.id === parseInt(req.params.id));
   if (!coin) res.status(404).send('Moneda no encontrada.');
   res.send(coin);
});

function validateCoin(coin){
   const schema = {
      name: Joi.string().min(3).required()
   };
   return Joi.validate(coin, schema);
}

// Database connection

const uri = "mongodb+srv://Vorbote:dontprayforme159%2A@cluster0-nflr2.gcp.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("CoinsApi").collection("coins");
  // perform actions on the collection object
  client.close();
});

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on port ${port}...`));
