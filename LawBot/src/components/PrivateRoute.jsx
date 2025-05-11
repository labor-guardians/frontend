import { useLocation, useNavigate } from 'react-router-dom';
import useUserData from '../constants/hooks/useUserData';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const PrivateRoute = ({ children }) => {
  const { userId, isLoading } = useUserData();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-52">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  if (!userId) {
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
        } else if (result.dismiss) {
          navigate(-1);
        }
      });
    return <div></div>;
    // return <Navigate to="/login" replace state={{ from: location }} />;
  } else {
    return <div>{children}</div>;
  }
};
