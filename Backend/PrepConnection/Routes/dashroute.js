import express from 'express'
import { getDashboard, getRecentAttempts } from '../controllers/Dashboards.js';
import { validate } from '../middleWare.js';

const dashroute = express.Router();
dashroute.get('/dashboard',validate,getDashboard)
dashroute.get('/attempts',validate,getRecentAttempts)

export default dashroute