import express from 'express'
import { createUser, userLogin } from '../controllers/authUser.js'

const authrouter = express.Router()

authrouter.post('/register',createUser);
authrouter.post('/login',userLogin)

export default authrouter