const mongoose = require("mongoose");
const validator = require("validator");

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

module.exports = mongoose.model("User", userSchema);
