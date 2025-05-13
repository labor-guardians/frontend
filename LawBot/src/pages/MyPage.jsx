import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { BsPersonCircle } from 'react-icons/bs';
import { InputText } from '../components/InputText';
import useUserData from '../constants/hooks/useUserData';
import { apiClient } from '../services/apiClient';

export const MyPage = () => {
  const { userId, access, role } = useUserData();
  const [userData, setUserData] = useState({
    userId: '',
    userName: '',
    email: '',
    photo: '',
    role: '',
    description: '',
    license: '',
  });
  const [errors, setErrors] = useState({
    pwd: '',
    email: '',
    emailCode: '',
    global: '',
  });
  useEffect(() => {
    if ((userId, role)) {
      getUserData(userId, role);
    }
  }, [userId, role]);
  const [imageUrl, setImageUrl] = useState();
  const [selectedImg, setSelectedImg] = useState();
  const [emailClick, setEmailClick] = useState(false);
  const [pwsClick, setPwdClick] = useState(false);
  const [prevImg, setPrevImg] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newEmailCode, setNewEmailCode] = useState('');
  const [emailCodeSendSuc, setEmailCodeSendSuc] = useState(false);
  const [changeFlag, setChangeFlag] = useState(false);
  const [pwd, setPwd] = useState({
    curPwd: '',
    newPwd: '',
    newPwdCheck: '',
  });
  //이미지 파일 업로드드
  const imageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImg(imageUrl);
      imageChange(file);
    }
  };

  const changeBtnClickListener = (target) => {
    if (target == 'email') {
      setEmailClick(true);
    } else if (target == 'pwd') {
      setPwdClick(true);
    }
  };

  const getUserData = async (id, r) => {
    try {
      const path = r === 'User' ? 'user' : 'user/consultant';
      const res = await apiClient.get(`/api/${path}/${id}`);
      if (res.status === 200) {
        setUserData(res.data);
        console.log(res.data);
        console.log(res.data.photo);
        if (res.data.photo != null) {
          getImage(res.data.photo);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getImage = async (url) => {
    try {
      const res = await apiClient.get(`${url}`, {
        responseType: 'blob',
      });
      if (res.status === 200) {
        const imageUrl = URL.createObjectURL(res.data);
        setSelectedImg(imageUrl);
        setPrevImg(imageUrl);
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //이메일 변경
  const emailChage = async () => {
    if (!newEmailCode) {
      setErrors((prev) => ({
        ...prev,
        emailCode: '인증 코드를 입력해주세요.',
      }));
      return;
    }
    try {
      const data = {
        email: newEmail,
        code: newEmailCode,
      };
      const res = await apiClient.put('/api/user/email', data);
      if (res.status === 200) {
        alert('이메일이 변경되었습니다.');
        setEmailClick(false);
        setNewEmail('');
        setNewEmailCode('');
        setEmailCodeSendSuc(false);
        setUserData((prev) => ({
          ...prev,
          email: newEmail,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };
  const emailDupCheck = async () => {
    if (!newEmail) {
      setErrors((prev) => ({ ...prev, email: '이메일을 입력해주세요.' }));
      return;
    }
    try {
      const res = await apiClient.get('/api/auth/checkEmailDuplicate', {
        params: { email: newEmail },
      });
      if (res.status === 200) {
        if (!res.data) {
          emailCodeIssue();
        } else {
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
        email: newEmail,
      });
      if (res.status === 200) setEmailCodeSendSuc(true);
    } catch (err) {
      console.log(err);
    }
  };

  //비밀번호 변경
  const pwdChange = async () => {
    if (pwd.newPwd !== pwd.newPwdCheck) {
      setErrors((prev) => ({ ...prev, pwd: '비밀번호를 다시 확인해주세요' }));
      return;
    }
    if (!pwd.curPwd || !pwd.newPwd || !pwd.newPwdCheck) {
      setErrors((prev) => ({ ...prev, pwd: '모든 항목을 입력해주세요.' }));
      return;
    }
    try {
      const data = {
        currentPassword: pwd.curPwd,
        newPassword: pwd.newPwd,
      };
      const res = await apiClient.put('/api/user/password', data);
      if (res.status === 200) {
        alert('비밀번호가 변경되었습니다.');
        setPwdClick(false);
        setPwd({
          curPwd: '',
          newPwd: '',
          newPwdCheck: '',
        });
      }
    } catch (err) {
      console.log(err);
      setErrors((prev) => ({ ...prev, pwd: '비밀번호를 다시 확인해주세요' }));
    }
  };

  //소개글 수정
  const descriptionChange = async () => {
    const data = {
      description: userData.description,
    };
    try {
      const res = await apiClient.put('/api/user/description', null, {
        params: {
          description: userData.description,
        },
      });
      if (res.status === 200) {
        alert('소개글이 수정되었습니다.');
        setUserData((prev) => ({ ...prev, data }));
        setChangeFlag(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //이미지 변경
  const imageChange = async (img) => {
    const fd = new FormData();
    fd.append('image', img);
    try {
      const res = await apiClient.post('/api/user/profile-image', fd, {
        params: {
          userId: userId,
        },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.status === 200) {
        alert('프로필 사진이 변경되었습니다.');
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
      if (prevImg) {
        alert('업로드 파일 크기가 제한을 초과했습니다.');
        setSelectedImg(prevImg);
      }
    }
  };
  return (
    <>
      <div className="flex flex-col items-center px-4 md:px-1 mt-80">
        {!selectedImg ? (
          <div className="flex justify-center">
            <BsPersonCircle
              size="120"
              className="w-24 h-24 md:w-40 md:h-40"
              color="#e7dfcc"
              onClick={() => document.getElementById('fileInput').click()}
            />
          </div>
        ) : (
          <img
            onClick={() => document.getElementById('fileInput').click()}
            src={selectedImg}
            className={`w-24 h-24 md:w-45 md:h-45 object-cover border border-gray-300 rounded-full hover:border-gray-500`}
          />
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={imageUpload}
          className="hidden"
        />

        <div className="mt-6 font-bold text-lg md:text-xl">
          {userData.userName}
        </div>

        {role !== 'User' && (
          <div className="mt-6 w-full max-w-[480px]">
            <textarea
              className="w-full textarea bg-white border border-gray-300 p-2 rounded-md"
              placeholder="소개글을 작성해주세요."
              value={userData.description}
              onChange={(e) => {
                setUserData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
                setChangeFlag(true);
              }}
            />
            {changeFlag && (
              <div
                className="flex justify-end text-sm md:text-base mt-2 cursor-pointer"
                onClick={descriptionChange}
              >
                저장
              </div>
            )}
          </div>
        )}

        <div className="mt-6 w-full max-w-[480px]">
          <div className="flex flex-row justify-between text-sm md:text-base">
            <div className="font-bold">이메일</div>
            <div>{userData.email}</div>
            <div
              className=" cursor-pointer"
              onClick={() => changeBtnClickListener('email')}
            >
              이메일 변경
            </div>
          </div>
          {emailClick && (
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <InputText
                  placeholder="이메일"
                  label="이메일"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                {!emailCodeSendSuc && (
                  <Button text="인증번호 발송" onClick={emailDupCheck} />
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
              {emailCodeSendSuc && (
                <div className="flex flex-col gap-2">
                  <InputText
                    placeholder="인증코드"
                    label="인증코드"
                    value={newEmailCode}
                    onChange={(e) => setNewEmailCode(e.target.value)}
                  />
                  <Button text="이메일 변경" onClick={emailChage} />
                  {errors.emailCode && (
                    <p className="text-red-500 text-sm">{errors.emailCode}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-row justify-between mt-6 text-sm md:text-base">
            <div className="font-bold">비밀번호</div>
            <div></div>
            <div
              className=" cursor-pointer"
              onClick={() => changeBtnClickListener('pwd')}
            >
              비밀번호 변경
            </div>
          </div>
          {pwsClick && (
            <div className="mt-4 flex flex-col gap-4">
              <InputText
                type="password"
                placeholder="현재 비밀번호"
                label="현재 비밀번호"
                value={pwd.curPwd}
                onChange={(e) =>
                  setPwd((prev) => ({ ...prev, curPwd: e.target.value }))
                }
              />
              <InputText
                type="password"
                placeholder="새로운 비밀번호"
                label="새로운 비밀번호"
                value={pwd.newPwd}
                onChange={(e) =>
                  setPwd((prev) => ({ ...prev, newPwd: e.target.value }))
                }
              />
              <InputText
                type="password"
                placeholder="새로운 비밀번호 확인"
                label="새로운 비밀번호 확인"
                value={pwd.newPwdCheck}
                onChange={(e) =>
                  setPwd((prev) => ({ ...prev, newPwdCheck: e.target.value }))
                }
              />
              {errors.pwd && (
                <p className="text-red-500 text-sm">{errors.pwd}</p>
              )}
              <Button text="비밀번호 변경" onClick={pwdChange} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
