import express from 'express'
import { generateQuestion,evaluateAnswer } from '../controllers/aiController.js' 
import { validate } from '../middleWare.js'

const airoute = express.Router()

airoute.post('/generate',validate,generateQuestion);
airoute.post('/evaluate',validate,evaluateAnswer);

export default airoute
