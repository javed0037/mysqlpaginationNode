const usrRoutr = require("express").Router();

const pamingaController = require("../controller/pamingaApi");
const auth = require("../middlewares/auth")

const multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
});
var uploads = multer({ storage: storage });


usrRoutr.route("/countryList")
    .post([], function (req, res) {
        pamingaController.countryList(req, res);
    })
usrRoutr.route("/registerUser")
    .post([], function (req, res) {
        pamingaController.registerUser(req, res);
    })
usrRoutr.route("/otpVerify")
    .post([], function (req, res) {
        pamingaController.otpVerify(req, res);
    })
usrRoutr.route("/updateProfile").post([], uploads.array("ProfileImage"),
    function (req, res) {
        pamingaController.updateProfile(req, res);
    }
);
usrRoutr.route("/UpdateUserSettings").post([],
    function (req, res) {
        pamingaController.UpdateUserSettings(req, res);
    }
);
usrRoutr.route("/addStatus").post([], uploads.array("ProfileImage"), function (req, res) {
    pamingaController.addStatus(req, res);
}
);
usrRoutr.route("/sendimage").post([], uploads.array("image"), function (req, res) {
    pamingaController.sendimage(req, res);
}
);
usrRoutr.route("/viewStatus").post([], function (req, res) {
    pamingaController.viewStatus(req, res);
}
);
usrRoutr.route("/getStatus").post([], function (req, res) {
    pamingaController.getStatus(req, res);
}
);
usrRoutr.route("/deleteStatus").post([], function (req, res) {
    pamingaController.deleteStatus(req, res);
}
);
usrRoutr.route("/addTwoStepVeriPin").post([auth.tokenVerify], function (req, res) {
    pamingaController.addTwoStepVeriPin(req, res);
}
);
usrRoutr.route("/addTwoStepVeriEmail").post([auth.tokenVerify], function (req, res) {
    pamingaController.addTwoStepVeriEmail(req, res);
}
);
usrRoutr.route("/getToStepVeriStatus").post([auth.tokenVerify], function (req, res) {
    pamingaController.getToStepVeriStatus(req, res);
}
);
usrRoutr.route("/disableTwoStepVeri").post([auth.tokenVerify], function (req, res) {
    pamingaController.disableTwoStepVeri(req, res);
}
);






module.exports = usrRoutr;