    import {hash,compare} from 'bcrypt'
    import userData from '../models/userData.js'

    import jws from 'jsonwebtoken'

    export const createUser = async(req,res,next) => {
        try{
            const {name,email,password} = req.body;
            const userExist = await userData.findOne({email:email}).select("-password");
            if(userExist){
                let err = new Error("User already exist")
                throw err
            }
            const passhwd = await hash(password,12);
            const obj = {
                name : name[0].toUpperCase()+name.slice(1),
                email : email,
                password :passhwd
            }
            const user =  new userData(obj);
            let resp = await user.save();
            const token = jws.sign({ id: resp._id }, process.env.SECRET, { expiresIn: "7d" })
            res.status(201).json({message:"user created",token,user:{id:resp._id,name:resp.name,email:resp.email}})

            
        }
        catch(err){
            next(err)
        }

    }


    export const userLogin = async(req,res,next) =>{
        try{
            const {email,password} = req.body;
            let result = await userData.findOne({email:email}).select("+password");
            if(!result){
                return res.status(400).json({
                    message:`User doesnot exist`
                })
            }
            const matchPass = await compare(password,result.password);
            if(!matchPass){
                return res.status(401).json({
                    message:`Password not match`
                })

            }
            let token  = jws.sign({id:result._id,email},
                process.env.SECRET,{expiresIn:"7d"}
            )
            result.password = undefined;
            res.status(200).json({
                message:`Succesful`,
                token,
                user: result
            })
        }
        catch(err){
            next(err)
        }
    }