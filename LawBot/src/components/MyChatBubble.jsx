import { formatDate } from '../utils/formatDate';

export const MyChatBubble = ({ index, msg, length }) => {
  return (
    <div className="chat chat-end self-end w-full">
      {index == 0 && (
        <time className="text-xs opacity-50 text-[#413626] mb-1">
          {formatDate(msg.createdAt)}
        </time>
      )}
      <div className="chat-bubble rounded-xl bg-[#947950] text-[#ffffff]">
        {msg.content}
      </div>
      {index == length - 1 && msg.read && (
        <div className="chat-footer opacity-50">읽음</div>
      )}
    </div>
  );
};
