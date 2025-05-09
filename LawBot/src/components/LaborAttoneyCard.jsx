import { useNavigate } from 'react-router-dom';
import { LABOR_ATTORNEY_CHAT } from '../constants/path';
import { Button } from './Button';
import { baseURL } from '../constants/baseURL';
import { BsPersonCircle } from 'react-icons/bs';

export const LaborAttoneyCard = ({
  userId,
  userName,
  description,
  photo,
  index,
}) => {
  const navigate = useNavigate();

  const goChat = () => {
    navigate(`/${LABOR_ATTORNEY_CHAT}/${userId}`);
  };

  return (
    <div
      className={`card card-side bg-base-100 shadow-sm shrink-0 
        ${index == 0 && 'xl:col-start-1 xl:col-end-3'}
        ${index == 9 && 'xl:col-start-2 xl:col-end-4'}
      }`}
    >
      <figure className="shrink-0">
        {photo ? (
          <img
            src={baseURL + photo}
            alt="Movie"
            className="w-[120px] sm:w-[200px] object-contain"
          />
        ) : (
          <BsPersonCircle
            color="#A5A5A5"
            className="w-[120px] sm:w-[200px] object-contain"
          />
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{userName}</h2>
        <p className="line-clamp-7">{description}</p>
        <div className="card-actions justify-end">
          <Button onClick={goChat} text="채팅하기" />
        </div>
      </div>
    </div>
  );
};
