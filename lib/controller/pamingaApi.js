const jwt = require('jsonwebtoken');
const config = require('../config/passpord_config')
var Promise = require('bluebird');
const bcrypt = require('bcrypt');
var connection = require('../config/db');
const resHndlr = require("../global/Responder");
const path = require('path')
const fs = require('fs')
const validator = require('express-joi-validation')({})
let {
    successResult,
    verifyData,
    encodePassword,
    encodeEmail,
    serverError,
    mergeArray,
    countryCode,
    generateRandomString,
    validate,
    parameterMissing,
    createUniqueId
} = require("../global/globalFunction");
const Joi = require('joi');
let {
    VERIFICATION_MESSAGE,
    ERROR_True,
    ERROR_False
} = require("../global/message");
let {
    PARAMETER_MISSING_STATUS,
    BAD_REQUEST_STATUS,
    SUCCESS_STATUS,
    SUCCESS,
    ERROR,
} = require("../global/status");


module.exports = {

    'countryList': (req, res) => {
        var query1 = 'SELECT id,name,dialcode,iso2,iso3 from countries';
        connection.query(query1, function (error, results, fields) {
            if (error) {
                resHndlr.apiResponder(
                    req,
                    res,
                    "error to get country list.!!",
                    ERROR,
                    ERROR_False,
                );
            }

            resHndlr.apiResponder(
                req,
                res,
                "List of all Countries.!!",
                SUCCESS,
                ERROR_True,
                results,
            );
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
            resHndlr.apiResponder(
                req,
                res,
                result.error.details[0].message,
                ERROR,
                ERROR_False,
            );
        } else {
            var query1 = 'SELECT dialcode from countries';
            connection.query(query1, function (error, results, fields) {
                if (error) {
                    console.log("there are the error", error);
                    resHndlr.apiResponder(
                        req,
                        res,
                        "error to get data ..!!!!",
                        ERROR,
                        ERROR_False,
                    );
                }
                else
                    var result1 = results.find(obj => {
                        var data1 = (obj.dialcode == country_id)
                        return data1;
                    })
                if (result1) {
                    console.log('result--', result1)
                    var val = Math.floor(1000 + Math.random() * 9000);
                    var query = 'insert into users(country_id,phone,userid,otp)values("' + result.value.country_id + '","' + result.value.phone + '","' + (result.value.country_id + result.value.phone) + '","' + val + '")'
                    var data = {
                        otp: val
                    }
                    connection.query(query, function (error, results, fields) {
                        if (error) {
                            console.log("there are the error state", error.sqlState)
                            if (error.sqlState == 23000) {

                                let query3 = 'UPDATE users SET  otp = "' + val + '" where userid = "' + (result.value.country_id + result.value.phone) + '"';
                                connection.query(query3, (error, data11, fields) => {
                                    if (error) {
                                        resHndlr.apiResponder(req, res, "error to get data ..!!!!", ERROR, ERROR_False,
                                        );
                                    }
                                    else {
                                        console.log("really going on");
                                        return res.json({
                                            code: 0,
                                            error: false,
                                            allreadyregistered: "true",
                                            message: "Registration successfully done.!!",
                                            data
                                        })
                                    }

                                })


                            }
                            else {
                                return res.json({
                                    code: 1,
                                    error: true,
                                    allreadyregistered: true,
                                    message: "error to get data",
                                })
                            }

                        } else {
                            return res.json({
                                code: 0,
                                error: false,
                                allreadyregistered: false,
                                message: "Registration successfully done.!!",
                                data
                            })
                        }
                    })
                } else {
                    resHndlr.apiResponder(
                        req,
                        res,
                        "please enter valid param..!!!!",
                        ERROR,
                        ERROR_False,
                    );
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
            resHndlr.apiResponder(
                req,
                res,
                result.error.details[0].message,
                ERROR,
                ERROR_False,
            );
        } else {
            var query1 = 'SELECT * from  users where phone ="' + phone + '"AND country_id ="' + country_id + '"';
            connection.query(query1, function (error, results, fields) {
                if (error) {
                    resHndlr.apiResponder(
                        req,
                        res,
                        "error to get data ..!!!!",
                        ERROR,
                        ERROR_False,
                    );
                }
                if (results.length > 0) {
                    if (results[0].otp == otp) {
                        let query3 = 'UPDATE users SET  status = "' + 1 + '"';
                        connection.query(query3, (error, data, fields) => {

                            if (error) {
                                resHndlr.apiResponder(
                                    req,
                                    res,
                                    "error to get data ..!!!!",
                                    ERROR,
                                    ERROR_False,
                                );

                            }
                            var token = jwt.sign({ id: results[0].id }, config.secret, {
                                expiresIn: "365d"
                            });
                            var data1 = {
                                id: results[0].id,
                                userid: results[0].userid,
                                phone: results[0].phone,
                                token: token

                            }
                            console.log("there are the result", data)
                            resHndlr.apiResponder(
                                req,
                                res,
                                "otp verify successfully.!!",
                                SUCCESS,
                                ERROR_True,
                                data1,
                            );
                        })

                    } else {
                        resHndlr.apiResponder(
                            req,
                            res,
                            "please enter valid otp..!!!!",
                            ERROR,
                            ERROR_False,
                        );
                    }
                } else {
                    resHndlr.apiResponder(
                        req,
                        res,
                        "user does not exist please check!!!!",
                        ERROR,
                        ERROR_False,
                    );


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
        var ProfileImage = ((req.files[0].path) ? req.files[0].path : "");
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

        });
        const result = Joi.validate(req.body, schema);
        if (result.error) {
            resHndlr.apiResponder(
                req,
                res,
                result.error.details[0].message,
                ERROR,
                ERROR_False,
            );
        } else {
            var query1 = 'SELECT status from users where userid = ' + userid;
            connection.query(query1, function (error, results, fields) {
                if (error) {
                    resHndlr.apiResponder(
                        req, res, "error to get data ..!!!!", ERROR, ERROR_False);
                }
                console.log("there are the result", results)
                if (results.length > 0) {

                    let query = 'UPDATE users SET  name = "' + result.value.name + '",avatar ="' + ProfileImage + '" WHERE userid ="' + result.value.userid + '"';
                    connection.query(query, (error, data, fields) => {
                        if (error) {
                            resHndlr.apiResponder(
                                req,
                                res,
                                "error to get data ..!!!!",
                                ERROR,
                                ERROR_False,
                            );
                        }
                        resHndlr.apiResponder(
                            req,
                            res,
                            "user update successfully!!",
                            SUCCESS,
                            ERROR_True
                        );
                    })
                } else {
                    resHndlr.apiResponder(
                        req,
                        res,
                        "please enter the valid userid",
                        ERROR,
                        ERROR_False
                    );

                }
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
            resHndlr.apiResponder(
                req,
                res,
                result.error.details[0].message,
                ERROR,
                ERROR_False,
            );
        } else {
            let query = 'UPDATE usersettings SET  enable_archive = "' + result.value.enable_archive + '",sound = "' + result.value.sound + '",desktop_alerts ="' + result.value.desktop_alerts + '" WHERE userid ="' + result.value.userid + '"';
            connection.query(query, (error, data, fields) => {
                if (error) resHndlr.apiResponder(req, res, "error to get data ..!!!!", ERROR, ERROR_False);
                console.log("there are the result", data)
                resHndlr.apiResponder(
                    req,
                    res,
                    "usersettings update successfully!!",
                    SUCCESS,
                    ERROR_True
                );
            })
        }
    },



    'addStatus': (req, res) => {

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
            resHndlr.apiResponder(
                req,
                res,
                result.error.details[0].message,
                ERROR,
                ERROR_False,
            );
        } else {
            var ProfileImage = req.files[0].path;
            var query = 'insert into status_images(image, caption,uid,created)values( "' + ProfileImage + '","' + result.value.caption + '", "' + 428 + '", "' + (Date.now()) + '")';
            console.log("there are the userid", query);
            connection.query(query, function (error, results, fields) {
                console.log("there are the error", error)
                if (error) {
                    resHndlr.apiResponder(
                        req,
                        res,
                        "error please enter valid param ..!!",
                        ERROR,
                        ERROR_False,
                    );
                } else {
                    resHndlr.apiResponder(
                        req,
                        res,
                        "user status add successfully!!",
                        SUCCESS,
                        ERROR_True
                    );
                }
            })

        }
    },


    'viewStatus': (req, res) => {
        var {
            userid,
            statusid
        } = req.body;
        let query = 'UPDATE status_images  SET  view_status = "' + 1 + '" WHERE userid ="' + userid + '" AND id ="' + statusid + '"';

        connection.query(query, (error, data, fields) => {
            if (error) {
                resHndlr.apiResponder(
                    req,
                    res,
                    "error to get data ..!!!!",
                    ERROR,
                    ERROR_False,
                );
            }
            resHndlr.apiResponder(
                req,
                res,
                "view status update successfully!!",
                SUCCESS,
                ERROR_True
            );
        })

    },


    'sendimage': (req, res) => {
        let {
            image,
            caption,
            created
        } = req.body;
        image = req.files[0].path;
        caption = caption ? caption : "";
        created = new Date().getDate();
        var query = 'insert into chat_images(image,caption,created)values("' + image + '","' + caption + '","' + created + '")'
        connection.query(query, function (error, results, fields) {
            if (error) {
                resHndlr.apiResponder(
                    req,
                    res,
                    "please enter valid param .!!",
                    ERROR,
                    ERROR_False,
                );
            }
            resHndlr.apiResponder(
                req,
                res,
                "image send  successfully",
                SUCCESS,
                ERROR_True
            );
        })
    },

    'getStatus': (req, res) => {
        let {
            userid
        } = req.body;
        var query1 = 'SELECT status from users where userid = ' + userid;
        connection.query(query1, function (error, results, fields) {
            if (error) {
                resHndlr.apiResponder(
                    req, res, "please enter valid userid!!!!", ERROR, ERROR_False);
            }
            else {
                resHndlr.apiResponder(
                    req,
                    res,
                    "user status get successfully",
                    SUCCESS,
                    ERROR_True,
                    results[0]
                );
            }
        });

    },

    'deleteStatus': (req, res) => {
        let {
            id
        } = req.body;
        var query1 = 'SELECT view_status from status_images where id = ' + id;
        connection.query(query1, function (error, results, fields) {
            if (error) {
                resHndlr.apiResponder(req, res, "please enter a valid id .!!!", ERROR, ERROR_False);
            } else {
                console.log("there are the data----------", results[0].view_status)
                if (results.length > 0) {
                    if (results[0].view_status !== 1) {
                        let query = 'UPDATE status_images  SET  view_status = "' + 1 + '" WHERE id ="' + id + '"';
                        connection.query(query, (error, data, fields) => {

                            if (error) {
                                resHndlr.apiResponder(req, res, "please enter valid id..!!!!", ERROR, ERROR_False);
                            } else {
                                resHndlr.apiResponder(
                                    req,
                                    res,
                                    "status deleted successfully",
                                    SUCCESS,
                                    ERROR_True,
                                    data
                                );
                            }

                        })
                    } else {
                        resHndlr.apiResponder(
                            req,
                            res,
                            "this id status alredy deleted",
                            SUCCESS,
                            ERROR_True
                        );
                    }
                } else {
                    resHndlr.apiResponder(
                        req,
                        res,
                        "please enter the valid id",
                        SUCCESS,
                        ERROR_True
                    );
                }
            }
        })

    },




    /* api for Add Two Step Verification Pin */

    'addTwoStepVeriPin': (req, res) => {
        let {
            pin_id,
            id
        } = req.body;
        console.log("there  are the token data", req.user)
        const schema = Joi.object().keys({
            pin_id: Joi.string().alphanum().min(6).max(6).required().error(errors => {
                return {
                    message: "pin_id required 6 digit alphanum"
                }
            })
        });
        const result = Joi.validate(req.body, schema);
        if (result.error) {
            resHndlr.apiResponder(
                req,
                res,
                result.error.details[0].message,
                ERROR,
                ERROR_False,
            );
        } else {
            var query1 = 'SELECT * from users where userid = ' + req.user.userid;

            connection.query(query1, function (error, results, fields) {
                if (error) {
                    resHndlr.apiResponder(req, res, "error to get data !!", ERROR, ERROR_False);

                }
                console.log("there are the userid ----------", req.user.userid);
                if (results.length > 0) {
                    let query3 = 'UPDATE users SET  pin_id = "' + result.value.pin_id + '" where userid = "' + req.user.userid + '"';
                    connection.query(query3, (error, data, fields) => {
                        if (error) {

                            resHndlr.apiResponder(req, res, "please enter unqiue pin!!!!", ERROR, ERROR_False);
                        } else {
                            console.log("there are the result", data)
                            resHndlr.apiResponder(
                                req,
                                res,
                                "pin_id add successfully",
                                SUCCESS,
                                ERROR_True
                            );
                        }

                    })
                } else {
                    resHndlr.apiResponder(
                        req, res, "please enter valid id!!!", ERROR, ERROR_False);

                }
            })

        }
    },





    /* Add Two Step Verification Email */

    'addTwoStepVeriEmail': (req, res) => {
        let { email, id } = req.body
        const schema = Joi.object().keys({

            email: Joi.string().email().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required().error(errors => {
                return {
                    message: "please enter a valid email."
                }
            }),
        });
        const result = Joi.validate(req.body, schema);
        if (result.error) {
            resHndlr.apiResponder(
                req,
                res,
                result.error.details[0].message,
                ERROR,
                ERROR_False,
            );
        } else {
            let query3 = 'UPDATE users SET verifyemail  = "' + result.value.email + '" where userid = "' + req.user.userid + '"';
            connection.query(query3, (error, data, fields) => {
                if (error) {

                    resHndlr.apiResponder(req, res, "error to get data ..!!!!", ERROR, ERROR_False);
                }

                resHndlr.apiResponder(
                    req,
                    res,
                    "Two Step Verification Email saved successfully",
                    SUCCESS,
                    ERROR_True
                );


            })
        }
    },


    /* api for Get Two Step Verification Status */
    "getToStepVeriStatus": (req, res) => {
        var query1 = 'SELECT  id,userid,verifystatus from users where userid = ' + req.user.userid;
        connection.query(query1, (error, data, fields) => {
            if (error) {
                resHndlr.apiResponder(req, res, "error to get data ..!!!!", ERROR, ERROR_False);

            }
            console.log("there are the result", data.length)
            if (data.length >= 0) {

                resHndlr.apiResponder(
                    req,
                    res,
                    "status get successfully",
                    SUCCESS,
                    ERROR_True,
                    data[0]
                );
            } else {
                resHndlr.apiResponder(req, res, "please enter valid id.!!!", ERROR, ERROR_False);

            }


        })
    },

    /* Disable Two Step Verification */


    "disableTwoStepVeri": (req, res) => {

        let { id } = req.body;
        let query3 = 'UPDATE users SET verifyemail  = "' + '' + '",verifypin = "' + 0 + '",verifystatus = "' + 0 + '" where userid = "' + req.user.userid + '"';
        connection.query(query3, (error, data, fields) => {
            if (error) {
                resHndlr.apiResponder(req, res, "error to get data ..!!!!", ERROR, ERROR_False);


            }
            console.log("there are the data ---------", query3)
            resHndlr.apiResponder(
                req,
                res,
                "Two Step Verification disabled.",
                SUCCESS,
                ERROR_True
            );
        })

    },


    /*Set Account Privacy For lastseen,profilephoto,about*/

    'setAccountPrivacy': (req, res) => {
        const requestPrivacy = ['lastseen', 'profilephoto', 'about'];
        const requestSetvalue = ['everyone', 'mycontacts', 'nobody'];
        let { privacytype, setvalue } = req.body;
        var data = requestPrivacy.includes(privacytype);
        var data1 = requestSetvalue.includes(setvalue);

        if (data !== true) {

            resHndlr.apiResponder(req, res, "Not valid privacytype", ERROR, ERROR_False);


        } else if (data1 !== true) {

            resHndlr.apiResponder(req, res, "Not valid setvalue", ERROR, ERROR_False);

        } else {
            let query = 'UPDATE privacyaccounts  SET   ' + privacytype + '  =  "' + setvalue + '" where uid = "' + req.user.id + '"';
            connection.query(query, (error, data, fields) => {
                if (error) {
                    resHndlr.apiResponder(req, res, "something went wrong..!!", ERROR, ERROR_False);
                }
                resHndlr.apiResponder(
                    req,
                    res,
                    "Account privacy setting updated successfully",
                    SUCCESS,
                    ERROR_True
                );

            })
        }
    },


    /*Get Account Privacy For lastseen,profilephoto,about */



    'getAccountPrivacy': (req, res) => {

        var query1 = 'SELECT lastseen,profilephoto,about from  privacyaccounts where uid = "' + req.user.id + '"';

        connection.query(query1, function (error, results, fields) {
            if (error) {
                resHndlr.apiResponder(
                    req,
                    res,
                    "something went wrong ..!!",
                    ERROR,
                    ERROR_False,
                );
            } else {
                resHndlr.apiResponder(
                    req,
                    res,
                    "Account privacy setting updated successfully",
                    SUCCESS,
                    ERROR_True,
                    results[0]
                );


            }


        })
    },



    'contactUs': (req, res) => {
        let { contactustext, image, created } = req.body;
        created = new Date().getDate();
        if (contactustext) {
            if (req.files.length > 0) {
                console.log("there are file thats are", req.files[0].filename)
                image = req.files[0].filename;
                var query2 = 'insert into contactus(uid,contactustext,created)values("' + req.user.id + '","' + contactustext + '","' + created + '")'
                connection.query(query2, function (error, results1, fields) {
                    console.log("there are first server error", error)
                    if (error) {
                        resHndlr.apiResponder(
                            req,
                            res,
                            "there are the server error!!",
                            ERROR,
                            ERROR_False,
                        );
                    } else {
                        var query1 = 'insert into contactusmeta(contactusid,image)values("' + results1.insertId + '","' + image + '")';
                        connection.query(query1, function (error, results, fields) {
                            console.log("there are the other server error", error)
                            if (error) {
                                resHndlr.apiResponder(
                                    req,
                                    res,
                                    "there are the server error!!",
                                    ERROR,
                                    ERROR_False,
                                );
                            } else {
                                resHndlr.apiResponder(
                                    req,
                                    res,
                                    "Query submited successfully",
                                    SUCCESS,
                                    ERROR_True,
                                    results[0]
                                );
                            }
                        })
                    }
                })
            } else {
                var query3 = 'insert into contactus(uid,contactustext,created)values("' + req.user.id + '","' + contactustext + '","' + created + '")'
                connection.query(query3, function (error, results, fields) {
                    console.log("there are the error", error);
                    if (error) {
                        resHndlr.apiResponder(
                            req,
                            res,
                            "there are the server error!!",
                            ERROR,
                            ERROR_False,
                        );
                    } else {
                        resHndlr.apiResponder(
                            req,
                            res,
                            "Query submited successfully",
                            SUCCESS,
                            ERROR_True,
                            results[0]
                        );
                    }
                })
            }
        } else {
            resHndlr.apiResponder(
                req,
                res,
                "contactstext is required ..!!",
                ERROR,
                ERROR_False,
            );
        }
    },
    'addStatus': (req, res) => {

        let { id, image, caption, type, textstatus } = req.body;
        if (type) {
            var query = 'insert into status_images(image, caption,uid,created)values( "' + ProfileImage + '","' + result.value.caption + '", "' + 428 + '", "' + (Date.now()) + '")';
            console.log("there are the userid", query);
            connection.query(query, function (error, results, fields) {
                console.log("there are the error", error)
                if (error) {
                    resHndlr.apiResponder(
                        req,
                        res,
                        "error please enter valid param ..!!",
                        ERROR,
                        ERROR_False,
                    );

                }
            })
        }
    },
    'getMyStatus': (req, res) => {
        var query1 = 'SELECT id,image,type,textdata,created from status_images where uid = "' + req.user.id + '"';

        connection.query(query1, function (error, results, fields) {
            if (error) {
                resHndlr.apiResponder(
                    req,
                    res,
                    "error to get country list.!!",
                    ERROR,
                    ERROR_False,
                );
            } else if (results.lenght > 0) {
                resHndlr.apiResponder(
                    req,
                    res,
                    "No Status Found.",
                    SUCCESS,
                    ERROR_True,
                    results,
                );
            } else {
                resHndlr.apiResponder(
                    req,
                    res,
                    "No Status Found.",
                    6,
                    ERROR_False

                );
            }

        });

    },

    'updateReadreceiptsSettings': (req, res) => {
        let { readreceipts } = req.body;
        if (readreceipts == 1 || readreceipts == 0) {
            let query = 'UPDATE usersettings SET  readreceipts = "' + readreceipts + '" where uid = "' + req.user.id + '"';
            connection.query(query, (error, data11, fields) => {
                if (error) {
                    resHndlr.apiResponder(req, res, "error to get data ..!!!!", ERROR, ERROR_False,
                    );
                }
                else {

                    let query2 = 'select userid,enable_archive,sound,desktop_alerts,readreceipts,showsecuritynoti from  usersettings where uid = "' + req.user.id + '"';
                    connection.query(query2, (error, data11, fields) => {
                        if (error) {
                            resHndlr.apiResponder(req, res, "something went wrong ..!!!!", ERROR, ERROR_False,
                            );
                        }
                        else {
                            return res.json({
                                code: 0,
                                error: false,
                                allreadyregistered: "true",
                                message: "settings successfully Updated.!!",
                                data11
                            })
                        }
                    })
                }
            })

        } else {
            resHndlr.apiResponder(
                req,
                res,
                "readreceipts is required ...",
                6,
                ERROR_False

            );


        }

    },


    'muteNotificaton': (req, res) => {

        let { mutenotitext, value, tojid, shownotification } = req.body

        const schema = Joi.object().keys({
            mutenotitext: Joi.string().valid(['hours', 'week', 'year']).required(),
            value: Joi.number().valid([1, 2, 3, 4, 5, 6, 7, 8]).required(),
            tojid: Joi.number().positive().required(),
            shownotification: Joi.valid([0, 1]).required().required()

        });

        const result = Joi.validate(req.body, schema);

        if (result.error) {

            resHndlr.apiResponder(req, res, result.error.details[0].message, ERROR, ERROR_False);

        } else {
            var setTime = (result.value == 'hours') ? (3600000 / 1000 | 0) : (result.value == 'week') ? 604800000 / 1000 | 0 : 31556926000 / 1000 | 0;
            var date = new Date / 1000 | 0;
            console.log("date for ten degit .--------...", setTime)
            var query = 'SELECT id  from users where userid =' + result.value.tojid;

            connection.query(query, function (error, results1, fields) {
                if (error) {

                    console.log("there are server error", error)
                    resHndlr.apiResponder(req, res, "there are server error!!", ERROR, ERROR_False);
                } else if (results1.length > 0) {
                    console.log("there are the resultss", results1)
                    let toid = results1[0].id;
                    var query1 = 'SELECT * from mutenotifications where toid = "' + toid + '"AND fromid = "' + req.user.id + '"';

                    console.log("there are the query", query1)

                    connection.query(query1, function (error, results1, fields) {

                        if (error) {
                            console.log("there are the server error", error)
                            resHndlr.apiResponder(req, res, "there are server error.!!", ERROR, ERROR_False);

                        } else if (results1.length > 0) {

                            let query3 = 'UPDATE mutenotifications  SET  ismuteoff = ' + 0 + ',shownotification = ' + shownotification + ',mutenoti = "' + result.value.mutenotitext + '",value = ' + result.value.value + ',settime = ' + (setTime + date) + ',fulloff = ' + 0 + ',updated = ' + date + ' where toid = ' + toid + '';
                            connection.query(query3, function (error, results1, fields) {
                                console.log("there are error", error)
                                if (error) {

                                    resHndlr.apiResponder(req, res, "error to get country list.!!", ERROR, ERROR_False);

                                } else

                                    resHndlr.apiResponder(req, res, "Mute notification successfully.", SUCCESS, ERROR_True);
                            });
                        } else {

                            var quer = 'insert into mutenotifications(toid,fromid,ismuteoff,shownotification,mutenoti,value,settime,fulloff,updated)values("' + toid + '","' + req.user.id + '","' + 0 + '","' + result.value.shownotification + '","' + result.value.mutenotitext + '","' + result.value.value + '","' + (setTime + date) + '","' + 0 + '","' + date + '")';
                            console.log("there are the uniqe query", quer);
                            connection.query(quer, function (error, results1, fields) {
                                //    console.log("there are query is", quer)
                                if (error) {
                                    console.log("last error", error)
                                    resHndlr.apiResponder(req, res, "something went wrong!", ERROR, ERROR_False);

                                } else

                                    resHndlr.apiResponder(req, res, "Mute notification successfully.", SUCCESS, ERROR_True);
                            });

                        }
                    })
                } else {

                    resHndlr.apiResponder(req, res, "This user not exist.", 300, ERROR_False);

                }
            })
        }

    },


    'getMuteNotificaton': (req, res) => {
        let { tojid } = req.body;
        if (tojid) {

            var query1 = 'SELECT id from users where userid = "' + tojid + '"';

            connection.query(query1, function (error, results, fields) {

                if (error) {
                    resHndlr.apiResponder(
                        req,
                        res,
                        "something went wrong..!!",
                        ERROR,
                        ERROR_False,
                    );
                } else if (results.length > 0) {
                    //console.log("there are the id results",results)

                    console.log("there are the results", results);
                    var date = new Date / 1000 | 0;

                    let query = 'select ismuteoff,settime,mutenoti,value,shownotification from mutenotifications where toid=  "' + results[0].id + '" AND fromid = "' + req.user.id + '" AND settime >"' + date + '" AND ismuteoff= "' + 0 + '"';
                    console.log("that query", query)
                    connection.query(query, function (error, results, fields) {
                        if (error) {
                            resHndlr.apiResponder(
                                req,
                                res,
                                "something went wrong..!!",
                                ERROR,
                                ERROR_False,
                            );
                        } else if (results.length > 0) {
                            var obj = {
                                ismuteoff: (results[0].ismuteoff == 0) ? false : true,
                                settime: results[0].settime,
                                mutenoti: results[0].mutenoti,
                                value: results[0].value,
                                shownot0ification: results[0].shownotification
                            }
                            console.log("there are the data", results)
                            resHndlr.apiResponder(
                                req,
                                res,
                                "Mutenotifications details.!!",
                                SUCCESS,
                                ERROR_True,
                                obj,
                            );
                        } else {
                            var obj1 = { ismuteoff: false, settime: "", mutenoti: "", value: "", shownot0ification: "" }
                            resHndlr.apiResponder(req, res, "Mutenotifications details.!!", SUCCESS, ERROR_True, obj1);
                        }
                    });

                } else {

                    resHndlr.apiResponder(req, res, "user does not exist", 300, ERROR_False);
                }
            })
        } else {
            resHndlr.apiResponder(req, res, "tojid is required ...", 300, ERROR_False);

        }
    },

    'updateShowSecurityNotiSettings': (req, res) => {

        let { showsecuritynoti } = req.body;

        if (showsecuritynoti === 0 || showsecuritynoti === 1) {
            let query1 = 'UPDATE usersettings SET  showsecuritynoti = "' + showsecuritynoti + '" where uid = "' + req.user.id + '"';
            connection.query(query1, function (error, results, fields) {

                if (error) {
                    resHndlr.apiResponder(req, res, "something went wrong..!!", ERROR, ERROR_False);

                }
                else if (results) {

                    var query1 = 'SELECT  userid,enable_archive,sound,desktop_alerts,readreceipts,showsecuritynoti from usersettings where uid = "' + req.user.id + '"';

                    connection.query(query1, function (error, result, fields) {

                        if (error) {
                            resHndlr.apiResponder(req, res, "something went wrong..!!", ERROR, ERROR_False);

                        } else {
                            resHndlr.apiResponder(req, res, "Settings successfully Updated.!!", SUCCESS, ERROR_True, result[0]);
                        }

                    })

                }
            })
        } else {
            resHndlr.apiResponder(req, res, "showsecuritynoti is required accept only  0 or 1!", ERROR, ERROR_False);
        }
    },


    'getSettings': (req, res) => {

        var query1 = 'SELECT  userid,enable_archive,sound,desktop_alerts,readreceipts,showsecuritynoti from usersettings where uid = "' + req.user.id + '"';

        connection.query(query1, function (error, result, fields) {

            if (error) {
                resHndlr.apiResponder(req, res, "something went wrong..!!", ERROR, ERROR_False);

            } else {
                resHndlr.apiResponder(req, res, "Settings successfully Updated.!!", SUCCESS, ERROR_True, result[0]);
            }

        })
    },


    'setBackup': (req, res) => {
        let { bkptype, email } = req.body;
        console.log("there are the request file", req.files)
        let file = req.files;
        if (file.length > 0) {

            console.log("the file is", req.files[0].filename)
            const schema = Joi.object().keys({

                bkptype: Joi.string().valid(['history', 'contacts']).required(),
                email: Joi.string().email().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required().error(errors => {
                    return {
                        message: "please enter a valid email."
                    }
                })
            });
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                resHndlr.apiResponder(req, res, result.error.details[0].message, ERROR, ERROR_False);
            } else {
                resHndlr.apiResponder(req, res, "Backup successfully done.!!", SUCCESS, ERROR_True);
            }
        } else {
            resHndlr.apiResponder(req, res, "file is required in .zip format", ERROR, ERROR_False);

        }
    },


    'getBackup': (req, res) => {
        let { bkptype, email } = req.body;
        const schema = Joi.object().keys({

            bkptype: Joi.string().valid(['history', 'contacts']).required(),
            email: Joi.string().email().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required().error(errors => {
                return {
                    message: "please enter a valid email."
                }
            })
        });
        const result = Joi.validate(req.body, schema);
        if (result.error) {
            resHndlr.apiResponder(req, res, result.error.details[0].message, ERROR, ERROR_False);
        } else {

            const dirpath = path.join(__dirname, '../../backup')
            console.log("thats it----", dirpath)

            fs.readdir(dirpath, function (err, files) {
                if (err) {
                    console.log("there are the error in this====", err)
                }
                else if (files) {
                    const txtFiles = email + '_' + bkptype + '.zip'
                    console.log("that file showing", txtFiles)
                    if (fs.existsSync(dirpath + '/' + txtFiles)) {

                        let filepath = 'http://192.168.1.243:5000/' + txtFiles;

                        console.log("ohhhh thats it----", 'http://192.168.1.243:5000/' + txtFiles)


                        let response = {
                            backuptype: bkptype,
                            backupurl: filepath
                        }

                        resHndlr.apiResponder(req, res, "Backup " + bkptype, SUCCESS, ERROR_True, response);
                    }
                    else {
                        let response = {
                            backuptype: "",
                            backupurl: ""
                        }
                        resHndlr.apiResponder(req, res, "There is no " + bkptype + "  backup", ERROR, ERROR_False, response);
                    }

                } else {
                    let response = {
                        backuptype: "",
                        backupurl: ""
                    }
                    resHndlr.apiResponder(req, res, "There is no" + bkptype + "backup", ERROR, ERROR_False, response);

                }
            })
        }
    }
}