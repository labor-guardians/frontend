import React, { useState } from "react";
import { InputText } from "../components/InputText";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { LOGIN, SIGN_UP, SIGN_UP_LABOR } from "../constants/path";
import { apiClient } from "../services/apiClient";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    name: "",
  });

  const [isUsedId, setIsUserId] = useState();
  const [password, setPassword] = useState("");
  const [checkPwd, setCheckPwd] = useState();
  const [validPwd, setValidPwd] = useState(false);
  const [errMsg, setErrMsg] = useState();
  const [isEmailDup, setIsEmailDup] = useState(false);
  const [emailCode, setEmailCode] = useState();
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
  };

  //ID 중복 검사
  const handleCheckDupId = async () => {
    if (!formData.id) {
      setErrMsg("아이디를 입력해주세요.");
    }
    try {
      const res = await apiClient.get("/api/auth/checkIdDuplicate", {
        params: {
          userid: formData.id,
        },
      });
      if (res.status === 200) {
        console.log(res.data);
        setIsUserId(true);
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
    try {
      const res = await apiClient.get("/api/auth/checkEmailDuplicate", {
        params: {
          email: formData.email,
        },
      });
      if (res.status === 200) {
        setIsEmailDup(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //이메일 인증번호 발급
  const emailCodeIssue = async () => {
    if (password === "") {
      setErrMsg("이메일을 입력해주세요.");
      return;
    }
    if (!isEmailDup) {
      setErrMsg("이미 가입된 이메일입니다.");
    }
    try {
      const res = await apiClient.post("api/auth/sendEmailVerification", {
        email: formData.email,
      });
      if (res.status === 200) {
        setEmailCode(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //이메일 인증
  const emailVerify = async () => {
    try {
      const res = await apiClient.post("/api/auth/verifyEmail");
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async () => {
    pwdCheck();
    try {
      //유효성 검사
      if (!formData.id || !formData.email || !formData.password || !checkPwd) {
        setErrMsg("모든 항목을 입력해주세요.");
        return;
      }
      if (!isUsedId) {
        setErrMsg("아이디 중복검사가 필요합니다.");
        return;
      }
      if (!validPwd) {
        setErrMsg("비밀번호를 다시 확인해주세요.");
        return;
      }

      const payload = {
        ...formData,
        password,
      };
      const res = await apiClient.post("/api/auth/join/user", payload);

      if (res.status === 201) {
        alert("회원가입 완료");
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
            {["id", "password", "passwordCheck", "email", "name"].map(
              (field, i) => (
                <div key={field} className="flex flex-col mb-[2vh]">
                  <div className="flex flex-row">
                    <InputText
                      type={
                        field === "password" || field === "passwordCheck"
                          ? "password"
                          : "text"
                      }
                      placeholder={
                        field === "id"
                          ? "아이디"
                          : field === "name"
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
                        field === "id"
                          ? "아이디"
                          : field === "name"
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
                    {field === "id" ? (
                      <Button
                        text={isUsedId ? "중복확인완료" : "중복확인"}
                        size="w-[10vw] text-[1vw]"
                        onClick={handleCheckDupId}
                      />
                    ) : field === "email" ? (
                      <Button
                        text={isUsedId ? "인증완료" : "인증"}
                        size="w-[10vw] text-[1vw]"
                        onClick={handleCheckDupId}
                      />
                    ) : null}
                  </div>
                </div>
              )
            )}
            {isUsedId ? <p className={"text-red-500"}>{errMsg}</p> : ""}
            {validPwd ? "" : <p className={"text-red-500"}>{errMsg}</p>}
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
