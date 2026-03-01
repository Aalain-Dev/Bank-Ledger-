const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [ true, 'Email is required'],
        unique: [true, 'Email already exists'],
        trim: true,
        lowercase: true,
        match : [/^.+@(?:[\w-]+\.)+\w+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [ true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [12, 'Password cannot exceed 12 characters'],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'],
        select : false
    },
 name: {
        type: String,
        required: true
    },
},
   {
     timestamps:true
   })
   
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;  