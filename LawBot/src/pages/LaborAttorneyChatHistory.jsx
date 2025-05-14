import { useEffect, useState } from 'react';
import { LaborChatHistoryCard } from '../components/LaborChatHistoryCard';
import { apiClient } from '../services/apiClient';
import useUserData from '../constants/hooks/useUserData';
import { CONSULTANT, USER } from '../constants/role';

export const LaborAttorneyChatHistory = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, role } = useUserData();

  const loadChatHistory = async () => {
    setLoading(true); // 데이터 로딩 시작
    try {
      if (role == USER) {
        await getHistoryByUser();
      } else if (role == CONSULTANT) {
        await getHistoryByConsultant();
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoading(false); // 데이터 로딩 종료
    }
  };

  const getHistoryByUser = async () => {
    const res = await apiClient.get(`/api/conversations/user/${userId}`, {
      params: {
        type: 'CONSULTANT',
      },
    });
    setHistories(res.data);

    console.log(res.data);
  };

  const getHistoryByConsultant = async () => {
    const res = await apiClient.get(`/api/conversations/consultant/${userId}`, {
      params: {
        type: 'CONSULTANT',
      },
    });
    setHistories(res.data);
  };

  useEffect(() => {
    if (userId && role) {
      loadChatHistory();
    }
  }, [userId, role]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mt-10 mb-5 text-center">
          {role == USER ? '노무사와 상담기록' : '상담기록'}
        </h2>
        <div className="h-[1px] w-20 bg-gray-200 mb-10"></div>
        <span className="loading loading-dots loading-xs text-[#867161]"></span>
      </div>
    );
  }

  // 데이터가 로딩되었을 때 표시할 UI
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mt-10 mb-5 text-center">
        {role == USER ? '노무사와 상담기록' : '상담기록'}
      </h2>
      <div className="h-[1px] w-20 bg-gray-200 mb-10"></div>
      <div className="flex flex-col items-center gap-4 w-full">
        {histories.map((history) => (
          <LaborChatHistoryCard
            id={history.id}
            otherUserId={
              role == CONSULTANT
                ? history.user && history.user.userId
                : history.consultant && history.consultant.userId
            }
            otherUserName={
              role == CONSULTANT
                ? history.user && history.user.userName
                : history.consultant && history.consultant.userName
            }
            photo={history.consultant && history.consultant.photo}
            key={history.id}
          />
        ))}
      </div>
    </div>
  );
};
