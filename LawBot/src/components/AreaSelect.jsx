import React, { useState } from 'react';
import { area } from '../constants/area';

const AreaSelect = ({ onAreaChange }) => {
  // 상태 관리
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSubArea, setSelectedSubArea] = useState('');

  // 선택된 지역에 따라 하위 지역 목록을 가져옴
  const subAreas =
    area.find((area) => area.name === selectedArea)?.subArea || [];

  // 이벤트 핸들러
  const handleAreaChange = (e) => {
    const newArea = e.target.value;
    setSelectedArea(e.target.value);
    setSelectedSubArea(''); // 새로운 지역 선택 시 하위 지역 초기화
    onAreaChange({ area: newArea, subArea: '' });
  };

  const handleSubAreaChange = (e) => {
    const newSubArea = e.target.value;
    setSelectedSubArea(e.target.value);
    onAreaChange({ area: selectedArea, subArea: newSubArea });
  };

  return (
    <div className="mt-5 flex flex-row">
      <select
        value={selectedArea}
        onChange={handleAreaChange}
        className="text-center border-1 border-gray-500 py-2 px-2 mx-1 rounded-md text-black"
      >
        <option value="">지역을 선택해주세요</option>
        {area.map((area) => (
          <option key={area.name} value={area.name}>
            {area.name}
          </option>
        ))}
      </select>

      {selectedArea && (
        <select
          value={selectedSubArea}
          onChange={handleSubAreaChange}
          className="text-center border-1 border-gray-500 py-2 px-2 mx-1 rounded-md text-black"
        >
          <option value="">시, 군, 구를 선택해주세요</option>
          {subAreas.map((subArea) => (
            <option key={subArea} value={subArea}>
              {subArea}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AreaSelect;
