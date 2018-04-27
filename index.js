var express = require('express');
var app = express();
var mongodb = require('mongodb');
const path = require('path');
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.get('/mongodb', function (request, response) {
  mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
    if(err) throw err;
    var db = client.db('heroku_fbn41qh9');
    //get collection of routes
    var Routes = db.collection('Routes');
    //get all Routes with frequency >=1
    Routes.find({ frequency : { $gte: 0 } }).sort({ name: 1 }).toArray(function (err, docs) {
      if(err) throw err;
        response.render('pages/mongodb', {results: docs});
    });
    //close connection when your app is terminating.
    client.close(function (err) {             
      if(err) throw err;         
    }); 
  });//end of connect
});//end app.get

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));