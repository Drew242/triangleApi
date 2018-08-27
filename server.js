var configFile = require('./config');
var Triangle = require('./models/triangle'); // model needed for triangle API
var triangles = require('./triangles'); // json data to seed db

var mongoose = require('mongoose');
mongoose.connect(configFile.mongoDbConnection, { useNewUrlParser: true }); // connect to MongoDB

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


var port = process.env.PORT || 8081;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    console.log('Route tagged');
    next(); // make sure we go to the next routes and don't hang here
})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'Triangles. Triangles everywhere.' });
});

// on routes that end in /seed
router.route('/seed')

    // seed db
    .post(function (req, res) {
        console.log('Seeding the DB')
        
        for (var i = 0; i < triangles.length; i++) {
            var triangle = new Triangle();
            triangle.name = triangle.name;
            triangle.coordinates = triangle.coordinates;

            triangle.save(function (err) {
                if (err)
                    res.send(err);
    
                res.json({ message: `${triangle.name} created` });
            })
        }
    })

// on routes that end in /triangles
router.route('/triangles')

//     // create a new triangle
//     .post(function (req, res) {
//         console.log('In the POST')

//         var triangle = new Triangle();
//         triangle.name = req.body.name;
//         triangle.coordinates = req.body.coordinates;

//         console.log(req.body);
//         // save the triangle and check for errors
//         triangle.save(function (err) {
//             if (err)
//                 res.send(err);

//             res.json({ message: 'Triangle Created' });
//         })
//     })

    // get all the triangles (accessed at GET http://localhost:8080/api/triangles)
    .get(function (req, res) {
        console.log('In the GET')
        Triangle.find(function (err, triangles) {
            if (err)
                res.send(err);
            res.json(triangles);
        });
    });

router.route('/triangles/:triangle_name')

    // get the triangle with that id (accessed at GET http://localhost:8080/api/triangles/:triangle_name)
    .get(function (req, res) {
        console.log('GETting Triangle by ID')
        Triangle.find({name: req.params.triangle_name}, function (err, triangle) {
            if (err)
                res.send(err);
            res.json(triangle);
        })
    })

router.route('/triangles/:triangle_coordinates')

    // get the triangle with that id (accessed at GET http://localhost:8080/api/triangles/:triangle_coordinates)
    .get(function (req, res) {
        console.log('GETting Triangle by ID')
        Triangle.find({coordinates: req.params.triangle_coordinates}, function (err, triangle) {
            if (err)
                res.send(err);
            res.json(triangle);
        })
    })

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);