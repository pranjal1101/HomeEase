import Service from '../models/service.model.js';

export const createService = async (serviceData) => {
  const newService = new Service(serviceData);
  const savedService = await newService.save();
  return savedService.toObject();
};

export const getAllServices = async (options = {}) => {
  const { category, search, page = 1, limit = 10 } = options;
  const query = {};
  
  if (category) {
    query.category = category;
  }
  
  if (search) {
    query.serviceName = { $regex: search, $options: 'i' };
  }

  const parsedPage = Math.max(1, parseInt(page) || 1);
  const parsedLimit = Math.max(1, parseInt(limit) || 10);
  const skip = (parsedPage - 1) * parsedLimit;

  return await Service.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit)
    .lean();
};

export const getServiceById = async (id) => {
  const service = await Service.findById(id).lean();
  if (!service) {
    throw new Error('Service not found');
  }
  return service;
};

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

export const deleteService = async (id) => {
  const deletedService = await Service.findByIdAndDelete(id).lean();
  if (!deletedService) {
    throw new Error('Service not found');
  }
  return deletedService;
};
