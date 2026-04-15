import mongoose from "mongoose";
import { connect } from "mongoose";

export const connectDb = async(url) =>{
    try{
        await connect(url)
        console.log("connection success");
        
    }catch(err){
        console.log("failed");
        throw err
    }
}
