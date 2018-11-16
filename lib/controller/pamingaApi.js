var Promise = require('bluebird');
const bcrypt = require('bcrypt');
var connection = require('../config/db');
const Joi = require('joi');


module.exports = {

    'getCountry': (req, res) => {
        var query1 = 'SELECT name from countries';
        connection.query(query1, function(error, results, fields) {
            if (error) throw error;
            return res.json({
                message: "all country get successfully",
                data: results
            })
            console.log('The solution is: ', results);
        });

    },


    'registerUser': (req, res) => {
        var {
            country_id,
            phone
        } = req.body;

        const schema = Joi.object().keys({
            country_id: Joi.string().alphanum().required().error(errors => {
                return {
                    message: "country code is required"
                }
            }),
            phone: Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/).required().error(errors => {
                return {
                    message: "require phone number of 10 digit number and only number type"
                }
            })
        });
        const result = Joi.validate(req.body, schema);
        if (result.error) {
            return res.json({
                message: result.error.details[0].message,
                status: 400
            })
        } else {
            console.log("there  are the request request",result.value)
            var query1 = 'SELECT dialcode from countries';
            connection.query(query1, function(error, results, fields) {
                if (error) throw error;
                 
                
                var result1 = results.find(obj => {
                    var data1 = (obj.dialcode == country_id)
                    return data1;
                })
                if (result1) {
                    console.log('result--', result1)

                    var val = Math.floor(1000 + Math.random() * 9000);
                    console.log("there are the input",result.value.country_id,result.value.phone,(result.value.country_id+result.value.phone),val)
                    var query = 'insert into users(country_id,phone,userid,otp)values("'+ result.value.country_id + '","' + result.value.phone + '","' + (result.value.country_id+result.value.phone) + '","' + val + '")'
                    
                    connection.query(query, function(error, results, fields) {
                        if (error) throw error;
                        var respose = {
                            otp: val
                        }
                        return res.json({
                            message: "user register successfully",
                            respose
                        })
                    })
                } else {
                    return res.json({
                        message: "please enter valid param"
                    })
                }
            })
        }
    },

    'otpVerify': (req, res) => {
        var {
            country_id,
            phone,
            otp,
            decice_id,
            device_type,
            device_token
        } = req.body;
        const schema = Joi.object().keys({
        country_id: Joi.string().alphanum().required().error(errors => {
            return {
                message: "country code is required"
            }
        }),
        otp: Joi.string().regex(/^\d{1,9}$/).required().error(errors => {
            return {
                message: "otp is required and accept only no"
            }
        }),
        decice_id: Joi.string().alphanum().error(errors => {
            return {
                message: "enter valid device id"
            }
        }),
        device_token: Joi.string().alphanum().error(errors => {
            return {
                message: "enter valid device_token"
            }
        }),
        device_type : Joi.string().alphanum(),
        phone : Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/).required().error(errors => {
            return {
                message: "require phone number of 10 digit number and only number type"
            }
        })
    });
    const result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.json({
            message: result.error.details[0].message,
            status: 400
        })
    } else {

        var query1 = 'SELECT * from  users where phone ="' + phone + '"AND country_id ="' + country_id + '"';
        connection.query(query1, function(error, results, fields) {
            if (error) throw error;
            console.log("there are data", results)
            if (results[0].status == 0) {
                if (results[0].otp == otp) {
                    let query3 = 'UPDATE users SET  status = "' + 1 + '"';
                    connection.query(query3, (error, data, fields) => {

                        if (error) throw error;

                        console.log("there are the result", data)
                        return res.json({
                            message: "otp verify successfully",
                            data
                        })

                    })

                } else {
                    return res.json({
                        message: "please enter valid otp"
                    })
                }
            } else {
                return res.json({
                    message: "user already verified"
                })
            }
        })
    }
    },


