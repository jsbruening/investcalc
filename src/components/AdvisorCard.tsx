import React from 'react';
import { FaUserTie, FaEnvelope, FaPhone, FaUserCircle } from 'react-icons/fa';

interface AdvisorCardProps {
 name: string;
 email: string;
 phone: string;
 avatar?: React.ReactNode;
}

const AdvisorCard: React.FC<AdvisorCardProps> = ({
 name,
 email,
 phone,
 avatar = <FaUserCircle className="w-12 h-12 text-gray-400" />
}) => {
 return (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
   <div className="p-6">
    <div className="flex items-start gap-4">
     <div className="flex-shrink-0">
      {avatar}
     </div>
     <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
       <FaUserTie className="w-4 h-4 text-gray-400" />
       <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
      </div>

      <div className="mt-4 space-y-3">
       <a
        href={`mailto:${email}`}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
       >
        <FaEnvelope className="w-4 h-4 text-gray-400" />
        <span className="truncate">{email}</span>
       </a>

       <a
        href={`tel:${phone}`}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
       >
        <FaPhone className="w-4 h-4 text-gray-400" />
        <span>{phone}</span>
       </a>
      </div>
     </div>
    </div>

    <div className="mt-6 pt-6 border-t border-gray-100">
     <button
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
     >
      Schedule Meeting
     </button>
    </div>
   </div>
  </div>
 );
};

export default AdvisorCard; 