const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const sensorSchema = new Schema({
  
  MAC: {    
    type: String,
    required: true
  },
  name: {
    type: String,
    default: "NAME-NOT-SET"
  },
  location: {
      type: String,
      defailt: ""
  },
  createdOne: {
      type: Date,
      default: Date.now()
  },
  active: {
      type: Boolean,
      default: true
  }


});

module.exports = mongoose.model("Sensor", sensorSchema);