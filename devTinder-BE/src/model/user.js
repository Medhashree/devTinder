const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: function (value){
        if(!validator.isEmail(value)){
          throw new Error("Email is not valid: " + value);
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate: function (value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Password is not strong(minLength: 8, 1 lowercase, 1 uppercase, 1 special character): " + value);
        }
      }
    },
    age: {
      type: Number,
      min: 18,
      max: 80
    },
    gender: {
      type: String,
      validate: function (value){
        if(!['male', 'female', 'others'].includes(value)){
          throw new Error('Gender is not valid.')
        }
      }
    },
    about: {
      type: String,
      default: 'Hey! I am using DevTinder.'
    },
    profilePic: {
      type: String,
      default: "https://thumbs.dreamstime.com/b/unisex-default-profile-picture-white-faceless-person-black-background-304887214.jpg",
      validate: function (value){
        if(!validator.isURL(value)){
          throw new Error("Profile Picture URL is not valid: " + value);
        }
      }
    },
    skills: {
      type: [String],
      validate: function (value){
        if(value.length > 20){
          throw new Error('Cannot add more than 20 skills');
        }
      }
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () { // never use a arrow function here as we will be using this, and arrow function behaves differenly
  const user = this; // user is actually the instamce of userSchema, so we are accessing with 'this'

  const token = await jwt.sign({_id: user._id}, "DEV@Tinder$1706", {expiresIn: "1h"}); // user data, secret msg, expirationTime

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser){
  const user = this;

  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

  return isPasswordValid;

}

module.exports = mongoose.model("User", userSchema);
