import React from 'react';
import './cell.css';

const Cell = ({ value, isActive, onClick }) => (
  <button className={`cell ${isActive ? 'active' : ''}`} onClick={onClick}>
    {value}
  </button>
);

export default Cell;