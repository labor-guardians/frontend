import React, { useState } from "react";
import { Button } from "../components/Button";
import { BsPersonCircle } from "react-icons/bs";
import { InputText } from "../components/InputText";

export const MyPage = () => {
  const [formData, setFormData] = useState({
    image: String,
  });
  const [imageUrl, setImageUrl] = useState();
  const [selectedImg, setSelectedImg] = useState();
  const [emailClick, setEmailClick] = useState(false);
  const [pwsClick, setPwdClick] = useState(false);

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

  const changeBtnClickListener = (target) => {
    if (target == "email") {
      setEmailClick(true);
    } else if (target == "pwd") {
      setPwdClick(true);
    }
  };
  return (
    <>
      <div className="flex justify-center flex-col items-center">
        {!selectedImg ? (
          <div className="flex justify-center">
            <BsPersonCircle
              size="15vw"
              color="#A5A5A5"
              onClick={() => document.getElementById("fileInput").click()}
            />
          </div>
        ) : (
          <img
            src={selectedImg}
            className="self-center ml-4 w-[15vw] object-cover border border-gray-300 rounded-full "
          />
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={imageUpload}
          className="hidden"
        />

        <div className="flex justify-center mt-10 font-bold text-[1.3vw]">
          최지원
        </div>

        <div className="mt-[5vw]">
          <textarea
            className="textarea bg-white border border-gray-300 p-2 rounded-md w-[30vw]"
            placeholder="소개글을 작성해주세요."
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
          />
        </div>

        <div className="mt-[3vw] w-[30vw] justify-center">
          <div className="flex flex-row justify-between text-[1.2vw]">
            <div className="font-bold">이메일</div>
            <div>zziwonchoi@gmail.com</div>
            <div onClick={() => changeBtnClickListener("email")}>
              이메일 변경
            </div>
          </div>
          {emailClick ? (
            <div className="mt-[2vw] flex flex-col justify-center gap-[2vh]">
              <div className="flex flex-row">
                <InputText placeholder="이메일" />
                <Button text="인증번호 발송" />
              </div>
              <InputText placeholder="인증번호" />
              <Button text="이메일 변경" />
            </div>
          ) : (
            ""
          )}
          <div className="flex flex-row justify-between text-[1.2vw] mt-[3vh]">
            <div className="font-bold">비밀번호</div>
            <div> </div>
            <div onClick={() => changeBtnClickListener("pwd")}>
              비밀번호 변경
            </div>
          </div>
          {pwsClick ? (
            <div className="mt-[2vw] flex flex-col justify-center gap-[2vh]">
              <InputText placeholder="현재 비밀번호" />
              <InputText placeholder="새로운 비밀번호" />
              <InputText placeholder="새로운 비밀번호 확인" />
              <Button text="비밀번호 변경" />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
