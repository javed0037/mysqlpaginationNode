var Promise = require('bluebird');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pagination = require('pagination')
var config = require('../config/passpord_config');
var connection = require('../config/db');



var queryAsync = Promise.promisify(connection.query.bind(connection));
connection.connect();

module.exports = {

    'getUser' : (req,res) => {
      var query1 = 'SELECT * from users where id = 1';
      connection.query(query1, function (error, results, fields) {
        if (error) throw error;
        res.json({message : "user get successfully",data : results})
        console.log('The solution is: ',results);
      });
    },


  'getallUser' : (req,res) => {
      
    var query1 = 'SELECT id,userid,status from users';
    connection.query(query1, function (error, results, fields) {
      if (error) throw error;
      res.json({message : "user get successfully",data : results})
      console.log('The solution is: ',results);
    });
  },

    

  'login' : (req,res) => {
    let  {username,password} = req.body;
    //select * from users where name = 'admin';

    var query1 = 'SELECT id,userid,status from users';
    connection.query(query1, function (error, results, fields) {
      if (error){
      return res.json({message : "error",savedata : error})
      }
      else{
      
      if(username === 'admin' && password ==='1234567'){
        var token = jwt.sign({ id: results.id  }, config.secret, {
          expiresIn: "365d"
        });   
        console.log('token,token',token,'results.id',results[1].id);
        
        res.json({message: 'login successfully',accessToken  : token,id : 123456,typeid : 44785,status : 200})

        }else res.json({message : 'please enter the right user name and password'})
      }
    })

  },


  'getUserWithPagination' : (req,res) => {
    var numRows;
    var queryPagination;
    var numPerPage = parseInt(req.query.npp); //parseInt(req.query.npp, 10) || 2;
    var page = parseInt(req.query.page);// parseInt(req.query.page, 10) || 0;
    var numPages;
    var skip = (page-1) * numPerPage;
  
    /*
    Here we compute the LIMIT parameter for MySQL query
  */
    var limit = skip + ',' + skip + numPerPage;
    queryAsync('SELECT count(*) as numRows FROM users where userid is not null')
    .then(function(results) {
      numRows = results[0].numRows;
      numPages = Math.ceil(numRows / numPerPage);
      console.log('number of pages:', numPages);
    })
    .then(() => queryAsync(' SELECT id,userid,status FROM users where userid is not null ORDER BY ID DESC LIMIT ' + skip +','+ numPerPage ))
    .then(function(results) {
      console.log(results.length,"the lenght of the result",numRows)
      var responsePayload = {
        results: results,
        totalpages : numRows
      };
     
      res.json(responsePayload);
    })
    .catch(function(err) {
      console.error(err);
      res.json({ err: err });
    });
  
  
  
  },

  'getUserDetails' : (req,res) =>{
    var userid = req.query.userid;
    let query  =  'select *  from users where userid = '+userid;
    connection.query(query, function (error, results, fields) {
      if(error){
       return  res.json({ message : 'error to get data',error : error})
      }else if(results){
         return res.json({message : 'user details get successfully',results : results})
  
      }
   })

  },
  'updateprofile' : (req,res)=>{
    var userid = req.query.userid;
    
      var {name,email,phone,expiredate,Status,phonewipe} = req.body;
      console.log("resquest paramenter",req.body)
     let query =  'UPDATE users SET name = "'+name+'",phone = "'+phone+'",email ="'+email+'",Status ="'+Status+'" WHERE userid ="'+userid +'"';
    
     connection.query(query, function (error, results, fields) { 
       if(error){
         console.log("there are the error",error)
        return  res.json({ message : 'error to get data',error : error,status : 400})
      }else if(results){
        console.log('there are result',results);
        
         return res.json({message : 'user profile update successfully',results : results,status : 200})
    
       }
    
    })

  },

  'deleteUser' : (req,res) =>{
    var userid = req.query.userid;
      
      let query = 'DELETE FROM users WHERE userid ="'+userid +'"';
      
      connection.query(query, function (error, results, fields) { 
      if(error){
      console.log("there are the error",error)
      return res.json({ message : 'error to get data',error : error})
      }else if(results){
      console.log('there are result',results);
      return res.json({message : 'user delete successfully',results : results})
      
      }
      
      })

  },
  'getUserDetails1' : (req,res)=>{
    
    let {name,email,phone,status} = req.body;
    let {npp}  =  req.query;
    
    name=(name)?name: '';
    phone =(phone)?phone : null;
    email = (email)?email : '';
    status = (status)?status : null;
    var blk="";
    
        console.log('phone',phone ,"name" ,name)
        var numRows;
        var queryPagination;
        var numPerPage =parseInt(req.query.npp); //parseInt(req.query.npp, 10) || 2;
        var page =parseInt(req.query.page);// parseInt(req.query.page, 10) || 0;
        var numPages;
        var skip = (page-1) * numPerPage;
        var limit = skip + ',' + skip + numPerPage;
    
    
    var querycondition=" where phone=(case when "+phone+" is null then phone else "+phone+"  end) and status=(case when "+status+" is null then status else "+status+"  end) and (case when '"+email+"'='' then 1=1 else email like '%"+email+"%' end)  and (case when '"+name+"'='' then 1=1 else name like '%"+name+"%' end) and userid is not null ORDER BY ID DESC LIMIT " + skip +","+ numPerPage;
    var query1 = "SELECT * FROM users" +querycondition; 
    
      queryAsync('SELECT count(*) as numRows FROM users where userid is not null')
        .then(function(results) {
    
            numRows = results[0].numRows;
            numPages = Math.ceil(numRows / numPerPage);
          })
      .then(() => queryAsync(query1 ))
      .then(function(results) {
    
        console.log(results.length,"the lenght of the result",numRows)
        var responsePayload = {
    
          results: results,
          totalpages : numRows
        };
        res.json({message: "user dataa get successfully",responsePayload : responsePayload});
      })
      .catch(function(err) {
        console.error(err);
        res.json({ err: err });
      });
    
    
    },
    
   
    'addNewuser' : (req,res) =>{
      var {username,email,password,phone,status,} = req.body;
      bcrypt.hash(password, 10, function(err, hash) {
        if(err){
          return res.json({ message : 'error to bcrypt the password',error : err,status : 400})
        }else if(hash){
          console.log("passowd hashed successfully",hash)
        // Store hash in databas
         var query =  'insert into users (username,email,password,phone,status)values("'+username+'","'+email+'","'+hash+'","'+phone+'","'+status+'")'
         connection.query(query, function (error, results, fields) { 
        if(error){
        console.log("there are the error",error)
        return res.json({ message : 'please enter the uniqe name and email and phone',error : error,status :400})
        }else if(results){
        console.log('there are result',results);
        return res.json({message : 'new user create  successfully',results : results,status : 200})
        
        }
        
    })
    }
      })
    },

    
    'colorCode' : (req,res)=>{
       var query = 'select * from chatwalls'
       connection.query(query,(error, results, fields) =>{ 
        if(error){
        console.log("there are the error",error)
        return res.json({ message : 'some thing went wrong',error : error,status :400})
        }else if(results){
        console.log('there are result',results);
        return res.json({message : 'color code get successfully',results : results,status : 200})
        
       }
       })
      },
    
    
   'getAboutUs':(req,res)=>{
    var id = req.query.id;
    var query = 'select * from pages where id ='+id;
    connection.query(query,(error, results, fields) =>{ 
      if(error){
      console.log("there are the error",error)
      return res.json({ message : 'some thing went wrong',error : error,status :400})
      }else if(results){
      console.log('there are result',results);
      return res.json({message : 'user discripations  get successfully',results : results,status : 200})
       
    
      }
    })
    
    },
    
    'updateaboutUs' : (req,res) =>{
    let {title,description,Status,userid}  = req.body;
    let query  = 'UPDATE pages SET  title = "'+title+'",description = "'+description+'",Status ="'+Status+'" WHERE id ="'+userid +'"';
      connection.query(query,(error, results, fields) =>{ 
        if(error){
        console.log("there are the error",error)
        return res.json({ message : 'some thing went wrong',error : error,status :400})
        }else if(results){
        console.log('there are result',results);
        return res.json({message : 'fields update successfully',results : results,status : 200})
         
      
        }
      })
    },
    'deleteColor' : (req,res) =>{

      let {id} =  req.query;
      let query = 'DELETE FROM chatwalls WHERE id ="'+id +'"';

      connection.query(query,(error, results, fields) =>{ 
        if(error){
        console.log("there are the error",error)
        return res.json({ message : 'some thing went wrong',error : error,status :400})
        }else if(results){
        console.log('color delete successfully',results);
        return res.json({message : 'color delete successfully',results : results,status : 200})
         
      
        }
      })

    },


    'middleware' :(req,res,next)=>{

      var token =  req.headers["authorization"];

    if (token) {
      try {
        token = token.split(' ')[1];
        var decoded = jwt.verify(token,config.secret,function (err,decoded){

          if(err){
            return res.json({status :400, message: 'Authorization token is not valid',error : err});
          }else {
            console.log(decoded,"decoded token")
            req.user = decoded;
            next();
          }
        });
      } catch (e) {
        return res.send({status:400, message: 'Authorization token is not valid'});
      }
    } else {
      console.log("No token");
      return res.send({status:400,message: 'Authorization token missing in request.'});
   }
}
}
    
   
    
    
    
    