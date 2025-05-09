import { useNavigate } from 'react-router-dom';
import { LABOR_ATTORNEY_CHAT } from '../constants/path';
import { Button } from './Button';
import { BsPersonCircle } from 'react-icons/bs';
import { baseURL } from '../constants/baseURL';

export const LaborChatHistoryCard = ({
  id,
  consultantId,
  title,
  consultantName,
  photo,
}) => {
  const navigate = useNavigate();

  const goChat = () => {
    navigate(`/${LABOR_ATTORNEY_CHAT}/${consultantId}`, {
      state: { conversationId: id },
    });
  };

  return (
    <div
      className={
        'card card-side bg-base-100 shadow-sm w-full  max-w-3xl h-[120px]'
      }
    >
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
        <h2 className="card-title ">{consultantName}</h2>
        <div className="flex flex-row gap-8 ">
          <p className="line-clamp-2">{title}</p>
          <div className="card-actions w-fit justify-end shrink-0">
            <Button onClick={goChat} text="이어서 상담하기" />
          </div>
        </div>
      </div>
    </div>
  );
};