'updateProfile' : function(req,res){

   let  {name, userid,id} = req.body;
  var ProfileImage  =  req.files[0].path;
   console.log("there are data----", ProfileImage)
   const schema = Joi.object().keys({

    name: Joi.string().alphanum().required().error(errors => {
        return {
            message: "name is required"
        }
    }),
    userid: Joi.string().alphanum().required().error(errors => {
        return {
            message: "userid id required"
        }
    }),
    id : Joi.string().required()
    
});
const result = Joi.validate(req.body, schema);
if (result.error) {
    return res.json({
        message: result.error.details[0].message,
        status: 400
    })
} else {
  
   let query  = 'UPDATE users SET  name = "'+result.value.name+'",userid = "'+result.value.userid+'",avatar ="'+ProfileImage+'" WHERE id ="'+result.value.id +'"'; 
   connection.query(query, (error, data, fields) => {
    if (error) throw error;
    console.log("there are the result", data)
    return res.json({
        message: 'user update successfully',
        data
     })
    })
  }
},

'AddContacts'  : (req,res) =>{



},
'UpdateUserSettings' : (req,res)=>{

   var {userid, enable_archive, sound, desktop_alerts} = req.body;

   const schema = Joi.object().keys({
    enable_archive: Joi.string().alphanum().required().error(errors => {
        return {
            message: "enable_archive is required"
        }
    }),
    sound : Joi.string().required(),
    userid : Joi.string().required(),
    desktop_alerts : Joi.string().required()
    
});
const result = Joi.validate(req.body, schema);

if (result.error) {
    return res.json({
        message: result.error.details[0].message,
        status: 400
    })
} else { 
    let query  = 'UPDATE usersettings SET  enable_archive = "'+result.value.enable_archive+'",sound = "'+result.value.sound+'",desktop_alerts ="'+result.value.desktop_alerts+'" WHERE userid ="'+result.value.userid+'"'; 
    connection.query(query, (error, data, fields) => {
     if (error) throw error;
     console.log("there are the result", data)
     return res.json({
         message: 'usersettings update successfully',
         data
      })
     })
    } 
  },



'AddStatus' : (req,res) => {
    
   var  {userid,image, caption,created} = req.body;


    const schema = Joi.object().keys({
        userid : Joi.string().required(),
        caption : Joi.string().required()
    });
    const result = Joi.validate(req.body, schema);
    
    if (result.error) {
        return res.json({
            message: result.error.details[0].message,
            status: 400
        })
    } else { 
        var ProfileImage = req.files[0].path;
        var query = 'insert into status_images(userid,image, caption,created)values("'+ result.value.userid + '","' + ProfileImage + '","' + result.value.caption+ '","' + (Date.now()) + '")'                
        connection.query(query, function(error, results, fields) {
            if (error) throw error;
            console.log("there are the fields",results)
            return res.json({
                status : 200,
                message: "user status add successfully",
                results
            })
        })
   }
 },

 
 'ViewStatus' : (req,res)=>{
   var {userid, statusid} =  req.body;
   let query  = 'UPDATE status_images  SET  view_status = "'+1+'" WHERE userid ="'+userid+'" AND id ="'+statusid+'"'; 
   
   connection.query(query, (error, data, fields) => {
    if (error) throw error;
    console.log("there are the result", data)
    return res.json({
        message: 'view status update successfully',
        data
     })
    })

 },


 'Sendimage' : (req,res)=>{
   let {image,caption,created} = req.body;
   image = req.files[0].path;
   caption = caption?caption: "";
   created = new Date().getDate();
   console.log("date--",Date.now())
   var query = 'insert into chat_images(image,caption,created)values("'+ image + '","' + caption + '","'+created+'")'                
   connection.query(query, function(error, results, fields) {
    if (error) throw error;
    console.log("there are the result", results)
    return res.json({
        message: 'image send  successfully',
        results
     })
 })
},

'GetStatus' : (req,res) =>{

let {userid} = req.body;
var query1 = 'SELECT status from users where userid = '+userid;
        connection.query(query1, function(error, results, fields) {
            if (error) throw error;
            return res.json({
                message: "user status get successfully",
                data: results[0]
            })
        });

    },

    'DeleteStatus' : (req,res) =>{
        let {id} = req.body;

    }




}