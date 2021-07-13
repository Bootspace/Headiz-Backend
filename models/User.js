const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name:{
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true, //Unique Email for each user
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    //Role o a user it will be (normal or admin ) - normal by default
    type: String,
    default: 0,
  },

  history: {
    // Order history
    type: Array,
    default: []
  },
});

User = mongoose.model('User', UserSchema);
module.exports = User;