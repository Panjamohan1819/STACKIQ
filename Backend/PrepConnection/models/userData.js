import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name : {
        type: String,
        required:true,
        trim: true,
        minlength:2,
        maxlength:50},
    email : {type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        match: [/^\S+@\S+\.\S+$/, 'please enter valid Email-id']},
    password :{type:String,required:true}
},{timestamps:true})

export default mongoose.model("User", UserSchema)