import { BsPersonCircle } from 'react-icons/bs';
import { baseURL } from '../constants/baseURL';
import useUserData from '../constants/hooks/useUserData';
import { USER } from '../constants/role';
import { formatDate } from '../utils/formatDate';

export const OtherChatBubble = ({ index, conversationInfo, msg }) => {
  const { role } = useUserData();

  return (
    <div className="chat chat-start" key={index}>
      {index == 0 ? (
        <>
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              {role === USER ? (
                conversationInfo.consultant.photo ? (
                  <img
                    alt="프로필 이미지"
                    src={baseURL + conversationInfo.consultant.photo}
                    className="w-full"
                  />
                ) : (
                  <BsPersonCircle color="#A5A5A5" size={40} />
                )
              ) : conversationInfo.user.photo ? (
                <img
                  alt="프로필 이미지"
                  src={baseURL + conversationInfo.user.photo}
                  className="w-full"
                />
              ) : (
                <BsPersonCircle color="#A5A5A5" size={40} />
              )}
            </div>
          </div>
          <div className="items-center chat-header text-lg text-[#38210f] gap-1.5">
            {role === USER
              ? conversationInfo.consultant.userName
              : conversationInfo.user.userName}
            <time className="text-xs opacity-50 text-[#413626]">
              {formatDate(msg.createdAt)}
            </time>
          </div>
          <div className="chat-bubble rounded-xl bg-[#e6ddc4] text-[#140a01]">
            {msg.content}
          </div>
        </>
      ) : (
        <div className="chat-bubble rounded-xl bg-[#e6ddc4] text-[#140a01] ml-[40px]">
          {msg.content}
        </div>
      )}
    </div>
  );
};
