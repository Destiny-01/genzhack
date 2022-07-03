const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  connections: [
    {
      name: {
        type: String,
      },
      date: {
        type: Date,
      },
    },
  ],
});

module.exports = mongoose.model("Client", clientSchema);
