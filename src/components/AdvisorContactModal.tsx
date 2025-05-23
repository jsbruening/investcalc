import React, { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaComment } from 'react-icons/fa';

interface AdvisorContactModalProps {
 isOpen: boolean;
 onClose: () => void;
 advisorName: string;
 advisorEmail: string;
 advisorPhone: string;
 onSubmit: (data: {
  name: string;
  email: string;
  phone: string;
  message: string;
 }) => void;
}

const AdvisorContactModal: React.FC<AdvisorContactModalProps> = ({
 isOpen,
 onClose,
 advisorName,
 advisorEmail,
 advisorPhone,
 onSubmit
}) => {
 const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  message: ''
 });

 const [errors, setErrors] = useState<Record<string, string>>({});

 const validateForm = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.name) {
   newErrors.name = 'Name is required';
  }

  if (!formData.email) {
   newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
   newErrors.email = 'Email is invalid';
  }

  if (!formData.phone) {
   newErrors.phone = 'Phone number is required';
  }

  if (!formData.message) {
   newErrors.message = 'Message is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
 };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (validateForm()) {
   onSubmit(formData);
   onClose();
  }
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  if (errors[name]) {
   setErrors(prev => ({ ...prev, [name]: '' }));
  }
 };

 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 z-50 overflow-y-auto">
   <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
     <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>

    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
     <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
       <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
        <div className="flex items-center justify-between">
         <h3 className="text-lg leading-6 font-medium text-gray-900">
          Contact {advisorName}
         </h3>
         <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
         >
          <FaTimes className="w-5 h-5" />
         </button>
        </div>

        <div className="mt-4 space-y-4">
         <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaEnvelope className="w-4 h-4" />
          <span>{advisorEmail}</span>
         </div>
         <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaPhone className="w-4 h-4" />
          <span>{advisorPhone}</span>
         </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
         <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
           <div className="flex items-center gap-2">
            <FaUser className="w-4 h-4 text-gray-400" />
            Your Name
           </div>
          </label>
          <input
           type="text"
           id="name"
           name="name"
           value={formData.name}
           onChange={handleChange}
           className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${errors.name ? 'border-red-300' : ''
            }`}
          />
          {errors.name && (
           <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
         </div>

         <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
           <div className="flex items-center gap-2">
            <FaEnvelope className="w-4 h-4 text-gray-400" />
            Your Email
           </div>
          </label>
          <input
           type="email"
           id="email"
           name="email"
           value={formData.email}
           onChange={handleChange}
           className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${errors.email ? 'border-red-300' : ''
            }`}
          />
          {errors.email && (
           <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
         </div>

         <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
           <div className="flex items-center gap-2">
            <FaPhone className="w-4 h-4 text-gray-400" />
            Your Phone
           </div>
          </label>
          <input
           type="tel"
           id="phone"
           name="phone"
           value={formData.phone}
           onChange={handleChange}
           className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${errors.phone ? 'border-red-300' : ''
            }`}
          />
          {errors.phone && (
           <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
         </div>

         <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
           <div className="flex items-center gap-2">
            <FaComment className="w-4 h-4 text-gray-400" />
            Message
           </div>
          </label>
          <textarea
           id="message"
           name="message"
           rows={4}
           value={formData.message}
           onChange={handleChange}
           className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${errors.message ? 'border-red-300' : ''
            }`}
          />
          {errors.message && (
           <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
         </div>
        </form>
       </div>
      </div>
     </div>

     <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button
       type="button"
       onClick={handleSubmit}
       className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
      >
       Send Message
      </button>
      <button
       type="button"
       onClick={onClose}
       className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      >
       Cancel
      </button>
     </div>
    </div>
   </div>
  </div>
 );
};

export default AdvisorContactModal; 