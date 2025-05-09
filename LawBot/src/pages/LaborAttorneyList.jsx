import { useEffect, useState } from 'react';
import { LaborAttoneyCard } from '../components/LaborAttoneyCard';
import { apiClient } from '../services/apiClient';
import useUserData from '../constants/hooks/useUserData';

export const LaborAttorneyList = () => {
  const [list, setList] = useState([]);

  const loadConsultants = async () => {
    const consultants = await apiClient.get('/api/user/consultant');
    setList(consultants.data);
  };

  const { userId, access, role } = useUserData();

  useEffect(() => {
    loadConsultants();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center ">
      <h2 className="text-2xl font-bold mt-10 mb-5 text-center">
        상담 가능한 노무사
      </h2>
      <div className="h-[1px] w-20 bg-gray-200 mb-10 "></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((attoney, index) => (
          <LaborAttoneyCard
            userId={attoney.userId}
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
};
