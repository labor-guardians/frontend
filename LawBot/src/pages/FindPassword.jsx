import React, { useRef, useState } from "react";
import { FIND_ID, LOGIN } from "../constants/path";
import { Button } from "../components/Button";
import { InputText } from "../components/InputText";
import { Link } from "react-router-dom";

export const FindPassword = () => {
    const [formData, setFormData] = useState({
        name: null,
        email: null,
    });

    const [isInputError, setInputError] = useState(false);
    const [isSendEmail, setSendEmail] = useState(false);
    const nameInputRef = useRef(null);
    const emailInputRef = useRef(null);

    const findPassword = (e) => {
        e.preventDefault();
        if (!formData.name) {
            nameInputRef.current.focus();
            return;
        } else if (!formData.email) {
            emailInputRef.current.focus();
            return;
        }

        // api 성공시
        setSendEmail(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="max-w-md m-auto flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-10">비밀번호 찾기</h2>
            <form className="w-full flex flex-col items-center gap-4">
                <InputText
                    placeholder={"이름"}
                    label={"이름"}
                    onChange={handleChange}
                    name="name"
                    value={formData.name || ""}
                    isValidation={formData.name != ""}
                    validationText={"이름을 입력해주세요"}
                    ref={nameInputRef}
                />
                <InputText
                    type="email"
                    placeholder={"이메일"}
                    label={"이메일"}
                    value={formData.email || ""}
                    onChange={handleChange}
                    name="email"
                    isValidation={formData.email != ""}
                    validationText={"이메일을 입력해주세요"}
                    ref={emailInputRef}
                />
                {isInputError && <p className="text-red-500 text-sm">가입된 정보가 없습니다.</p>}
                <div className="mt-5">이메일로 새 비밀번호를 발송하였습니다.</div>
                <Button
                    text={"비밀번호 찾기"}
                    size={"w-full mt-5"}
                    onClick={findPassword}
                    type={"submit"}
                />
            </form>

            <div className="mt-8 flex flex-col sm:flex-row gap-5 text-center">
                <Link to={LOGIN}>로그인</Link>
                <div className="hidden sm:block">|</div>
                <Link to={FIND_ID}>아이디 찾기</Link>
            </div>
        </div>
    );
};
