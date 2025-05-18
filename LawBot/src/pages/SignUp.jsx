import React, { useState } from 'react';
import { InputText } from '../components/InputText';
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { LOGIN, SIGN_UP_LABOR } from '../constants/path';
import { apiClient } from '../services/apiClient';
import { Alert } from '../components/Alert';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const SignUp = () => {
  const [formData, setFormData] = useState({
    userid: '',
    email: '',
    emailCode: '',
    username: '',
  });
  const [isUsedId, setIsUserId] = useState(true);
  const [password, setPassword] = useState('');
  const [checkPwd, setCheckPwd] = useState();
  const [validPwd, setValidPwd] = useState(false);
  const MySwal = withReactContent(Swal);
  const [errors, setErrors] = useState({
    userid: '',
    password: '',
    passwordCheck: '',
    email: '',
    emailCode: '',
    username: '',
    global: '',
  });
  const [isEmailDup, setIsEmailDup] = useState(true);
  const [emailCodeSendSuc, setEmailCodeSendSuc] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const navigate = useNavigate();
  const [alertInfo, setAlertInfo] = useState(null);

  const handleChange = (label, value) => {
    if (label === 'password') {
      setPassword(value);
      setValidPwd(value === checkPwd);
    } else if (label === 'passwordCheck') {
      setCheckPwd(value);
      setValidPwd(value === password);
    } else {
      setFormData((prev) => ({ ...prev, [label]: value }));
    }
    if (label === 'userid') setIsUserId(true);
    if (label === 'email') {
      setIsEmailDup(false);
      setEmailCodeSendSuc(false);
      setValidEmail(false);
    }
    setErrors((prev) => ({ ...prev, [label]: '', global: '' }));
  };

  const handleCheckDupId = async () => {
    if (!formData.userid) {
      setErrors((prev) => ({ ...prev, userid: '아이디를 입력해주세요.' }));
      return;
    }
    try {
      const res = await apiClient.get('/api/auth/checkIdDuplicate', {
        params: { userid: formData.userid },
      });
      if (res.status === 200) {
        if (!res.data) {
          setIsUserId(false);
          setErrors((prev) => ({
            ...prev,
            userid: '사용 가능한 아이디입니다.',
          }));
        } else {
          setIsUserId(true);
          setErrors((prev) => ({
            ...prev,
            userid: '이미 존재하는 아이디입니다.',
          }));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const pwdCheck = () => {
    setValidPwd(password === checkPwd);
  };

  const emailDupCheck = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: '이메일을 입력해주세요.' }));
      return;
    }
    try {
      const res = await apiClient.get('/api/auth/checkEmailDuplicate', {
        params: { email: formData.email },
      });
      if (res.status === 200) {
        if (!res.data) {
          setIsEmailDup(false);
          emailCodeIssue();
        } else {
          setIsEmailDup(true);
          setErrors((prev) => ({
            ...prev,
            email: '이미 존재하는 이메일입니다.',
          }));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const emailCodeIssue = async () => {
    try {
      const res = await apiClient.post('api/auth/sendEmailVerification', {
        email: formData.email,
      });
      if (res.status === 200) setEmailCodeSendSuc(true);
    } catch (err) {
      console.log(err);
    }
  };

  const emailVerify = async () => {
    try {
      const res = await apiClient.post('/api/auth/verifyEmail', {
        email: formData.email,
        code: formData.emailCode,
      });
      if (res.status === 200) setValidEmail(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEmailAuth = async () => {
    if (validEmail) return;
    if (!emailCodeSendSuc) await emailDupCheck();
  };

  const handleSubmit = async () => {
    pwdCheck();
    if (!formData.userid || !formData.email || !password || !checkPwd) {
      setErrors((prev) => ({ ...prev, global: '모든 항목을 입력해주세요.' }));
      return;
    }
    if (isUsedId) {
      setErrors((prev) => ({
        ...prev,
        userid: '아이디 중복검사가 필요합니다.',
      }));
      return;
    }
    if (!validPwd) {
      setErrors((prev) => ({
        ...prev,
        passwordCheck: '비밀번호를 다시 확인해주세요.',
      }));
      return;
    }
    if (!validEmail) {
      setErrors((prev) => ({ ...prev, email: '이메일 인증이 필요합니다.' }));
      return;
    }

    try {
      const res = await apiClient.post('/api/auth/join/user', {
        userid: formData.userid,
        password,
        username: formData.username,
        email: formData.email,
      });
      if (res.status === 200) {
        // alert('회원가입 완료');
        await MySwal.fire({
          title: '회원가입이 완료되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
        });
        navigate(LOGIN);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <div className="flex flex-col w-full max-w-sm">
        <p className="font-bold text-2xl text-center">회원가입</p>
        <div className="mt-10">
          {[
            'userid',
            'password',
            'passwordCheck',
            'email',
            ...(emailCodeSendSuc ? ['emailCode'] : []),
            'username',
          ].map((field) => (
            <div key={field} className="flex flex-col mb-4">
              <div className="flex gap-2">
                <InputText
                  type={field.includes('password') ? 'password' : 'text'}
                  label={
                    field === 'userid'
                      ? '아이디'
                      : field === 'password'
                        ? '비밀번호'
                        : field === 'passwordCheck'
                          ? '비밀번호 확인'
                          : field === 'email'
                            ? '이메일'
                            : field === 'emailCode'
                              ? '인증코드'
                              : '이름'
                  }
                  placeholder={
                    field === 'userid'
                      ? '아이디'
                      : field === 'username'
                        ? '이름'
                        : field === 'password'
                          ? '비밀번호'
                          : field === 'passwordCheck'
                            ? '비밀번호 확인'
                            : field === 'email'
                              ? '이메일'
                              : field === 'emailCode'
                                ? '인증코드'
                                : ''
                  }
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="flex-grow"
                />
                {field === 'userid' && (
                  <Button
                    text={!isUsedId ? '완료' : '중복확인'}
                    onClick={handleCheckDupId}
                    size="w-24"
                  />
                )}
                {field === 'email' && !emailCodeSendSuc && (
                  <Button
                    text="인증"
                    onClick={handleEmailAuth}
                    size="w-24"
                    disabled={validEmail}
                  />
                )}
                {field === 'emailCode' && (
                  <Button
                    text={validEmail ? '인증완료' : '확인'}
                    onClick={emailVerify}
                    size="w-24"
                    disabled={validEmail}
                  />
                )}
              </div>
              {errors[field] && (
                <p
                  className={`${field === 'userid' && !isUsedId ? 'text-green-500' : field === 'emailCode' && validEmail ? 'text-green-500' : 'text-red-500'} text-sm mt-1`}
                >
                  {errors[field]}
                </p>
              )}
            </div>
          ))}

          {errors.global && (
            <p className="text-red-500 text-center mb-4">{errors.global}</p>
          )}

          <div className="mt-10">
            <Button text="회원가입" size="w-full" onClick={handleSubmit} />
          </div>

          <div className="justify-center mt-8 flex flex-col sm:flex-row gap-5 text-center">
            <Link to={LOGIN}>로그인</Link>
            <div className="hidden sm:block">|</div>
            <Link to={SIGN_UP_LABOR}>노무사 회원가입</Link>
          </div>
        </div>
      </div>
      {alertInfo && (
        <Alert
          title={alertInfo.title}
          text={alertInfo.text}
          result={alertInfo.result}
        />
      )}
    </div>
  );
};
