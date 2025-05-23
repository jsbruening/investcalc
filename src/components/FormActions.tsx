import React from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

interface FormActionsProps {
 currentStep: number;
 totalSteps: number;
 onNext: () => void;
 onBack: () => void;
 isNextDisabled?: boolean;
 isLastStep?: boolean;
 onFinish?: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
 currentStep,
 totalSteps,
 onNext,
 onBack,
 isNextDisabled = false,
 isLastStep = false,
 onFinish
}) => {
 return (
  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
   <div className="flex items-center gap-4">
    <button
     onClick={onBack}
     disabled={currentStep === 0}
     className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
            ${currentStep === 0
       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
       : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
      }
            transition-colors duration-200
          `}
    >
     <FaArrowLeft className="w-4 h-4" />
     Back
    </button>
    <span className="text-sm text-gray-500">
     Step {currentStep + 1} of {totalSteps}
    </span>
   </div>

   <button
    onClick={isLastStep ? onFinish : onNext}
    disabled={isNextDisabled}
    className={`
          flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium
          ${isNextDisabled
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : 'bg-green-600 text-white hover:bg-green-700'
     }
          transition-colors duration-200
        `}
   >
    {isLastStep ? 'Finish' : 'Next'}
    {!isLastStep && <FaArrowRight className="w-4 h-4" />}
   </button>
  </div>
 );
};

export default FormActions; 