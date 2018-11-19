const usrRoutr = require("express").Router();
const adminController = require("../controller/adminController");

usrRoutr.route("/getallUser")
    .get([adminController.middleware], function (req, res) {
        adminController.getallUser(req, res);
    });
usrRoutr.route("/getUser")
    .get([adminController.middleware], function (req, res) {
        adminController.getUser(req, res);
    });

usrRoutr.route("/login")
    .post([], function (req, res) {
        adminController.login(req, res);
    });


usrRoutr.route("/getUserWithPagination")
    .get([adminController.middleware], function (req, res) {
        adminController.getUserWithPagination(req, res);
    });
usrRoutr.route("/getUserDetails")
    .get([adminController.middleware], function (req, res) {
        adminController.getUserDetails(req, res);
    });
usrRoutr.route("/updateprofile")
    .post([adminController.middleware], function (req, res) {
        adminController.updateprofile(req, res);
    });
usrRoutr.route("/deleteUser")
    .post([adminController.middleware], function (req, res) {
        adminController.deleteUser(req, res);
    });
usrRoutr.route("/getUserDetails1")
    .post([adminController.middleware], function (req, res) {
        adminController.getUserDetails1(req, res);
    });
usrRoutr.route("/addNewuser")
    .post([adminController.middleware], function (req, res) {
        adminController.addNewuser(req, res);
    });
usrRoutr.route("/colorCode")
    .get([adminController.middleware], function (req, res) {
        adminController.colorCode(req, res);
    });
usrRoutr.route("/getAboutUs")
    .get([adminController.middleware], function (req, res) {
        adminController.getAboutUs(req, res);
    });
usrRoutr.route("/updateaboutUs")
    .post([adminController.middleware], function (req, res) {
        adminController.updateaboutUs(req, res);
    });
usrRoutr.route("/deleteColor")
    .post([adminController.middleware], function (req, res) {
        adminController.deleteColor(req, res);
    })


module.exports = usrRoutr;
