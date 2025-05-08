import React, { useState } from "react";
import { InputText } from "../components/InputText";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN, SIGN_UP, SIGN_UP_LABOR } from "../constants/path";
import { apiClient } from "../services/apiClient";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    userid: "",
    email: "",
    emailCode: "",
    username: "",
  });

  const [isUsedId, setIsUserId] = useState(true);
  const [password, setPassword] = useState("");
  const [checkPwd, setCheckPwd] = useState();
  const [validPwd, setValidPwd] = useState(false);
  const [errors, setErrors] = useState({
    userid: "",
    password: "",
    passwordCheck: "",
    email: "",
    emailCode: "",
    username: "",
    global: "",
  });
  const [isEmailDup, setIsEmailDup] = useState(true);
  const [emailCodeSendSuc, setEmailCodeSendSuc] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const navigate=useNavigate()
  const handleChange = (label, value) => {
    if (label == "password") {
      setPassword(value);
      setValidPwd(validPwd == checkPwd);
    } else if (label === "passwordCheck") {
      setCheckPwd(value);
      setValidPwd(value === password);
    } else {
      setFormData((prev) => ({ ...prev, [label]: value }));
    }
    if (label === "userid") {
      setIsUserId(true);
    }
    if(label==="email"){
      setIsEmailDup(false);
      setEmailCodeSendSuc(false);
      setValidEmail(false);
    }
    setErrors((prev) => ({ ...prev, [label]: "", global: "" }));
  };

  //ID 중복 검사
  const handleCheckDupId = async () => {
    if (!formData.userid) {
      setErrors((prev) => ({ ...prev, userid: "아이디를 입력해주세요." }));
      return;
    }
    try {
      const res = await apiClient.get("/api/auth/checkIdDuplicate", {
        params: {
          userid: formData.userid,
        },
      });
      if (res.status === 200) {
        console.log(res.data);
        if (!res.data) {
          setIsUserId(false);
        } else {
          setIsUserId(true);
          setErrors((prev) => ({
            ...prev,
            userid: "이미 존재하는 아이디입니다.",
          }));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //비밀번호 확인
  const pwdCheck = () => {
    if (password === checkPwd) {
      setValidPwd(true);
    } else {
      setCheckPwd(false);
    }
  };

  //이메일 중복 확인
  const emailDupCheck = async () => {
    if (formData.email === "") {
      setErrors((prev) => ({ ...prev, email: "이메일을 입력해주세요." }));

      return;
    }
    try {
      const res = await apiClient.get("/api/auth/checkEmailDuplicate", {
        params: {
          email: formData.email,
        },
      });
      if (res.status === 200) {
        console.log(res.data);
        if (!res.data) {
          setIsEmailDup(false);
          emailCodeIssue();
        } else {
          setIsEmailDup(true);
          setErrors((prev) => ({
            ...prev,
            email: "이미 존재하는 이메일입니다.",
          }));
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  //이메일 인증번호 발급
  const emailCodeIssue = async () => {
    try {
      const res = await apiClient.post("api/auth/sendEmailVerification", {
        email: formData.email,
      });
      if (res.status === 200) {
        console.log(res.data);
        setEmailCodeSendSuc(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //이메일 인증
  const emailVerify = async () => {
    const data = {
      email: formData.email,
      code: formData.emailCode,
    };
    try {
      const res = await apiClient.post("/api/auth/verifyEmail", data);
      if (res.status === 200) {
        console.log(res.data);
        setValidEmail(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEmailAuth = async () => {
    if (validEmail) return;
    if (!emailCodeSendSuc) {
      await emailDupCheck();
    } else {
      await emailVerify();
    }
  };
  const handleSubmit = async () => {
    pwdCheck();
    try {
      // 유효성 검사
      if (!formData.userid || !formData.email || !password || !checkPwd) {
        setErrors((prev) => ({ ...prev, global: "모든 항목을 입력해주세요." }));
        return;
      }
      if (isUsedId) {
        setErrors((prev) => ({
          ...prev,
          userid: "아이디 중복검사가 필요합니다.",
        }));
        return;
      }
      if (!validPwd) {
        setErrors((prev) => ({
          ...prev,
          passwordCheck: "비밀번호를 다시 확인해주세요.",
        }));
        return;
      }
      if (!validEmail) {
        setErrors((prev) => ({ ...prev, email: "이메일 인증이 필요합니다." }));
        return;
      }

      const data = {
        userid: formData.userid,
        password: password,
        username: formData.username,
        email: formData.email,
      };
      const res = await apiClient.post("/api/auth/join/user", data);

      if (res.status === 200) {
        alert("회원가입 완료");
        navigate(LOGIN)
      }
    } catch (err) {
      console.log(e);
    }
  };
  return (
    <>
      <div className={"flex justify-center items-center"}>
        <div className=" flex flex-col w-[25vw]">
          <p className={"font-bold text-2xl text-center"}>회원가입</p>

          <div className={"mt-10"}>
            {[
              "userid",
              "password",
              "passwordCheck",
              "email",
              ...(emailCodeSendSuc ? ["emailCode"] : []),
              "username",
            ].map((field, i) => (
              <div key={field} className="flex flex-col mb-[2vh]">
                <div className="flex flex-row">
                  <InputText
                    type={
                      field === "password" || field === "passwordCheck"
                        ? "password"
                        : "text"
                    }
                    placeholder={
                      field === "userid"
                        ? "아이디"
                        : field === "username"
                        ? "이름"
                        : field === "password"
                        ? "비밀번호"
                        : field === "passwordCheck"
                        ? "비밀번호 확인"
                        : field === "email"
                        ? "이메일"
                        : field == "emailCode"
                        ? "인증코드"
                        : field
                    }
                    label={
                      field === "userid"
                        ? "아이디"
                        : field === "username"
                        ? "이름"
                        : field === "password"
                        ? "비밀번호"
                        : field === "passwordCheck"
                        ? "비밀번호 확인"
                        : field === "email"
                        ? "이메일"
                        : field === "emailCode"
                        ? "인증코드"
                        : field
                    }
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                  {field === "userid" ? (
                    <Button
                      text={!isUsedId ? "중복확인완료" : "중복확인"}
                      size="w-[10vw]"
                      onClick={handleCheckDupId}
                    />
                  ) : field === "email" ? (
                    <Button
                      text={
                        validEmail
                          ? "인증완료"
                          : emailCodeSendSuc
                          ? "인증요청"
                          : "인증"
                      }
                      size="w-[10vw]"
                      onClick={handleEmailAuth}
                    />
                  ) : null}
                </div>
                {errors[field] && (
                  <div role="alert" className="alert alert-error alert-soft">
                    <span>{errors[field]}</span>
                  </div>
                )}
              </div>
            ))}

            {errors.global && (
              <div role="alert" className="alert alert-error alert-soft">
                <span>{errors.global}</span>
              </div>
            )}
            <div className="mt-10">
              <Button text="회원가입" size="w-[25vw]" onClick={handleSubmit} />
            </div>

            <div className="justify-center mt-8 flex flex-col sm:flex-row gap-5 text-center">
              <Link to={LOGIN}>로그인</Link>
              <div className="hidden sm:block">|</div>
              <Link to={SIGN_UP_LABOR}>노무사 회원가입</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
