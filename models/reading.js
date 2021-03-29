const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const readingSchema = new Schema({
  
  sensorId: {    
    type: Schema.Types.ObjectId,
    required: true
  },
  temperature: {
      type: Number,
      default: 0.0
  },
  humidity: {
      type: Number,
      default: 0.0
  },
  timestamp: {
      type: Date,
      default: Date.now
  },
  batteryLevel: {
      type: Number,
      default: 100
  }


});

module.exports = mongoose.model("Reading", readingSchema);