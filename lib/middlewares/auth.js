const jwt = require('jsonwebtoken');
var config = require('../config/passpord_config');
module.exports = {
    'tokenVerify': (req, res, next) => {

        var token = req.headers["authorization"];

        if (token) {
            try {
                token = token.split(' ')[1];
                var decoded = jwt.verify(token, config.secret, function (err, decoded) {

                    if (err) {
                        return res.json({ status: 400, message: 'Authorization token is not valid', error: err });
                    } else {
                        console.log(decoded, "decoded token")
                        req.user = decoded;
                        next();
                    }
                });
            } catch (e) {
                return res.send({ status: 400, message: 'Authorization token is not valid' });
            }
        } else {
            console.log("No token");
            return res.send({ status: 400, message: 'Authorization token missing in request.' });
        }
    }
}