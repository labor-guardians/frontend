export const CityDistrictSelector = ({
  selectedCity,
  selectedDistrict,
  handleCityChange,
  handleDistrictChange,
}) => {
  return (
    <div className="flex self-end items-center mb-4">
      <div className="me-4">지역</div>
      <div className="flex self-end gap-2">
        <select
          value={selectedCity}
          className="w-fit select self-end"
          onChange={handleCityChange}
        >
          <option>전체</option>
          <option>서울특별시</option>
          <option>경기도</option>
          <option>인천과역시</option>
        </select>
        <select
          value={selectedDistrict}
          className="w-fit select self-end"
          onChange={handleDistrictChange}
        >
          <option>전체</option>
          <option>강남구</option>
          <option>강동구</option>
          <option>강북구</option>
          <option>강서구</option>
        </select>
      </div>
    </div>
  );
};
