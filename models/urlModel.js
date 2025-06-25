const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: [true, "Full url is required"],
  },
  shortUrl: {
    type: String,
    required: [true, "Short url is required"],
    unique: [true, "Short Url Must Be Unique"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User is required"],
  },
});

module.exports = mongoose.model("urls", UrlSchema);
