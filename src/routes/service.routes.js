import express from 'express';
import {
  addService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService
} from '../controllers/service.controller.js';

const router = express.Router();

// Define service CRUD routes
router.post('/', addService);
router.get('/', getAllServices);
router.get('/:id', getSingleService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
