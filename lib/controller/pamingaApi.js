var Promise = require('bluebird');
const bcrypt = require('bcrypt');
var connection = require('../config/db');
const Joi = require('joi');


module.exports = {

    'getCountry': (req, res) => {
        var query1 = 'SELECT id,name,dialcode,iso2,iso3 from countries';
        connection.query(query1, function (error, results, fields) {
            if (error) throw error;
            return res.json({
                message: "List of all Countries.!!",
                data: results
            })
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
            console.log("there  are the request request", result.value)
            var query1 = 'SELECT dialcode from countries';
            connection.query(query1, function (error, results, fields) {
                if (error) throw error;


                var result1 = results.find(obj => {
                    var data1 = (obj.dialcode == country_id)
                    return data1;
                })
                if (result1) {
                    console.log('result--', result1)

                    var val = Math.floor(1000 + Math.random() * 9000);
                    console.log("there are the input", result.value.country_id, result.value.phone, (result.value.country_id + result.value.phone), val)
                    var query = 'insert into users(country_id,phone,userid,otp)values("' + result.value.country_id + '","' + result.value.phone + '","' + (result.value.country_id + result.value.phone) + '","' + val + '")'

                    connection.query(query, function (error, results, fields) {
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
            device_type: Joi.string().alphanum(),
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

            var query1 = 'SELECT * from  users where phone ="' + phone + '"AND country_id ="' + country_id + '"';
            connection.query(query1, function (error, results, fields) {
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


    'updateProfile': function (req, res) {

        let {
            name,
            userid,
            id
        } = req.body;
        var ProfileImage = req.files[0].path;
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
            id: Joi.string().required()

        });
        const result = Joi.validate(req.body, schema);
        if (result.error) {
            return res.json({
                message: result.error.details[0].message,
                status: 400
            })
        } else {

            let query = 'UPDATE users SET  name = "' + result.value.name + '",userid = "' + result.value.userid + '",avatar ="' + ProfileImage + '" WHERE id ="' + result.value.id + '"';
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

    'AddContacts': (req, res) => {



    },
    'UpdateUserSettings': (req, res) => {

        var {
            userid,
            enable_archive,
            sound,
            desktop_alerts
        } = req.body;

        const schema = Joi.object().keys({
            enable_archive: Joi.string().alphanum().required().error(errors => {
                return {
                    message: "enable_archive is required"
                }
            }),
            sound: Joi.string().required(),
            userid: Joi.string().required(),
            desktop_alerts: Joi.string().required()

        });
        const result = Joi.validate(req.body, schema);

        if (result.error) {
            return res.json({
                message: result.error.details[0].message,
                status: 400
            })
        } else {
            let query = 'UPDATE usersettings SET  enable_archive = "' + result.value.enable_archive + '",sound = "' + result.value.sound + '",desktop_alerts ="' + result.value.desktop_alerts + '" WHERE userid ="' + result.value.userid + '"';
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



    'AddStatus': (req, res) => {

        var {
            userid,
            image,
            caption,
            created
        } = req.body;


        const schema = Joi.object().keys({
            userid: Joi.string().required(),
            caption: Joi.string().required()
        });
        const result = Joi.validate(req.body, schema);

        if (result.error) {
            return res.json({
                message: result.error.details[0].message,
                status: 400
            })
        } else {
            var ProfileImage = req.files[0].path;
            var query = 'insert into status_images(userid,image, caption,created)values("' + result.value.userid + '","' + ProfileImage + '","' + result.value.caption + '","' + (Date.now()) + '")'
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                console.log("there are the fields", results)
                return res.json({
                    status: 200,
                    message: "user status add successfully",
                    results
                })
            })
        }
    },


    'ViewStatus': (req, res) => {
        var {
            userid,
            statusid
        } = req.body;
        let query = 'UPDATE status_images  SET  view_status = "' + 1 + '" WHERE userid ="' + userid + '" AND id ="' + statusid + '"';

        connection.query(query, (error, data, fields) => {
            if (error) throw error;
            console.log("there are the result", data)
            return res.json({
                message: 'view status update successfully',
                data
            })
        })

    },


    'Sendimage': (req, res) => {
        let {
            image,
            caption,
            created
        } = req.body;
        image = req.files[0].path;
        caption = caption ? caption : "";
        created = new Date().getDate();
        console.log("date--", Date.now())
        var query = 'insert into chat_images(image,caption,created)values("' + image + '","' + caption + '","' + created + '")'
        connection.query(query, function (error, results, fields) {
            if (error) throw error;
            console.log("there are the result", results)
            return res.json({
                message: 'image send  successfully',
                results
            })
        })
    },

    'GetStatus': (req, res) => {

        let {
            userid
        } = req.body;
        var query1 = 'SELECT status from users where userid = ' + userid;
        connection.query(query1, function (error, results, fields) {
            if (error) throw error;
            return res.json({
                message: "user status get successfully",
                data: results[0]
            })
        });

    },

    'DeleteStatus': (req, res) => {
        let {
            id
        } = req.body;
        var query1 = 'SELECT status from status_images where id = ' + id;

        connection.query(query1, function (error, results, fields) {
            if (error) throw error;
            console.log("there are the result -----", results[0].status);
            if (results[0].status !== 1) {
                let query = 'UPDATE status_images  SET  view_status = "' + 0 + '" WHERE id ="' + id + '"';
                connection.query(query, (error, data, fields) => {

                    if (error) throw error;
                    console.log("there are the result", data)
                    return res.json({
                        message: 'status deleted successfully',
                        data
                    })

                })
            } else {
                return res.json({
                    message: 'this id status alredy deleted',
                    status: 400
                })
            }
        })

    },




    /* api for Add Two Step Verification Pin */

    'addTwoStepVerificationPin': (req, res) => {
        let {
            pin_id,
            id
        } = req.body;
        const schema = Joi.object().keys({
            id: Joi.string().required(),
            pin_id: Joi.string().alphanum().min(6).max(6).required().error(errors => {
                return {
                    message: "pin_id required 6 digit alphanum"
                }
            })
        });
        const result = Joi.validate(req.body, schema);
        if (result.error) {
            return res.status(400).json({
                message: result.error.details[0].message,
                status: 400
            })
        } else {
            var query1 = 'SELECT * from users where id = ' + id;

            connection.query(query1, function (error, results, fields) {
                if (error) throw error;
                console.log("there are the reult", results)
                if (results.length > 0) {
                    let query3 = 'UPDATE users SET  pin_id = "' + result.value.pin_id + '" where id = "' + result.value.id + '"';
                    connection.query(query3, (error, data, fields) => {
                        if (error) throw error;
                        console.log("there are the result", data)
                        return res.json({
                            message: "pin_id add successfully",
                            data
                        })

                    })
                } else {
                    return res.status(400).json({
                        message: "please enter valid id",
                        status: 400

                    })

                }
            })

        }
    },



    /* Add Two Step Verification Email */

    'addTwoStepVerificationEmail': (req, res) => {
        let { email, id } = req.body
        const schema = Joi.object().keys({
            id: Joi.string().required().regex(/^\d+(\.\d{1,9})?$/).error(errors => {
                return {
                    message: "please enter id in numbewr format."
                }
            }),
            email: Joi.string().email().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required().error(errors => {
                return {
                    message: "please enter a valid email."
                }
            }),
        });
        const result = Joi.validate(req.body, schema);
        if (result.error) {
            return res.status(400).json({
                message: result.error.details[0].message,
                status: 400
            })
        } else {
            let query3 = 'UPDATE users SET verifyemail  = "' + result.value.email + '" where id = "' + result.value.id + '"';
            connection.query(query3, (error, data, fields) => {
                if (error) throw error;
                console.log("there are the result", data)
                return res.status(200).json({
                    message: "verification mail add successfully",
                    status: 200,
                    data
                })


            })
        }
    },


    /* api for Get Two Step Verification Status */
    "getTwoStepVerificationStatus": (req, res) => {
        let { id } = req.body;
        var query1 = 'SELECT  id,userid,verifystatus from users where id = ' + id;
        connection.query(query1, (error, data, fields) => {
            if (error) throw error;
            console.log("there are the result", data.length)
            if (data.length >= 0) {

                return res.status(200).json({
                    message: "status get successfully",
                    status: 200,
                    data
                })
            } else {
                res.status(400).json({
                    meassage: "please enter the valid id",
                    status: 400

                })
            }


        })
    },

    /* Disable Two Step Verification */


    "disableTwoStepVerication": (req, res) => {

        let { id } = req.body;

        let query3 = 'UPDATE users SET verifyemail  = "' + '' + '",verifypin = "' + 0 + '",verifystatus = "' + 0 + '" where id = "' + id + '"';
        connection.query(query3, (error, data, fields) => {
            if (error) throw error;
            console.log("there are the result", data)
            return res.status(200).json({
                message: "disable two step verification successfully",
                status: 200,
                data
            })
        })

    },


    /*Set Account Privacy For lastseen,profilephoto,about*/

    'setAccountPrivacy': (req, res) => {



    }


}