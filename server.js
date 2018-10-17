const express  =  require('express');
var Promise = require('bluebird');
const bodyparser = require('body-parser');
const mysql      = require('mysql');
var pagination = require('pagination')
const cors   =  require('cors');
var  app    =  express();
app.use(cors());
app.use(bodyparser({limit: '50mb'}))
app.use(bodyparser.urlencoded({limit: '50mb'}));
app.use(bodyparser());
app.use(bodyparser.json());
require('dotenv').config();

/*
sql database connection
*/
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'openfire'
});
var queryAsync = Promise.promisify(connection.query.bind(connection));
connection.connect();
//connection.connect();


/*
service for the getuser data
*/

app.get('/user/getUser',(req,res) =>{
  var query1 = 'SELECT * from users where id = 1';
  connection.query(query1, function (error, results, fields) {
    if (error) throw error;
    res.json({message : "user get successfully",data : results})
    console.log('The solution is: ',results);
  });

})



/*
api for get all user 
*/
app.get('/user/getallUser',(req,res) =>{
  var query1 = 'SELECT * from users';
  connection.query(query1, function (error, results, fields) {
    if (error) throw error;
    res.json({message : "user get successfully",data : results})
    console.log('The solution is: ',results);
  });

})





app.get('/getUserWithPagination', function (req, res) {
  var numRows;
  var queryPagination;
  var numPerPage =parseInt(req.query.npp); //parseInt(req.query.npp, 10) || 2;
  var page =parseInt(req.query.page);// parseInt(req.query.page, 10) || 0;
  var numPages;
  var skip = (page-1) * numPerPage;

  // Here we compute the LIMIT parameter for MySQL query

  var limit = skip + ',' + skip + numPerPage;
  queryAsync('SELECT count(*) as numRows FROM users')
  .then(function(results) {
    numRows = results[0].numRows;
    numPages = Math.ceil(numRows / numPerPage);
    console.log('number of pages:', numPages);
  })
  .then(() => queryAsync('SELECT * FROM users where userid is not null ORDER BY ID DESC LIMIT ' + skip +','+ numPerPage ))
  .then(function(results) {
    console.log(results.length,"the lenght of the result",numRows)
    var responsePayload = {
      results: results,
      totalpages : numRows
    };
    if (page < numPages) {
      responsePayload.pagination = {
        current: page,
        perPage: numPerPage,
        previous: page > 0 ? page - 1 : undefined,
        next: page < numPages - 1 ? page + 1 : undefined
      }
    }
    else responsePayload.pagination = {
      err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
    }
    res.json(responsePayload);
  })
  .catch(function(err) {
    console.error(err);
    res.json({ err: err });
  });
});



// connection.end();

let port = process.env.PORT || 5000;
app.listen(port,function(req,res){
   console.log("app is listen on the port no ",port);
})
module.exports = app;
