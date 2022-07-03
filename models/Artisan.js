const mongoose = require("mongoose");

const artisanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  skills: [
    {
      type: String,
    },
  ],
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  clients: [
    {
      name: {
        type: Number,
      },
      date: {
        type: Date,
      },
    },
  ],
});

module.exports = mongoose.model("Artisan", artisanSchema);
