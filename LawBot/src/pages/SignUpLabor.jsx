import React from "react";
import { InputText } from "../components/InputText";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";

export const SignUpLabor = () => {
  return (
    <>
      <div className={"flex flex-col justify-center items-center"}>
        <p className={"font-bold text-black text-2xl text-center"}>
          노무사 회원가입
        </p>

        <div className={"mt-10"}>
          <div>
            <p className={"text-let text-l font-bold"}>아이디</p>
            <InputText placeholder="아이디" label="아이디" />
            <p className={"text-red-500"}>아이디 중복입니다.</p>
          </div>
          <div className={"mt-5"}>
            <p className={"text-let text-l font-bold"}>비밀번호</p>
            <InputText placeholder="비밀번호" label="비밀번호" />
            <p className={"text-red-500"}>
              비밀번호를 특수문자, 영어를 포함해 8글자 이상 입력해주세요.
            </p>
          </div>
          <div className={"mt-5"}>
            <p className={"text-let text-l font-bold"}>비밀번호 확인</p>
            <InputText placeholder="비밀번호 확인" label="비밀번호 확인" />
          </div>
          <div className={"mt-5"}>
            <p className={"text-let text-l font-bold"}>이름</p>
            <InputText placeholder="이름" label="이름" />
          </div>
          <br />
          <br />
          <div className={"mt-5"}>
            <p className={"text-let text-l font-bold"}>노무사 자격증 업로드</p>
            <div className={"flex flex-row"}>
              <Button text="파일선택" />
              <InputText placeholder="파일이름" label="파일이름" />
            </div>
          </div>
          <div className={"mt-5"}>
            <p className={"text-let text-l font-bold"}>노무사 소개글</p>
            <textarea
              className="textarea bg-white border-gray-300 w-full"
              placeholder="소개글을 작성해주세요."
              label="노무사소개글"
            />
          </div>
        </div>
        <div className="mt-10">
          <Button text="회원가입" size="w-100" />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-5 text-center">
          <Link to="/login">로그인</Link>
          <div className="hidden sm:block">|</div>
          <Link to="/sign-up">일반 회원가입</Link>
        </div>
      </div>
    </>
  );
};
