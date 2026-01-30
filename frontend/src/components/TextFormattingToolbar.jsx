import React, { useState } from 'react';
import { Bold, Italic, Underline, Eraser, Type } from 'lucide-react';

const TextFormattingToolbar = ({ onFormat, disabled = false }) => {
  const [fontSize, setFontSize] = useState('3');

  const handleFormatClick = (formatType) => {
    if (disabled) return;
    onFormat(formatType);
  };

  const handleFontSizeChange = (newSize) => {
    if (disabled) return;
    setFontSize(newSize);
    onFormat('fontSize', newSize);
  };

  const fontSizes = [
    { value: '1', label: '10px', style: { fontSize: '10px' } },
    { value: '2', label: '12px', style: { fontSize: '12px' } },
    { value: '3', label: '14px', style: { fontSize: '14px' } },
    { value: '4', label: '16px', style: { fontSize: '16px' } },
    { value: '5', label: '18px', style: { fontSize: '18px' } },
    { value: '6', label: '24px', style: { fontSize: '24px' } },
    { value: '7', label: '32px', style: { fontSize: '32px' } }
  ];

  return (
    <div className="flex gap-2 p-2 bg-white border rounded-lg shadow-sm items-center">
      <button
        onClick={() => handleFormatClick('bold')}
        disabled={disabled}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => handleFormatClick('italic')}
        disabled={disabled}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        title="Italic (Ctrl+I)"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => handleFormatClick('underline')}
        disabled={disabled}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        title="Underline (Ctrl+U)"
      >
        <Underline size={16} />
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      
      {/* Font Size Dropdown */}
      <div className="flex items-center gap-1">
        <Type size={16} className="text-gray-600" />
        <select
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
          disabled={disabled}
          className={`px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          title="Font Size"
        >
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="w-px bg-gray-300 mx-1" />
      <button
        onClick={() => handleFormatClick('clear')}
        disabled={disabled}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        title="Clear Formatting"
      >
        <Eraser size={16} />
      </button>
    </div>
  );
};

export default TextFormattingToolbar;
