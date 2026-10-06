import * as aiService from '../services/ai.service.js';

export const getProviderRecommendation = async (req, res) => {
  try {
    const { category, service, preference } = req.body || {};

    const result = await aiService.getRecommendation({ category, service, preference });

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || 'No suitable providers found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'AI Provider recommendation generated successfully',
      data: result
    });
  } catch (error) {
    console.error('Controller Error in getProviderRecommendation:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate AI recommendation'
    });
  }
};
