import React, { useRef, useState } from 'react';
import { InputText } from '../components/InputText';
import { Button } from '../components/Button';
import { data, Link } from 'react-router-dom';
import { FIND_ID, SIGN_UP } from '../constants/path';
import { apiClient } from '../services/apiClient';

export const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });
  const [isLoginError, setIsLoginError] = useState(false);

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const login = (e) => {
    e.preventDefault();
    if (!formData.username) {
      usernameInputRef.current.focus();
      return;
    } else if (!formData.password) {
      passwordInputRef.current.focus();
      return;
    }

    apiClient.post('/login', formData).then((res) => {
      localStorage.setItem('access', res.headers['access']);
      localStorage.setItem('id', formData.username);

      window.location.replace('/');
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
    <div className="max-w-xs m-auto flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-10">로그인</h2>
      <form className="w-full flex flex-col items-center gap-4">
        <InputText
          placeholder={'아이디를 입력하세요.'}
          label={'아이디'}
          onChange={handleChange}
          name="username"
          onBlur={handleBlur}
          isValidation={!touched.username || formData.username != ''}
          validationText={'아이디를 입력해주세요.'}
          ref={usernameInputRef}
        />
        <InputText
          type="password"
          placeholder={'비밀번호를 입력하세요.'}
          label={'비빌번호'}
          value={formData.password}
          onChange={handleChange}
          name="password"
          onBlur={handleBlur}
          isValidation={!touched.password || formData.password != ''}
          validationText={'비밀번호를 입력해주세요.'}
          ref={passwordInputRef}
        />
        {isLoginError && (
          <p className="text-red-500 text-sm">
            아이디 또는 비밀번호가 잘못되었습니다.
          </p>
        )}
        <Button
          text={'로그인'}
          size={'w-full mt-5'}
          onClick={login}
          type={'submit'}
        />
      </form>

      <div className="mt-8 flex flex-col sm:flex-row gap-5 text-center">
        <Link to={SIGN_UP}>회원가입</Link>
        <div className="hidden sm:block">|</div>
        <Link to={FIND_ID}>아이디 찾기</Link>
      </div>
    </div>
  );
};
