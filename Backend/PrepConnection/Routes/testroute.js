import express from 'express'
import { getQuestion,submitAnswer } from '../controllers/testcontroller.js'
import { validate } from '../middleWare.js';

const testrouter = express.Router();

testrouter.get('/Questions',validate,getQuestion);
testrouter.post('/submitAnswer',validate,submitAnswer);

export default testrouter