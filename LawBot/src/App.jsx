import "./App.css";
import { Button } from "./components/Button";
import { InputText } from "./components/InputText";

function App() {
    return (
        <>
            <div className="bg-blue-500">test</div>
            <button className="btn">Default</button>
            <InputText
                label={"아이디"}
                placeholder={"아이디를 입력해주세요"}
                validationText={"아이디가 중복입니다. 비밀번호는 12자리 이상이어야합니다. "}
            />
            <Button text="등록" />
        </>
    );
}

export default App;
