// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // for password hashing
const jwt = require('jsonwebtoken'); // for JWT

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
});

// Middleware to hash password before saving it
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Skip if password is not modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare the entered password with the stored hashed password
userSchema.methods.comparePassword = function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Method to generate a JWT token for the user
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
  return token;
};

module.exports = mongoose.model('User', userSchema);
