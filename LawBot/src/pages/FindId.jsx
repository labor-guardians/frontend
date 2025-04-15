import React, { useRef, useState } from "react";
import { InputText } from "../components/InputText";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { FIND_PASSWORD, LOGIN } from "../constants/path";

export const FindId = () => {
    const [formData, setFormData] = useState({
        name: null,
        email: null,
        number: null,
    });

    const [isNumberError, setNumberError] = useState(false);
    const [isSendNumber, setSendNumber] = useState(false);
    const nameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const numberInputRef = useRef(null);

    const sendNumber = () => {
        if (!formData.name) {
            nameInputRef.current.focus();
            return;
        } else if (!formData.email) {
            emailInputRef.current.focus();
            return;
        }

        // api 성공시
        setSendNumber(true);
    };

    const findId = (e) => {
        e.preventDefault();
        if (!formData.authenticationNumber) {
            numberInputRef.current.focus();
            return;
        }

        alert("TODO:로그인");
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
            <h2 className="text-2xl font-bold mb-10">아이디 찾기</h2>
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
                    readOnly={isSendNumber}
                />
                <div className="flex gap-1 w-full">
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
                        readOnly={isSendNumber}
                    />
                    <Button text="인증번호 발송" onClick={sendNumber} />
                </div>
                {isSendNumber && (
                    <InputText
                        placeholder="인증번호"
                        label="인증번호"
                        onChange={handleChange}
                        value={formData.number || ""}
                        name="number"
                        isValidation={formData.number != ""}
                        validationText={"인증번호를 입력해주세요"}
                        ref={numberInputRef}
                    />
                )}
                {isNumberError && <p className="text-red-500 text-sm">인증번호가 틀렸습니다.</p>}
                <Button
                    text={"아이디 찾기"}
                    size={"w-full mt-5"}
                    onClick={findId}
                    type={"submit"}
                    disabled={!formData.name || !formData.email || !formData.number}
                />
            </form>

            <div className="mt-8 flex flex-col sm:flex-row gap-5 text-center">
                <Link to={LOGIN}>로그인</Link>
                <div className="hidden sm:block">|</div>
                <Link to={FIND_PASSWORD}>비밀번호 찾기</Link>
            </div>
        </div>
    );
};
