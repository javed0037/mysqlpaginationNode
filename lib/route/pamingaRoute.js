const usrRoutr = require("express").Router();
const pamingaController = require("../controller/pamingaApi");
const auth = require("../middlewares/auth");
const backupfile = require("../middlewares/backupfile");
const path = require('path');
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
usrRoutr.route("/verifyOTP")
    .post([], function (req, res) {
        pamingaController.otpVerify(req, res);
    })
usrRoutr.route("/updateProfile").post([], uploads.array("image"),
    function (req, res) {
        pamingaController.updateProfile(req, res);
    }
);
usrRoutr.route("/UpdateUserSettings").post([auth.tokenVerify],
    function (req, res) {
        pamingaController.UpdateUserSettings(req, res);
    }
);
usrRoutr.route("/addStatus").post([auth.tokenVerify], uploads.array("image[]"), function (req, res) {
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
usrRoutr.route("/getStatus").get([auth.tokenVerify], function (req, res) {
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
usrRoutr.route("/setAccountPrivacy").post([auth.tokenVerify], function (req, res) {
    pamingaController.setAccountPrivacy(req, res);
}
);
usrRoutr.route("/getAccountPrivacy").post([auth.tokenVerify], function (req, res) {
    pamingaController.getAccountPrivacy(req, res);
}
);
usrRoutr.route("/contactUs").post([auth.tokenVerify], uploads.array('image[]'), function (req, res) {
    pamingaController.contactUs(req, res);
}
);
usrRoutr.route("/getMyStatus").post([auth.tokenVerify], function (req, res) {
    pamingaController.getMyStatus(req, res);
}
);

usrRoutr.route("/updateReadreceiptsSettings").post([auth.tokenVerify], function (req, res) {
    pamingaController.updateReadreceiptsSettings(req, res);
}
);
usrRoutr.route("/muteNotificaton").post([auth.tokenVerify], function (req, res) {
    pamingaController.muteNotificaton(req, res);
}
);
usrRoutr.route("/getMuteNotificaton").post([auth.tokenVerify], function (req, res) {
    pamingaController.getMuteNotificaton(req, res);
}
);
usrRoutr.route("/updateShowSecurityNotiSettings").post([auth.tokenVerify], function (req, res) {
    pamingaController.updateShowSecurityNotiSettings(req, res);
}
);
usrRoutr.route("/getSettings").post([auth.tokenVerify], function (req, res) {
    pamingaController.getSettings(req, res);
}
);

usrRoutr.route("/setBackup").post([auth.tokenVerify], backupfile.backup.array('file'), function (req, res) {
    pamingaController.setBackup(req, res);
}
);
usrRoutr.route("/getBackup").post([auth.tokenVerify], function (req, res) {
    pamingaController.getBackup(req, res);
}
);
usrRoutr.route("/muteNotificatonOff").post([auth.tokenVerify], function (req, res) {
    pamingaController.muteNotificatonOff(req, res);
}
);
usrRoutr.route("/statusPrivacy").post([auth.tokenVerify], function (req, res) {
    pamingaController.statusPrivacy(req, res);
}
);
usrRoutr.route("/getStatusPrivacy").post([auth.tokenVerify], function (req, res) {
    pamingaController.getStatusPrivacy(req, res);
}
);
usrRoutr.route("/blockUser").post([auth.tokenVerify], function (req, res) {
    pamingaController.blockUser(req, res);
}
);
usrRoutr.route("/getBlockUser").post([auth.tokenVerify], function (req, res) {
    pamingaController.getBlockUser(req, res);
}
);

usrRoutr.route("/sendMediamulti").post([auth.tokenVerify], uploads.array('media[]'), function (req, res) {
    pamingaController.sendMediamulti(req, res);
}
);



usrRoutr.route("/getallUser")
    .get([auth.tokenVerify], function (req, res) {
        pamingaController.getallUser(req, res);
    });
usrRoutr.route("/getUser")
    .get([auth.tokenVerify], function (req, res) {
        pamingaController.getUser(req, res);
    });

usrRoutr.route("/login")
    .post([], function (req, res) {
        pamingaController.login(req, res);
    });


usrRoutr.route("/getUserWithPagination")
    .get([auth.tokenVerify], function (req, res) {
        pamingaController.getUserWithPagination(req, res);
    });
usrRoutr.route("/getUserDetails")
    .get([auth.tokenVerify], function (req, res) {
        pamingaController.getUserDetails(req, res);
    });
usrRoutr.route("/updateprofile")
    .post([auth.tokenVerify], function (req, res) {
        pamingaController.updateprofile(req, res);
    });
usrRoutr.route("/deleteUser")
    .post([auth.tokenVerify], function (req, res) {
        pamingaController.deleteUser(req, res);
    });
usrRoutr.route("/getUserDetails1")
    .post([auth.tokenVerify], function (req, res) {
        pamingaController.getUserDetails1(req, res);
    });
usrRoutr.route("/addNewuser")
    .post([auth.tokenVerify], function (req, res) {
        pamingaController.addNewuser(req, res);
    });
usrRoutr.route("/getColorList")
    .post([], function (req, res) {
        pamingaController.colorCode(req, res);
    });
usrRoutr.route("/pagesBySlug")
    .post([auth.tokenVerify], function (req, res) {
        pamingaController.pagesBySlug(req, res);
    });
usrRoutr.route("/updateaboutUs")
    .post([auth.tokenVerify], function (req, res) {
        pamingaController.updateaboutUs(req, res);
    });
usrRoutr.route("/deleteColor")
    .post([auth.tokenVerify], function (req, res) {
        pamingaController.deleteColor(req, res);
    })
module.exports = usrRoutr;