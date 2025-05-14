import { useEffect, useState } from 'react';
import { LaborAttoneyCard } from '../components/LaborAttoneyCard';
import { apiClient } from '../services/apiClient';
import { LoadingLaborAttoneyCard } from '../components/loading/LoadingLaborAttoneyCard';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { FaUserSlash } from 'react-icons/fa';
import { FaPersonFallingBurst } from 'react-icons/fa6';
import { IoIosMore } from 'react-icons/io';
import { FaFaceFrown } from 'react-icons/fa6';
export const LaborAttorneyList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadConsultants = async () => {
    setLoading(true); // 데이터 로딩 시작
    const consultants = await apiClient.get('/api/user/consultant');
    setList(consultants.data);
    setLoading(false); // 데이터 로딩 시작
  };

  useEffect(() => {
    loadConsultants();
  }, []);

  const [checkedFilter, setCheckFilter] = useState({
    pay: false,
    fire: false,
    accident: true,
    bully: false,
    more: false,
  });

  const handleFilter = (name) => {
    setCheckFilter((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center ">
        <h2 className="text-2xl font-bold mt-10 mb-5 text-center">
          상담 가능한 노무사
        </h2>
        <div className="h-[1px] w-20 bg-gray-200 mb-10 "></div>
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
        <div className="flex flex-row gap-1.5 sm:gap-12 mb-15">
          <div
            className="flex flex-col items-center grow-0 shrink-0 hover:cursor-pointer transition-all active:scale-[97%] transform "
            onClick={() => handleFilter('pay')}
          >
            <div
              className={`p-3 sm:p-5 rounded-[100%]  w-fit  ${checkedFilter.pay ? 'bg-[#886b46]' : 'bg-[#f1eada]'}`}
            >
              <RiMoneyDollarCircleFill
                className="text-base sm:text-[36px]"
                color={checkedFilter.pay ? '#FEF9EB' : '#beac93'}
              />
            </div>
            <p className="text-xs sm:text-base">임금/퇴직금</p>
          </div>

          <div
            className="flex flex-col items-center grow-0 shrink-0 hover:cursor-pointer transition-all active:scale-[97%] transform "
            onClick={() => handleFilter('fire')}
          >
            <div
              className={`p-3 sm:p-5 rounded-[100%]  w-fit   ${checkedFilter.fire ? 'bg-[#886b46]' : 'bg-[#f1eada]'}`}
            >
              <FaUserSlash
                className="text-base sm:text-[36px]"
                color={checkedFilter.fire ? '#FEF9EB' : '#beac93'}
              />
            </div>
            <p className="text-xs sm:text-base">해고/징계</p>
          </div>

          <div
            className="flex flex-col items-center grow-0 shrink-0 hover:cursor-pointer transition-all active:scale-[97%] transform "
            onClick={() => handleFilter('accident')}
          >
            <div
              className={`p-3 sm:p-5 rounded-[100%] w-fit  ${checkedFilter.accident ? 'bg-[#886b46]' : 'bg-[#f1eada]'}`}
            >
              <FaPersonFallingBurst
                className="text-base sm:text-[36px]"
                color={checkedFilter.accident ? '#FEF9EB' : '#beac93'}
              />
            </div>
            <p className="text-xs sm:text-base">산업재해</p>
          </div>

          <div
            className="flex flex-col items-center grow-0 shrink-0 hover:cursor-pointer transition-all active:scale-[97%] transform "
            onClick={() => handleFilter('bully')}
          >
            <div
              className={`p-3 sm:p-5 rounded-[100%] w-fit ${checkedFilter.bully ? 'bg-[#886b46]' : 'bg-[#f1eada]'}`}
            >
              <FaFaceFrown
                className="text-base sm:text-[36px]"
                color={checkedFilter.bully ? '#FEF9EB' : '#beac93'}
              />
            </div>
            <p className="text-xs sm:text-base">직장내괴롭힘</p>
          </div>

          <div
            className="flex flex-col items-center grow-0 shrink-0 hover:cursor-pointer transition-all active:scale-[97%] transform "
            onClick={() => handleFilter('more')}
          >
            <div
              className={`p-3 sm:p-5 rounded-[100%]  w-fit   ${checkedFilter.more ? 'bg-[#886b46]' : 'bg-[#f1eada]'}`}
            >
              <IoIosMore
                className="text-base sm:text-[36px]"
                color={checkedFilter.more ? '#FEF9EB' : '#beac93'}
              />
            </div>
            <p className="text-xs sm:text-base">기타</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((attoney, index) => (
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
