import express from 'express';
import { getProviderRecommendation } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/recommend', getProviderRecommendation);

export default router;
