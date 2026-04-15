import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
config()
let secret = process.env.SECRET;
export const logger = (req,res,next) =>{
    console.log(`URL: ${req.url} Method: ${req.method}\tDate:${new Date().toLocaleDateString()}`);
    next()
}
export const errorHandler = (err,req,res,next) =>{
    console.error(err); // Good for debugging
    res.status(500).json({message:err.message})
    
}

export const validate = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                message: `no token is given`
            });

        }
        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token,secret);
        req.user = decode;
        next()
    }catch(err){
        return res.status(401).json({
            message : `invalid or expired token`
        })
    }

}