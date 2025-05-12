import { useRef, useState } from 'react';
import { FIND_ID, LOGIN } from '../constants/path';
import { Button } from '../components/Button';
import { InputText } from '../components/InputText';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal);

export const FindPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    code: '',
    newPassword: '',
    newPasswordCheck: '',
  });
  const [touched, setTouched] = useState({
    userName: '',
    email: '',
    code: '',
    newPassword: '',
    newPasswordCheck: '',
  });
  const [isInfoError, setInfoError] = useState(false);
  const [isSendCode, setSendCode] = useState(false);
  const [isVerifyCode, setIsVerifyCode] = useState(false);
  const [errors, setErrors] = useState({
    code: '',
    passwordCheck: '',
    global: '',
  });
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const codeInputRef = useRef(null);

  const sendCode = async () => {
    if (!formData.userName) {
      setErrors((prev) => ({ ...prev, global: '모든 항목을 입력해주세요.' }));
      emailInputRef.current.focus();
      return;
    }
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, global: '모든 항목을 입력해주세요.' }));
      emailInputRef.current.focus();
      return;
    }
    setErrors((prev) => ({ ...prev, global: '' }));

    setSendCode(true);
    apiClient
      .post('/api/auth/sendEmailForPassword', {
        userName: formData.userName,
        email: formData.email,
      })
      .then(() => {
        setInfoError(false);
      })
      .catch(() => {
        setInfoError(true);
      });
  };

  const verifyCode = () => {
    if (!formData.userName) {
      setErrors((prev) => ({ ...prev, global: '모든 항목을 입력해주세요.' }));
      emailInputRef.current.focus();
      return;
    }
    if (!formData.code) {
      setErrors((prev) => ({ ...prev, global: '모든 항목을 입력해주세요.' }));
      codeInputRef.current.focus();
      return;
    }
    setErrors((prev) => ({ ...prev, global: '' }));

    setErrors((prev) => ({ ...prev, code: '' }));
    apiClient
      .post('/api/auth/verifyEmailForPassword', {
        email: formData.email,
        code: formData.code,
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          setIsVerifyCode(true);
        } else {
          setErrors((prev) => ({ ...prev, code: '인증번호가 틀렸습니다.' }));
        }
      });
  };

  const findPassword = (e) => {
    e.preventDefault();

    setErrors((prev) => ({ ...prev, code: '' }));

    if (
      !formData.userName ||
      !formData.email ||
      !formData.code ||
      !formData.newPassword ||
      !formData.newPasswordCheck
    ) {
      setErrors((prev) => ({ ...prev, global: '모든 항목을 입력해주세요.' }));
      return;
    } else if (formData.newPassword != formData.newPasswordCheck) {
      setErrors((prev) => ({
        ...prev,
        passwordCheck: '비밀번호가 서로 다릅니다.',
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, global: '' }));

    setIsLoading(true);
    apiClient
      .put('/api/auth/password', {
        email: formData.email,
        newPassword: formData.newPassword,
      })
      .then(() => {
        const swalWithBootstrapButtons = MySwal.mixin({
          customClass: {
            confirmButton:
              'btn bg-[#653F21] text-white me-1 px-5 hover:bg-[#593315]',
          },
          buttonsStyling: false,
        });
        swalWithBootstrapButtons
          .fire({
            title: '비밀번호를 성공적으로 변경했습니다.',
            text: '새로 로그인해주세요',
            icon: 'success',
            confirmButtonText: '확인',
          })
          .then(() => {
            navigate('/login');
          });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevState) => ({
      ...prevState,
      [name]: true,
    }));
  };
  return (
    <div className="max-w-md m-auto flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-10">비밀번호 찾기</h2>
      <form className="w-full flex flex-col items-center gap-4">
        <InputText
          placeholder={'이름'}
          label={'이름'}
          onChange={handleChange}
          name="userName"
          onBlur={handleBlur}
          value={formData.userName || ''}
          isValidation={!touched.userName || formData.userName != ''}
          validationText={'이름을 입력해주세요'}
          ref={nameInputRef}
        />
        <div className="flex gap-1 w-full">
          <InputText
            type="email"
            placeholder={'이메일'}
            label={'이메일'}
            value={formData.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            name="email"
            isValidation={!touched.email || formData.email != ''}
            validationText={'이메일을 입력해주세요'}
            ref={emailInputRef}
          />
          <Button
            text="인증번호 발송"
            onClick={sendCode}
            disabled={isSendCode}
          />
        </div>
        {isInfoError && (
          <p className="text-red-500 text-sm">
            이 이름과 이메일로 가입된 계정이 없습니다.
          </p>
        )}
        {isSendCode && (
          <div className="flex gap-1 w-full">
            <InputText
              placeholder="인증번호"
              label="인증번호"
              onChange={handleChange}
              value={formData.code || ''}
              name="code"
              ref={codeInputRef}
            />
            <Button
              text="인증번호 확인"
              onClick={verifyCode}
              disabled={isVerifyCode}
            />
          </div>
        )}
        {errors.code && (
          <p className="text-red-500 text-center mb-4">{errors.code}</p>
        )}
        {isVerifyCode && (
          <>
            <InputText
              type="password"
              placeholder="새로운 비밀번호"
              label="새로운 비밀번호"
              name="newPassword"
              onChange={handleChange}
              value={formData.newPassword || ''}
              isValidation={!touched.newPassword || formData.newPassword != ''}
            />
            <InputText
              type="password"
              placeholder="새로운 비밀번호 확인"
              label="새로운 비밀번호 확인"
              name="newPasswordCheck"
              onChange={handleChange}
              value={formData.newPasswordCheck || ''}
              isValidation={
                !touched.newPasswordCheck || formData.newPasswordCheck != ''
              }
            />
          </>
        )}
        {errors.passwordCheck && (
          <p className="text-red-500 text-center mb-4">
            {errors.passwordCheck}
          </p>
        )}
        {errors.global && (
          <p className="text-red-500 text-center mb-4">{errors.global}</p>
        )}
        {isVerifyCode && (
          <Button
            text={
              isLoading ? (
                <span className="loading loading-dots loading-xs"></span>
              ) : (
                '비밀번호 새로 변경'
              )
            }
            size={'w-full mt-5'}
            onClick={findPassword}
            type={'submit'}
          />
        )}
      </form>

      <div className="mt-8 flex flex-col sm:flex-row gap-5 text-center">
        <Link to={LOGIN}>로그인</Link>
        <div className="hidden sm:block">|</div>
        <Link to={FIND_ID}>아이디 찾기</Link>
      </div>
    </div>
  );
};
