import React from 'react';

interface EditableGridProps {
 value: any[];
 onChange: (newValue: any[]) => void;
 columns?: string[]; // Optional: specify columns, otherwise infer from first row
 label?: string;
 schema?: { name: string; label: string }[]; // Add schema prop
}

const EditableGrid: React.FC<EditableGridProps> = ({ value, onChange, columns, label, schema }) => {
 const inferredColumns = columns || (value[0] ? Object.keys(value[0]) : []);

 // Map field name to label using schema if available
 const getColLabel = (col: string) => {
  if (schema) {
   const found = schema.find(f => f.name === col);
   if (found && found.label) return found.label;
  }
  // Fallback: prettify the column name
  return col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
 };

 const handleCellChange = (rowIdx: number, col: string, cellValue: string) => {
  const updated = value.map((row, idx) =>
   idx === rowIdx ? { ...row, [col]: cellValue } : row
  );
  onChange(updated);
 };

 const handleAddRow = () => {
  const emptyRow = inferredColumns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
  onChange([...value, emptyRow]);
 };

 const handleRemoveRow = (rowIdx: number) => {
  onChange(value.filter((_, idx) => idx !== rowIdx));
 };

 return (
  <div className="editable-grid" style={{ overflowX: 'auto' }}>
   {label && <h4>{label}</h4>}
   <table style={{ minWidth: 600 }}>
    <thead>
     <tr>
      {inferredColumns.map(col => (
       <th key={col} style={{ minWidth: 120 }}>{getColLabel(col)}</th>
      ))}
      <th style={{ minWidth: 48 }}></th>
     </tr>
    </thead>
    <tbody>
     {value.map((row, rowIdx) => (
      <tr key={rowIdx}>
       {inferredColumns.map(col => (
        <td key={col} style={{ minWidth: 120 }}>
         <input
          type="text"
          value={row[col] ?? ''}
          onChange={e => handleCellChange(rowIdx, col, e.target.value)}
         />
        </td>
       ))}
       <td style={{ minWidth: 48 }}>
        <span
         style={{ cursor: 'pointer', fontSize: '1.2em', color: '#f44336' }}
         onClick={() => handleRemoveRow(rowIdx)}
         title="Remove row"
         role="button"
         tabIndex={0}
         onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') handleRemoveRow(rowIdx); }}
        >
         🗑️
        </span>
       </td>
      </tr>
     ))}
    </tbody>
   </table>
   <button type="button" onClick={handleAddRow} className="add-row-button">+ Add Row</button>
  </div>
 );
};

export default EditableGrid; 