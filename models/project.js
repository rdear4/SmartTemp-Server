const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: "defaultProject.png"
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag"}],
    default: []
  },
  viewLevel: {
    type: Number,
    default: 4
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  published: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  todos: {
    type: [{ type: mongoose.Schema.Types.Mixed, ref: "Todo"}],
    default: []
  },
  parts: {
    type: [{ type: mongoose.Schema.Types.Mixed, ref: "Part"}],
    default: []
  }

});

module.exports = mongoose.model("Project", projectSchema);