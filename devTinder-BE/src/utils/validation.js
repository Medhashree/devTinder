const validator = require("validator");

//we have checked all these in our user schema itself
//but it can be add here also
const validateSignUpData = (req) => {
    const {firstName, emailId, password} = req;

    if(!firstName){
        throw new Error("Name is mandatory");
    }

    if(firstName.length > 20){
        throw new Error("Firstname cannot be more than 20 characters.");
    }

    if(!validator.isEmail(emailId)){
        throw new Error("Email id is invalid.");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }
}

const validateEditData = (req) => {
    const ALLOWED_FIELDS = ["lastName", 'age', 'gender', 'about', 'profilePic', 'skills'];

    const isEditAllowed = Object.keys(req.body).every(k => ALLOWED_FIELDS.includes(k));

    return isEditAllowed;
}

module.exports = {validateSignUpData, validateEditData};