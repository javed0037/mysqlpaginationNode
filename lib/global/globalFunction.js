
const crypto = require("crypto");
const {
    BAD_REQUEST_MESSAGE,
    SUCCESS_MESSAGE,
    INVALID_ACCESS_TOKEN_MESSAGE,
    PARAMETER_MISSING_MESSAGE,
    ERROR_True,
    ERROR_False
} = require("./message");
const _ = require("lodash");
const resHndlr = require("../global/Responder");
let validate = (data = {}) => {
    var result = {};
    var resp = {};
    var count = 0;

    // console.log(' Val => ', data);
    _.map(data, (val, key) => {
        //console.log('there are the my val',val.location)
        if ((val && val.length) || _.isInteger(val)) {
            //if (val  || _.isInteger(val)) {

            if (key == "email") {
                if (!validateEmail(val)) {
                    resp[key] = `invalid  ${key}`;
                }
            }
            result[key] = val;
        } else {
            resp[key] = `${key} is missing`;
        }
    });
    if (resp && _.size(resp)) {
        return { status: false, data: resp };
    } else {
        return { status: true, data: result };
    }
};
let validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
const parameterMissing = (
    message = PARAMETER_MISSING_MESSAGE,
    code = 400,
    error = ERROR_False

) => {
    if (typeof message == "string") {
        message = { message };
    }
    message = message[Object.keys(message)[0]];
    return {
        message,
        code,
        error
    };
};
const serverError = (
    response = {},
    message = BAD_REQUEST_MESSAGE,
    code = 500,
    error = ERROR_False
) => {
    if (typeof message == "string") {
        message = { message };
    }
    message = message[Object.keys(message)[0]];
    return {
        response,
        message,
        code,
        error
    };
};
const encodePassword = (password = "") => {
    let md5 = crypto.createHash("md5");
    md5.update(password);
    let pass_md5 = md5.digest("hex");
    return pass_md5;
};
const countryCode = country_code => {
    if (!country_code.includes("+")) {
        country_code = "+" + country_code;
    }
    return country_code;
};
const successResult = (
    response = {},
    message = SUCCESS_MESSAGE,
    status = 200
) => {
    if (typeof message == "string") {
        message = { message };
    }
    message = message[Object.keys(message)[0]];
    return {
        response,
        message,
        status
    };
};
const verifyData = (data = {}) => {
    var result = {};
    var count = 0;
    _.map(data, (val, key) => {
        if ((val && val.length) || _.isInteger(val)) {
            result[key] = val;
        }
    });
    return result;
};

module.exports = {
    validate: validate,
    validateEmail: validateEmail,
    parameterMissing: parameterMissing,
    serverError: serverError,
    encodePassword: encodePassword,
    countryCode: countryCode,
    successResult: successResult,
    verifyData: verifyData
};