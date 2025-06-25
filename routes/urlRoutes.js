const express = require("express");
const urlController = require("../controllers/urlController");
const authController = require("../controllers/authController");

const urlRouter = express.Router();

urlRouter
  .route("/")
  .get(authController.protect, urlController.getAllUrl)
  .post(authController.protect, urlController.addUrl);

urlRouter
  .route("/:id")
  .put(authController.protect, urlController.updateUrl)
  .delete(authController.protect, urlController.deleteUrl);

module.exports = urlRouter;
