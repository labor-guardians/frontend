import { useEffect, useState } from 'react';
import { LaborAttoneyCard } from '../components/LaborAttoneyCard';
import { apiClient } from '../services/apiClient';
import { LoadingLaborAttoneyCard } from '../components/loading/LoadingLaborAttoneyCard';
import { FilterList } from '../components/FilterList';
import { CityDistrictSelector } from '../components/CityDistrictSelector';
export const LaborAttorneyList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedFilter, setCheckFilter] = useState('');
  const [selectedCity, setSelectedCity] = useState('전체');
  const [selectedDistrict, setSelectedDistrict] = useState('전체');

  const loadConsultants = async () => {
    setLoading(true); // 데이터 로딩 시작

    try {
      const endpoint = checkedFilter
        ? `/api/user/consultant?category=${checkedFilter}`
        : `/api/user/consultant`;

      const consultants = await apiClient.get(endpoint);
      setList(consultants.data);
    } catch (error) {
      console.error('노무사 목록 불러오기 실패:', error);
      setList([]);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    loadConsultants();
  }, [checkedFilter]);

  const handleFilter = (category) => {
    setCheckFilter((prev) => (prev === category ? '' : category));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    console.log('선택한 시도:', city);
    setSelectedCity(city);
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    console.log('선택한 구:', district);
    setSelectedDistrict(district);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center ">
        <h2 className="text-2xl font-bold mt-10 mb-5 text-center">
          상담 가능한 노무사
        </h2>
        <div className="h-[1px] w-20 bg-gray-200 mb-10 "></div>
        <FilterList
          checkedFilter={checkedFilter}
          setCheckFilter={handleFilter}
        />
        <CityDistrictSelector
          selectedCity={selectedCity}
          selectedDistrict={selectedDistrict}
          handleCityChange={handleCityChange}
          handleDistrictChange={handleDistrictChange}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingLaborAttoneyCard index={index} key={index} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-center items-center ">
        <h2 className="text-2xl font-bold mt-10 mb-5 text-center">
          상담 가능한 노무사
        </h2>
        <div className="h-[1px] w-20 bg-gray-200 mb-10 "></div>
        <FilterList
          checkedFilter={checkedFilter}
          setCheckFilter={handleFilter}
        />
        <div className="flex self-end items-center mb-4">
          <div className="me-4">지역</div>
          <div className="flex self-end gap-2">
            <select
              defaultValue="전체"
              className="w-fit select self-end"
              onChange={handleCityChange}
            >
              <option>전체</option>
              <option>서울특별시</option>
              <option>경기도</option>
              <option>인천과역시</option>
            </select>
            <select
              defaultValue="전체"
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list &&
            list.map((attoney, index) => (
              <LaborAttoneyCard
                consultantId={attoney.userId}
                userName={attoney.userName}
                description={attoney.description}
                photo={attoney.photo}
                key={attoney.userId}
                index={index}
              />
            ))}
        </div>
      </div>
    );
  }
};
