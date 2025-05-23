import React, { useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

interface EditableGridProps {
 data: any[];
 columns: {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'select';
  options?: string[];
 }[];
 onEdit: (id: string, data: any) => void;
 onDelete: (id: string) => void;
}

const EditableGrid: React.FC<EditableGridProps> = ({
 data,
 columns,
 onEdit,
 onDelete
}) => {
 const [editingId, setEditingId] = useState<string | null>(null);
 const [editData, setEditData] = useState<Record<string, any>>({});

 const handleEdit = (id: string) => {
  const item = data.find(d => d.id === id);
  setEditData(item);
  setEditingId(id);
 };

 const handleSave = () => {
  onEdit(editingId!, editData);
  setEditingId(null);
  setEditData({});
 };

 const handleCancel = () => {
  setEditingId(null);
  setEditData({});
 };

 const handleChange = (key: string, value: any) => {
  setEditData((prev: Record<string, any>) => ({ ...prev, [key]: value }));
 };

 return (
  <div className="overflow-x-auto">
   <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
     <tr>
      {columns.map(column => (
       <th
        key={column.key}
        scope="col"
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
       >
        {column.label}
       </th>
      ))}
      <th scope="col" className="relative px-6 py-3">
       <span className="sr-only">Actions</span>
      </th>
     </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
     {data.map(item => (
      <tr key={item.id} className="hover:bg-gray-50">
       {columns.map(column => (
        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
         {editingId === item.id ? (
          column.type === 'select' ? (
           <select
            value={editData[column.key] || ''}
            onChange={e => handleChange(column.key, e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
           >
            <option value="">Select {column.label}</option>
            {column.options?.map(option => (
             <option key={option} value={option}>
              {option}
             </option>
            ))}
           </select>
          ) : (
           <input
            type={column.type || 'text'}
            value={editData[column.key] || ''}
            onChange={e => handleChange(column.key, e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
           />
          )
         ) : (
          item[column.key]
         )}
        </td>
       ))}
       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {editingId === item.id ? (
         <div className="flex items-center justify-end gap-2">
          <button
           onClick={handleSave}
           className="text-green-600 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
           <FaCheck className="w-5 h-5" />
          </button>
          <button
           onClick={handleCancel}
           className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
           <FaTimes className="w-5 h-5" />
          </button>
         </div>
        ) : (
         <div className="flex items-center justify-end gap-2">
          <button
           onClick={() => handleEdit(item.id)}
           className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
           <FaEdit className="w-5 h-5" />
          </button>
          <button
           onClick={() => onDelete(item.id)}
           className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
           <FaTrash className="w-5 h-5" />
          </button>
         </div>
        )}
       </td>
      </tr>
     ))}
    </tbody>
   </table>
  </div>
 );
};

export default EditableGrid; 