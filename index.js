/*globals require, console, process */
var express = require('express');
var bodyParser = require('body-parser');

// METODI E VARIABILI
var assignments_list = [];

class Assignment{
    constructor(assignment_type, student_id, assignment_id, assignment_content) {
        this.assignment_type = assignment_type;
        this.student_id = student_id;
        this.assignment_id = assignment_id;
        this.assignment_content = assignment_content;
    }
}

// instantiate express
var app = express();
var router = express.Router();

//Configure bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;

//Services
router.get('/', function (req, res) {
    res.end("Benvenuto nella API EsempioEsame-Assignments!");
});

/**
 * Restituisce una lista di aule disponibili per un'ora specificata. Il formato dell'output è specificato nei parametri.
 */
router.route('/assignments')
    .get(function (req, res) {

        console.log('\n');
        console.log('GET received');

        res.send(assignments_list);
        res.end();
        
    })
    .post(function (req, res) {        
        console.log('\n');
        console.log('POST received');
        
        //Ottieni parametri dal client
        var assignment_type = req.body.assignment_type;
        var student_id = req.body.student_id;
        var assignment_id = req.body.assignment_id;
        var assignment_content = req.body.assignment_content;

        assignments_list.push(new Assignment(assignment_type, student_id, assignment_id, assignment_content));

        res.send("Elemento aggiunto");
        res.end();
    });

// middleware route to support CORS and preflighted requests
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});

// register our router on /api
app.use('/api', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});

//Start listening on port
app.listen(port, function () {
    console.log('Example app listening on port '+ port);
});