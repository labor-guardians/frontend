import React, { useState } from "react";
import { InputText } from "../components/InputText";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { LOGIN, SIGN_UP, SIGN_UP_LABOR } from "../constants/path";
import { apiClient } from "../services/apiClient";

export const SignUpLabor = () => {
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    name: "",
    image: "",
    content: "",
  });

  const [isUsedId, setIsUsedId] = useState();
  const [password, setPassword] = useState("");
  const [checkPwd, setCheckPwd] = useState();
  const [validPwd, setValidPwd] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [errMsg, setErrMsg] = useState();

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
  const handleCheckDupId = () => {};

  //이미지 파일 업로르
  const imageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImg(imageUrl);
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async () => {
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
      const res = await apiClient.post("/signup/labor", payload);

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
          <p className={"font-bold text-2xl text-center"}>노무사 회원가입</p>

          <div className={"mt-10"}>
            {[
              "id",
              "password",
              "passwordCheck",
              "email",
              "name",
              "image",
              "content",
            ].map((field, i) => (
              <div key={field} className="flex flex-col mb-[2vh]">
                <p className="text-let text-l font-bold mb-[10px]">
                  {field === "id"
                    ? "아이디"
                    : field === "name"
                    ? "이름"
                    : field === "password"
                    ? "비밀번호"
                    : field === "passwordCheck"
                    ? "비밀번호 확인"
                    : field === "email"
                    ? "이메일"
                    : field === "image"
                    ? "노무사 자격증 업로드"
                    : field === "content"
                    ? "노무사 소개글"
                    : field}
                </p>
                <div className="flex flex-row">
                  {field === "image" ? (
                    <>
                      <Button
                        text="파일선택"
                        size="w-[10vw]"
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                      />
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={imageUpload}
                        className="hidden"
                      />
                      {selectedImg && (
                        <img
                          src={selectedImg}
                          className="ml-4 w-20 h-20 object-cover border border-gray-300 rounded"
                        />
                      )}
                    </>
                  ) : (
                    ""
                  )}

                  {field !== "content" && field !== "image" ? (
                    <InputText
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
                          : field === "image"
                          ? "파일이름"
                          : field
                      }
                      label={field}
                      onChange={(e) => handleChange(field, e.target.value)}
                    />
                  ) : field === "content" ? (
                    <textarea
                      className="textarea bg-white border border-gray-300 p-2 rounded-md w-full"
                      placeholder="소개글을 작성해주세요."
                      value={formData.content}
                      onChange={(e) => handleChange("content", e.target.value)}
                    />
                  ) : (
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      className=" border border-gray-300 w-full hidden"
                    />
                  )}
                  {field === "id" ? (
                    <Button
                      text="중복 확인"
                      size="w-[10vw]"
                      onClick={handleCheckDupId}
                    />
                  ) : (
                    ""
                  )}
                </div>
                {isUsedId ? <p className={"text-red-500"}>{errMsg}</p> : ""}
                {validPwd ? "" : <p className={"text-red-500"}>{errMsg}</p>}
              </div>
            ))}

            <div className="mt-10">
              <Button text="회원가입" size="w-[25vw]" />
            </div>

            <div className="justify-center mt-8 flex flex-col sm:flex-row gap-5 text-center">
              <Link to={LOGIN}>로그인</Link>
              <div className="hidden sm:block">|</div>
              <Link to={SIGN_UP}>일반 회원가입</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
