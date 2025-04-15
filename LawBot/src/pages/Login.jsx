import React, { useRef, useState } from "react";
import { InputText } from "../components/InputText";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";

export const Login = () => {
    const [formData, setFormData] = useState({
        id: null,
        password: null,
    });
    const [isLoginError, setIsLoginError] = useState(false);

    const idInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const login = (e) => {
        e.preventDefault();
        if (!formData.id) {
            idInputRef.current.focus();
            return;
        } else if (!formData.password) {
            passwordInputRef.current.focus();
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
        <div className="max-w-xs m-auto flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-10">로그인</h2>
            <form className="w-full flex flex-col items-center gap-4">
                <InputText
                    placeholder={"아이디를 입력하세요."}
                    label={"아이디"}
                    onChange={handleChange}
                    name="id"
                    isValidation={formData.id != ""}
                    validationText={"아이디를 입력해주세요."}
                    ref={idInputRef}
                />
                <InputText
                    type="password"
                    placeholder={"비밀번호를 입력하세요."}
                    label={"비빌번호"}
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                    isValidation={formData.password != ""}
                    validationText={"비밀번호를 입력해주세요."}
                    ref={passwordInputRef}
                />
                {isLoginError && (
                    <p className="text-red-500 text-sm">아이디 또는 비밀번호가 잘못되었습니다.</p>
                )}
                <Button text={"로그인"} size={"w-full mt-5"} onClick={login} type={"submit"} />
            </form>

            <div className="mt-8 flex flex-col sm:flex-row gap-5 text-center">
                <Link to="/sign-up">회원가입</Link>
                <div className="hidden sm:block">|</div>
                <Link to="/find-id-password">아이디/비밀번호 찾기</Link>
            </div>
        </div>
    );
};
