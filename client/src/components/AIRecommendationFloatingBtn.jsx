import React, { useState } from 'react';
import AIRecommendationModal from './AIRecommendationModal';

const AIRecommendationFloatingBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="ai-floating-trigger"
        onClick={() => setIsModalOpen(true)}
        aria-label="Open AI Provider Recommendation"
      >
        AI Recommend
      </button>

      <AIRecommendationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AIRecommendationFloatingBtn;
