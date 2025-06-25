const Url = require("../models/urlModel");
const randomstring = require("randomstring");

exports.addUrl = async (req, res) => {
  try {
    let { shortUrl, fullUrl } = req.body;

    if (!shortUrl) {
      shortUrl = randomstring.generate(6);
    }

    const data = await Url.create({ shortUrl, fullUrl, user: req.user._id });
    return res.status(201).json({
      message: "Url created successfully",
      data,
    });
  } catch (ex) {
    console.error(ex.message);
    return res.status(500).json({
      message: "Error creating url",
    });
  }
};

exports.updateUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const urlToUpdate = await Url.findById(id);
    if (!urlToUpdate || !req.user._id.equals(urlToUpdate.user._id)) {
      return res.status(404).json({
        message: "Url not found",
      });
    }

    let { shortUrl } = req.body;
    if (!shortUrl) {
      shortUrl = randomstring.generate(6);
    }

    const data = await Url.findByIdAndUpdate(id, { shortUrl });

    return res.status(200).json({
      message: "Url updated successfully",
      data,
    });
  } catch (ex) {
    console.error(ex.message);
    return res.status(500).json({
      message: "Error updating url",
    });
  }
};

exports.deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const urlToDelete = await Url.findById(id);
    if (!urlToDelete || !req.user._id.equals(urlToDelete.user)) {
      return res.status(404).json({
        message: "Url not found",
      });
    }

    await Url.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Url deleted successfully",
    });
  } catch (ex) {
    console.error(ex.message);
    return res.status(500).json({
      message: "Error deleting url",
    });
  }
};

exports.getAllUrl = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user._id }, { __v: 0 });
    return res.status(200).json({
      message: "Urls fetched successfully",
      urls,
    });
  } catch (ex) {
    console.error(ex.message);
    return res.status(500).json({
      message: "Error getting urls",
    });
  }
};

exports.redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });
  if (!url) {
    return res.status(404).json({
      message: "Url not found",
    });
  }

  return res.redirect(url.fullUrl);
};
