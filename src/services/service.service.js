import Service from '../models/service.model.js';

/**
 * Add a new service
 * @param {Object} serviceData 
 * @returns {Promise<Object>}
 */
export const createService = async (serviceData) => {
  const newService = new Service(serviceData);
  const savedService = await newService.save();
  return savedService.toObject();
};

/**
 * Get all services with sorting, pagination, category filtering, and search options
 * @param {Object} options 
 * @returns {Promise<Array>}
 */
export const getAllServices = async (options = {}) => {
  const { category, search, page = 1, limit = 10 } = options;
  const query = {};
  
  // Apply category filter if provided
  if (category) {
    query.category = category;
  }
  
  // Apply case-insensitive regex search on serviceName if provided
  if (search) {
    query.serviceName = { $regex: search, $options: 'i' };
  }

  // Calculate pagination parameters
  const parsedPage = Math.max(1, parseInt(page) || 1);
  const parsedLimit = Math.max(1, parseInt(limit) || 10);
  const skip = (parsedPage - 1) * parsedLimit;

  // Query database sorting by newest first, skipping, and limiting
  return await Service.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit)
    .lean();
};

/**
 * Get a single service by ID
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const getServiceById = async (id) => {
  const service = await Service.findById(id).lean();
  if (!service) {
    throw new Error('Service not found');
  }
  return service;
};

/**
 * Update service details
 * @param {string} id 
 * @param {Object} updateData 
 * @returns {Promise<Object>}
 */
export const updateService = async (id, updateData) => {
  const updatedService = await Service.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
  
  if (!updatedService) {
    throw new Error('Service not found');
  }
  return updatedService;
};

/**
 * Delete a service
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const deleteService = async (id) => {
  const deletedService = await Service.findByIdAndDelete(id).lean();
  if (!deletedService) {
    throw new Error('Service not found');
  }
  return deletedService;
};
