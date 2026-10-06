import * as serviceService from '../services/service.service.js';

export const addService = async (req, res) => {
  try {
    const service = await serviceService.createService(req.body);
    return res.status(201).json({
      success: true,
      message: 'Service added successfully',
      data: service
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const { category, search, page, limit } = req.query;
    const services = await serviceService.getAllServices({ category, search, page, limit });
    return res.status(200).json({
      success: true,
      message: 'Services fetched successfully',
      data: services
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSingleService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceService.getServiceById(id);
    return res.status(200).json({
      success: true,
      message: 'Service details fetched successfully',
      data: service
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedService = await serviceService.updateService(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await serviceService.deleteService(id);
    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      data: deletedService
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
