import { area } from '../constants/area';
import { SelectBox } from './SelectBox';

export const CityDistrictSelector = ({
  selectedCity,
  selectedDistrict,
  handleCityChange,
  handleDistrictChange,
}) => {
  const districtOptions =
    selectedCity === '전체' || selectedCity === ''
      ? []
      : area.find((a) => a.name === selectedCity)?.subArea || [];

  return (
    <div className="flex self-end items-center mb-4">
      <div className="me-4">지역</div>
      <div className="flex self-end gap-2">
        <SelectBox
          value={selectedCity}
          onChange={handleCityChange}
          options={['전체', ...area.map((a) => a.name)]}
          className="w-fit select self-end"
        />
        <SelectBox
          value={selectedDistrict}
          onChange={handleDistrictChange}
          options={['전체', ...districtOptions]}
          className="w-fit select self-end"
        />
      </div>
    </div>
  );
};
