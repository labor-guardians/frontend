import { useRef, useState } from 'react';
import { InputText } from '../components/InputText';
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { FIND_PASSWORD, LOGIN } from '../constants/path';
import { apiClient } from '../services/apiClient';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal);

export const FindId = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadings, setIsLoadings] = useState({
    sendEmail: '',
  });
  const [formData, setFormData] = useState({
    email: null,
    code: null,
  });
  const [errors, setErrors] = useState({
    global: '',
  });
  const [isEmailError, setEmailError] = useState(false);
  const [isCodeError, setCodeError] = useState(false);
  const [isSendCode, setSendCode] = useState(false);
  const emailInputRef = useRef(null);
  const codeInputRef = useRef(null);

  const sendCode = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, global: '모든 항목을 입력해주세요.' }));
      emailInputRef.current.focus();
      return;
    }
    setErrors((prev) => ({ ...prev, global: '' }));

    setIsLoadings((prev) => ({ ...prev, sendEmail: true }));
    apiClient
      .post('/api/auth/sendEmailForUserId', {
        email: formData.email,
      })
      .then(() => {
        setEmailError(false);
        setSendCode(true);
      })
      .catch(() => {
        setEmailError(true);
      })
      .finally(() => {
        setIsLoadings((prev) => ({ ...prev, sendEmail: false }));
      });

    // api 성공시
  };

  const findId = async (e) => {
    e.preventDefault();
    if (!formData.code) {
      setErrors((prev) => ({ ...prev, global: '모든 항목을 입력해주세요.' }));
      codeInputRef.current.focus();
      return;
    }
    setErrors((prev) => ({ ...prev, global: '' }));
    setIsLoading(true);
    const res = await apiClient.post(
      '/api/auth/verifyEmailForUserId',
      formData,
    );
    setIsLoading(false);

    if (res.data == '인증 실패') {
      setCodeError(true);
    } else {
      setCodeError(false);
      const swalWithBootstrapButtons = MySwal.mixin({
        customClass: {
          confirmButton:
            'btn bg-[#653F21] text-white me-1 px-5 hover:bg-[#593315]',
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: '아이디를 성공적으로 찾았습니다.',
          text: '아이디: ' + res.data,
          icon: 'success',
          confirmButtonText: '확인',
        })
        .then(() => {
          navigate('/login');
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-md m-auto flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-10">아이디 찾기</h2>
      <form className="w-full flex flex-col items-center gap-4">
        <div className="flex gap-1 w-full">
          <InputText
            type="email"
            placeholder={'이메일'}
            label={'이메일'}
            value={formData.email || ''}
            onChange={handleChange}
            name="email"
            isValidation={formData.email != ''}
            validationText={'이메일을 입력해주세요'}
            ref={emailInputRef}
            readOnly={isSendCode}
          />
          <Button
            className={'min-w-[115px]'}
            text={
              isLoadings.sendEmail ? (
                <span className="loading loading-dots loading-xs"></span>
              ) : (
                '인증번호 발송'
              )
            }
            disabled={isSendCode}
            onClick={sendCode}
          />
        </div>
        {isEmailError && (
          <p className="text-red-500 text-sm">
            이 이메일로 가입된 계정이 없습니다.
          </p>
        )}
        {isSendCode && (
          <InputText
            placeholder="인증번호"
            label="인증번호"
            onChange={handleChange}
            value={formData.code || ''}
            name="code"
            ref={codeInputRef}
          />
        )}
        {isCodeError && (
          <p className="text-red-500 text-sm">인증번호가 틀렸습니다.</p>
        )}
        {errors.global && (
          <p className="text-red-500 text-center mb-4">{errors.global}</p>
        )}
        {isSendCode && (
          <Button
            text={
              isLoading ? (
                <span className="loading loading-dots loading-xs"></span>
              ) : (
                '아이디 찾기'
              )
            }
            size={'w-full mt-5'}
            onClick={findId}
            type={'submit'}
          />
        )}
      </form>

      <div className="mt-8 flex flex-col sm:flex-row gap-5 text-center">
        <Link to={LOGIN}>로그인</Link>
        <div className="hidden sm:block">|</div>
        <Link to={FIND_PASSWORD}>비밀번호 찾기</Link>
      </div>
    </div>
  );
};
