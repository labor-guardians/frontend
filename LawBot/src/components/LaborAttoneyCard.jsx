import { useLocation, useNavigate } from 'react-router-dom';
import { LABOR_ATTORNEY_CHAT } from '../constants/path';
import { Button } from './Button';
import { baseURL } from '../constants/baseURL';
import { BsPersonCircle, BsPersonFill } from 'react-icons/bs';
import { CONSULTANT, USER } from '../constants/role';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import useUserData from '../constants/hooks/useUserData';
import 'animate.css';

const MySwal = withReactContent(Swal);

export const LaborAttoneyCard = ({
  consultantId,
  userName,
  description,
  photo,
  index,
}) => {
  const navigate = useNavigate();

  const { role } = useUserData();
  const location = useLocation();

  // '채팅하기' 버튼 클릭
  const goChat = () => {
    if (role == USER) {
      navigate(`/${LABOR_ATTORNEY_CHAT}`, {
        state: {
          otherUserId: consultantId,
        },
      });
    } else if (role == CONSULTANT) {
      // 노무사 간 채팅 방지
      const swalWithBootstrapButtons = MySwal.mixin({
        customClass: {
          confirmButton: 'btn bg-[#653F21] text-white me-1 hover:bg-[#593315]',
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons.fire({
        title: '일반 유저만 가능합니다.',
        html: '노무사 간 채팅은 시스템 정책상 차단되어 있어요.<br/>양해 부탁드립니다.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    } else {
      // 로그인하지 않은 경우
      const swalWithBootstrapButtons = MySwal.mixin({
        customClass: {
          confirmButton: 'btn bg-[#653F21] text-white me-1 hover:bg-[#593315]',
          cancelButton: 'btn  ms-1',
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: '로그인이 필요합니다',
          text: '로그인 화면으로 이동하시겠습니까?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '취소',
        })
        .then((result) => {
          if (result.isConfirmed) {
            navigate('/login', { state: { from: location } });
          }
        });
    }
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
            color="#e7dfcc"
            className="w-[120px] sm:w-[200px] object-contain"
          />
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{userName}</h2>
        <p className="line-clamp-7">{description}</p>
        <div className="card-actions justify-end">
          <Button onClick={goChat} text="상담하기" />
        </div>
      </div>
    </div>
  );
};
