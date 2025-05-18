import React from 'react';

export const ContextMenu = ({ x, y, onEdit, onDelete }) => {
  return (
    <ul
      className="fixed bg-white border border-gray-300 rounded shadow-md z-50"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={onEdit}
      >
        수정
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={onDelete}
      >
        삭제
      </li>
    </ul>
  );
};

export default ContextMenu;
