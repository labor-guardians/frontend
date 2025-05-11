import React, { useState } from 'react';
import { InputText } from '../components/InputText';
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { LOGIN, SIGN_UP } from '../constants/path';
import { apiClient } from '../services/apiClient';
import axios from 'axios';
import { baseURL } from '../constants/baseURL';

export const SignUpLabor = () => {
  const [formData, setFormData] = useState({
    userid: '',
    email: '',
    username: '',
    license: '',
    description: '',
    emailCode: '',
    password: '',
    passwordCheck: '',
  });
  const [selectedImg, setSelectedImg] = useState(null);
  const [isUsedId, setIsUsedId] = useState(true);
  const [checkPwd, setCheckPwd] = useState();
  const [validPwd, setValidPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailCodeSendSuc, setEmailCodeSendSuc] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const navigate = useNavigate();

  const handleChange = (label, value) => {
    if (label === 'password') {
      setFormData((prev) => ({ ...prev, password: value }));
      setValidPwd(value === formData.passwordCheck);
    } else if (label === 'passwordCheck') {
      setFormData((prev) => ({ ...prev, passwordCheck: value }));
      setValidPwd(value === formData.password);
    } else {
      setFormData((prev) => ({ ...prev, [label]: value }));
    }
    if (label === 'userid') setIsUsedId(true);
    if (label === 'email') {
      setValidEmail(false);
      setEmailCodeSendSuc(false);
    }
    setErrors((prev) => ({ ...prev, [label]: '', global: '' }));
  };

  const handleCheckDupId = async () => {
    if (!formData.userid)
      return setErrors((prev) => ({
        ...prev,
        userid: '아이디를 입력해주세요.',
      }));
    try {
      const res = await apiClient.get('/api/auth/checkIdDuplicate', {
        params: { userid: formData.userid },
      });
      if (!res.data) setIsUsedId(false);
      else
        setErrors((prev) => ({
          ...prev,
          userid: '이미 존재하는 아이디입니다.',
        }));
    } catch (err) {
      console.log(err);
    }
  };

  const emailDupCheck = async () => {
    if (!formData.email)
      return setErrors((prev) => ({
        ...prev,
        email: '이메일을 입력해주세요.',
      }));
    try {
      const res = await apiClient.get('/api/auth/checkEmailDuplicate', {
        params: { email: formData.email },
      });
      if (!res.data) {
        setEmailCodeSendSuc(true);
        await apiClient.post('/api/auth/sendEmailVerification', {
          email: formData.email,
        });
      } else
        setErrors((prev) => ({
          ...prev,
          email: '이미 존재하는 이메일입니다.',
        }));
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

  const imageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, license: file }));
      setSelectedImg(file.name);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.userid ||
      !formData.email ||
      !formData.password ||
      !formData.passwordCheck ||
      !formData.license ||
      !formData.description
    ) {
      return setErrors((prev) => ({
        ...prev,
        global: '모든 항목을 입력해주세요.',
      }));
    }
    if (isUsedId)
      return setErrors((prev) => ({
        ...prev,
        userid: '아이디 중복검사가 필요합니다.',
      }));
    if (!validPwd)
      return setErrors((prev) => ({
        ...prev,
        passwordCheck: '비밀번호를 다시 확인해주세요.',
      }));
    if (!validEmail)
      return setErrors((prev) => ({
        ...prev,
        email: '이메일 인증이 필요합니다.',
      }));

    const fd = new FormData();
    const consultantJson = {
      userid: formData.userid,
      password: formData.password,
      username: formData.username,
      email: formData.email,
      description: formData.description,
    };

    console.log('💬 JSON.stringify 전송 내용:', consultantJson);

    fd.append(
      'ConsultantData',
      new Blob([JSON.stringify(consultantJson)], {
        type: 'application/json',
      }),
    );
    fd.append('license', formData.license);

    // 👇 실제 FormData 내부 확인
    for (let [key, value] of fd.entries()) {
      console.log(`📦 FormData - ${key}:`, value);
    }
    try {
      const res = await apiClient.post(`/api/auth/join/consultant`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.status === 200) {
        alert('회원가입 완료');
        navigate(LOGIN);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <div className="flex flex-col w-full max-w-md">
        <p className="font-bold text-2xl text-center">노무사 회원가입</p>
        <div className="mt-10">
          {[
            'userid',
            'password',
            'passwordCheck',
            'email',
            ...(emailCodeSendSuc ? ['emailCode'] : []),
            'username',
            'license',
            'description',
          ].map((field) => (
            <div key={field} className="flex flex-col mb-4">
              <label className="font-semibold mb-1">
                {field === 'userid'
                  ? '아이디'
                  : field === 'password'
                    ? '비밀번호'
                    : field === 'passwordCheck'
                      ? '비밀번호 확인'
                      : field === 'email'
                        ? '이메일'
                        : field === 'emailCode'
                          ? '인증코드'
                          : field === 'license'
                            ? '자격증'
                            : '이름'}
              </label>
              <div className="flex gap-2">
                {field === 'license' ? (
                  <>
                    <Button
                      text="파일선택"
                      onClick={() =>
                        document.getElementById('fileInput').click()
                      }
                      size="w-24"
                    />
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={imageUpload}
                      className="hidden"
                    />
                    <InputText
                      value={selectedImg || ''}
                      readOnly
                      className="flex-grow"
                    />
                  </>
                ) : field === 'description' ? (
                  <textarea
                    className="textarea bg-white border border-gray-300 p-2 rounded-md w-full"
                    placeholder="소개글을 작성해주세요."
                    value={formData.description}
                    onChange={(e) =>
                      handleChange('description', e.target.value)
                    }
                  />
                ) : (
                  <InputText
                    type={field.includes('password') ? 'password' : 'text'}
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
                    value={formData[field] || ''}
                    className="flex-grow"
                  />
                )}
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
                    onClick={emailDupCheck}
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
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
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
            <Link to={SIGN_UP}>일반 회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
