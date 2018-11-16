const usrRoutr = require("express").Router();

const pamingaController = require("../controller/pamingaApi");

const multer = require("multer");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname+"-"+Date.now()+"-"+file.originalname);
  }
});
var uploads = multer({ storage: storage });


usrRoutr.route("/getCountry")
.post([], function(req, res) {
    pamingaController.getCountry(req, res);
})
usrRoutr.route("/registerUser")
.post([], function(req, res) {
    pamingaController.registerUser(req, res);
})
usrRoutr.route("/otpVerify")
.post([], function(req, res) {
    pamingaController.otpVerify(req, res);
})
usrRoutr.route("/updateProfile").post([],uploads.array("ProfileImage"),
        function(req, res) {
        pamingaController.updateProfile(req, res);
    }
  );
  usrRoutr.route("/UpdateUserSettings").post([],
        function(req, res) {
        pamingaController.UpdateUserSettings(req, res);
    }
  );
  usrRoutr.route("/AddStatus").post([],uploads.array("ProfileImage"),function(req, res) {
    pamingaController.AddStatus(req, res);
}
);
usrRoutr.route("/Sendimage").post([],uploads.array("image"),function(req, res) {
    pamingaController.Sendimage(req, res);
}
);
usrRoutr.route("/ViewStatus").post([],function(req, res) {
    pamingaController.ViewStatus(req, res);
}
);
usrRoutr.route("/GetStatus").post([],function(req, res) {
    pamingaController.GetStatus(req, res);
}
);

  
  

module.exports = usrRoutr;