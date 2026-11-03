
import mongoose from'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"user Name is required"],
        trim:true,
        minLength:2,
        maxLength:50
    },
    email:{
        type:String,
        required:[true,"user email is required"],
        unique:true,
        trim:true,
        lowercase:true,
        minLength:10,
        match:[/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/,"Please provide a valid email address"]   
    },
    password:{
        type:String,
        required:[true,'user password is required'],
        trim:true,
        minLength:6,
    }
},{timestamps:true})

const User = mongoose.model('User', userSchema);

export default User;