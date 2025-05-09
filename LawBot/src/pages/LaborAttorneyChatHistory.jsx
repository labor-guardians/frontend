import { useEffect, useState } from 'react';
import { LaborChatHistoryCard } from '../components/LaborChatHistoryCard';
import { apiClient } from '../services/apiClient';
import useUserData from '../constants/hooks/useUserData';

export const LaborAttorneyChatHistory = () => {
  const [histories, setHistories] = useState([]);
  const { userId } = useUserData();

  const loadChatHistory = async () => {
    const res = await apiClient.get(`/api/conversations/user/${userId}`);
    console.log(res);
    setHistories(res.data);
  };

  useEffect(() => {
    if (userId) {
      loadChatHistory();
    }
  }, [userId]);

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className=" text-2xl font-bold mt-10 mb-5 text-center">
        노무사와 대화기록
      </h2>
      <div className="h-[1px] w-20 bg-gray-200 mb-10"></div>
      <div className="flex flex-col items-center gap-4 w-full">
        {histories.map((history) => (
          <LaborChatHistoryCard
            id={history.id}
            consultantId={history.consultant.userId}
            title={history.title}
            consultantName={history.consultant.userName}
            photo={history.consultant.photo}
            key={history.id}
          />
        ))}
      </div>
    </div>
  );
};
