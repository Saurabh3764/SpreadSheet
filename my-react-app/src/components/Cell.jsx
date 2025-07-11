import React, { useState } from 'react';

const Cell = ({ cellId, raw, value, format, isSelected, onSelect, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(raw);

  const handleBlur = () => {
    setEditing(false);
    onChange(cellId, temp);
  };

  const style = {
    fontWeight: format.bold ? 'bold' : 'normal',
    backgroundColor: format.bg ? '#e0f7fa' : 'white',
    border: isSelected ? '2px solid black' : '1px solid gray',
    width: '100px',
    height: '30px',
    padding: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    cursor: 'pointer'
  };

  return (
    <div
      style={style}
      onClick={() => {
        setEditing(true);        
        setTemp(raw);
        onSelect();

      }}
   
       
    >
      {editing ? (
        <input
          autoFocus
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleBlur();
          }}
          style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}
        />
      ) : (
        value
      )}
    </div>
  );
};

export default Cell;