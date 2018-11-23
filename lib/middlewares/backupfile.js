const path = require('path');
const multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "backup");
    },
    filename: function (req, file, cb) {
        console.log("its going on the way for this way", req.body)
        if (!file.originalname.match(/\.(zip)$/)) {

            return cb(new Error('Wrong file format'))
        }
        cb(null, req.body.email + "_" + req.body.bkptype + "." + 'zip');
    }
});
var backup = multer({ storage: storage });

//module.exports.storage = storage;
module.exports.backup = backup;