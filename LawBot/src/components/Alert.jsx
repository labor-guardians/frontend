import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const Alert = ({ title, text, result, nav }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const swalWithBootstrapButtons = MySwal.mixin({
      customClass: {
        confirmButton: 'btn bg-[#653F21] text-white me-1 hover:bg-[#593315]',
        cancelButton: 'btn ms-1',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: title,
        text: text,
        icon: result ? 'success' : 'error',
        confirmButtonText: '확인',
      })
      .then(() => {
        if (result && nav) {
          navigate(nav);
        } else {
          navigate(0);
        }
      });
  }, [title, text, result, navigate]);

  return null;
};
