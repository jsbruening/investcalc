import React, { useState } from 'react';
import { FaUser, FaVenusMars, FaSmoking } from 'react-icons/fa';

interface InvestmentFormProps {
  onSubmit: (data: {
    age: number;
    gender: string;
    tobaccoUse: string;
    shortTermInvestment: number;
    intermediateInvestment: number;
    longTermInvestment: number;
    neverInvestment: number;
  }) => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    tobaccoUse: '',
    shortTermInvestment: '',
    intermediateInvestment: '',
    longTermInvestment: '',
    neverInvestment: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 18 || Number(formData.age) > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.tobaccoUse) {
      newErrors.tobaccoUse = 'Tobacco use status is required';
    }

    const investmentFields = [
      'shortTermInvestment',
      'intermediateInvestment',
      'longTermInvestment',
      'neverInvestment'
    ];

    investmentFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (!value) {
        newErrors[field] = 'Investment amount is required';
      } else if (isNaN(Number(value)) || Number(value) < 0) {
        newErrors[field] = 'Investment amount must be a positive number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        age: Number(formData.age),
        gender: formData.gender,
        tobaccoUse: formData.tobaccoUse,
        shortTermInvestment: Number(formData.shortTermInvestment),
        intermediateInvestment: Number(formData.intermediateInvestment),
        longTermInvestment: Number(formData.longTermInvestment),
        neverInvestment: Number(formData.neverInvestment)
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const inputClasses = (error: string | undefined) => `
    block w-full rounded-md border-gray-300 shadow-sm
    h-12 px-3
    focus:border-brand focus:ring-brand
    ${error ? 'border-red-300' : ''}
  `;

  const labelClasses = (error: string | undefined) => `
    block text-sm font-medium text-gray-700 mb-1
    ${error ? 'text-red-600' : ''}
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto p-8 bg-white">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column: Personal Info */}
        <div className="space-y-6">
          <div>
            <label htmlFor="age" className={labelClasses(errors.age)}>
              <div className="flex items-center gap-2">
                <FaUser className="w-4 h-4 text-gray-400" />
                Age
              </div>
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={inputClasses(errors.age)}
              placeholder="Enter your age"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age}</p>
            )}
          </div>
          <div>
            <label htmlFor="gender" className={labelClasses(errors.gender)}>
              <div className="flex items-center gap-2">
                <FaVenusMars className="w-4 h-4 text-gray-400" />
                Gender
              </div>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={inputClasses(errors.gender)}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
            )}
          </div>
          <div>
            <label htmlFor="tobaccoUse" className={labelClasses(errors.tobaccoUse)}>
              <div className="flex items-center gap-2">
                <FaSmoking className="w-4 h-4 text-gray-400" />
                Tobacco Use
              </div>
            </label>
            <select
              id="tobaccoUse"
              name="tobaccoUse"
              value={formData.tobaccoUse}
              onChange={handleChange}
              className={inputClasses(errors.tobaccoUse)}
            >
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.tobaccoUse && (
              <p className="mt-1 text-sm text-red-600">{errors.tobaccoUse}</p>
            )}
          </div>
        </div>
        {/* Right column: Investments */}
        <div className="space-y-6">
          <div>
            <label htmlFor="shortTermInvestment" className={labelClasses(errors.shortTermInvestment)}>
              Short Term Investment
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="shortTermInvestment"
                name="shortTermInvestment"
                value={formData.shortTermInvestment}
                onChange={handleChange}
                className={`${inputClasses(errors.shortTermInvestment)} pl-7`}
                placeholder="0.00"
              />
            </div>
            {errors.shortTermInvestment && (
              <p className="mt-1 text-sm text-red-600">{errors.shortTermInvestment}</p>
            )}
          </div>
          <div>
            <label htmlFor="intermediateInvestment" className={labelClasses(errors.intermediateInvestment)}>
              Intermediate Term Investment
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="intermediateInvestment"
                name="intermediateInvestment"
                value={formData.intermediateInvestment}
                onChange={handleChange}
                className={`${inputClasses(errors.intermediateInvestment)} pl-7`}
                placeholder="0.00"
              />
            </div>
            {errors.intermediateInvestment && (
              <p className="mt-1 text-sm text-red-600">{errors.intermediateInvestment}</p>
            )}
          </div>
          <div>
            <label htmlFor="longTermInvestment" className={labelClasses(errors.longTermInvestment)}>
              Long Term Investment
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="longTermInvestment"
                name="longTermInvestment"
                value={formData.longTermInvestment}
                onChange={handleChange}
                className={`${inputClasses(errors.longTermInvestment)} pl-7`}
                placeholder="0.00"
              />
            </div>
            {errors.longTermInvestment && (
              <p className="mt-1 text-sm text-red-600">{errors.longTermInvestment}</p>
            )}
          </div>
          <div>
            <label htmlFor="neverInvestment" className={labelClasses(errors.neverInvestment)}>
              Maybe Never / Leave On Investment
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="neverInvestment"
                name="neverInvestment"
                value={formData.neverInvestment}
                onChange={handleChange}
                className={`${inputClasses(errors.neverInvestment)} pl-7`}
                placeholder="0.00"
              />
            </div>
            {errors.neverInvestment && (
              <p className="mt-1 text-sm text-red-600">{errors.neverInvestment}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <button type="submit" className="w-full bg-brand text-white font-semibold py-2 rounded-md hover:bg-brand-dark transition">Calculate</button>
        {import.meta.env.DEV && (
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-semibold"
            onClick={() => {
              const sample = {
                age: '35',
                gender: 'male',
                tobaccoUse: 'no',
                shortTermInvestment: '10000',
                intermediateInvestment: '20000',
                longTermInvestment: '30000',
                neverInvestment: '5000'
              };
              setFormData(sample);
              // Clear any existing errors
              setErrors({});
              // Submit the form with the sample data
              onSubmit({
                age: Number(sample.age),
                gender: sample.gender,
                tobaccoUse: sample.tobaccoUse,
                shortTermInvestment: Number(sample.shortTermInvestment),
                intermediateInvestment: Number(sample.intermediateInvestment),
                longTermInvestment: Number(sample.longTermInvestment),
                neverInvestment: Number(sample.neverInvestment)
              });
            }}
          >
            Debug
          </button>
        )}
      </div>
    </form>
  );
};

export default InvestmentForm; 