const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
});

// Virtual for user Url
userSchema.virtual('url').get(function () {
  return `/user/${this._id}`;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
