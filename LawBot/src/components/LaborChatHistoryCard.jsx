import { useNavigate } from 'react-router-dom';
import { LABOR_ATTORNEY_CHAT } from '../constants/path';
import { Button } from './Button';
import { BsPersonCircle } from 'react-icons/bs';
import { baseURL } from '../constants/baseURL';
import { apiClient } from '../services/apiClient';
import { useEffect, useState } from 'react';
import useUserData from '../constants/hooks/useUserData';
import { CONSULTANT } from '../constants/role';
import { isMyMessage } from '../utils/isMyMessage';

export const LaborChatHistoryCard = ({
  id,
  otherUserId,
  otherUserName,
  photo,
}) => {
  const navigate = useNavigate();
  const { userId, role } = useUserData();
  const [messages, setMessages] = useState([]);

  const getMessage = async () => {
    if (userId && role) {
      const res = await apiClient.get(
        `/api/conversations/${id}?accessorId=${userId}&isConsultant=${role == CONSULTANT}`,
      );
      setMessages(res.data.messages);
    }
  };

  const getUnreadCount = (messages) => {
    let count = 0;

    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];

      if (msg.isRead || isMyMessage(msg.fromUser, role)) {
        break; // 읽은 메시지를 만나면 그만 센다
      }

      count++;
    }

    return count;
  };

  const getLastMessage = (messages) => {
    if (messages.length <= 0) {
      return '';
    }
    return messages[messages.length - 1].content;
  };

  const goChat = () => {
    navigate(`/${LABOR_ATTORNEY_CHAT}`, {
      state: { conversationId: id, otherUserId: otherUserId },
    });
  };

  useEffect(() => {
    getMessage();
  }, [userId]);

  return (
    <div
      className={
        'card card-side bg-base-100 shadow-sm w-full  max-w-3xl h-[120px] indicator'
      }
    >
      {getUnreadCount(messages) > 0 && (
        <span className="indicator-item w-fit h-fit bg-[#C7372F] text-xs text-white px-2 py-1 rounded-4xl">
          {getUnreadCount(messages)}
        </span>
      )}

      <figure className="shrink-0">
        {photo ? (
          <img
            src={baseURL + photo}
            alt="Movie"
            className="w-[84px]  object-contain"
          />
        ) : (
          <BsPersonCircle
            color="#A5A5A5"
            className="w-[84px]  object-contain"
          />
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title ">{otherUserName}님</h2>
        <div className="flex flex-row gap-8 ">
          <p className="line-clamp-2 text-[#70695a]">
            {getLastMessage(messages)}
          </p>
          <div className="card-actions w-fit justify-end shrink-0">
            <Button onClick={goChat} text="이어서 상담하기" />
          </div>
        </div>
      </div>
    </div>
  );
};
