// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb'); // Import ObjectId

const app = express();
const connectionString = 'mongodb+srv://product:kiet2292003@product.advc5nz.mongodb.net/';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');

        const db = client.db('star-wars-quotes');
        const quotesCollection = db.collection('quotes');

        app.set('view engine', 'ejs');
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(express.static('public'));

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results });
                })
                .catch(error => console.error(error));
        });

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log(result);
                    res.redirect('/');
                })
                .catch(error => console.error(error));
        });

        app.post('/updateQuote', (req, res) => {
            const idToUpdate = req.body.idToUpdate; // Chắc chắn rằng idToUpdate là chuỗi
            const newName = req.body.newName;
        
            quotesCollection.updateOne(
                { _id: new ObjectId(idToUpdate) }, // Chuyển đổi id từ dạng string sang ObjectId
                { $set: { name: newName } }
            )
            .then(result => {
                console.log('Quote updated');
                res.redirect('/');
            })
            .catch(error => console.error(error));
        });
        

        app.post('/deleteQuote', (req, res) => {
            const nameToDelete = req.body.nameToDelete;

            quotesCollection.deleteOne({ name: nameToDelete })
                .then(result => {
                    console.log(`Deleted ${nameToDelete}'s quote`);
                    res.redirect('/');
                })
                .catch(error => console.error(error));
        });

        app.listen(3000, function() {
            console.log('Listening on port 3000');
        });
    });

//...
