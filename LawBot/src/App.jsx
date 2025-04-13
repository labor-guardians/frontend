import { Outlet } from "react-router-dom";
import "./App.css";

import { Header } from "./components/Header";

function App() {
    return (
        <div className="max-w-[1440px] m-auto">
            <Header />
            <Outlet />
        </div>
    );
}

export default App;
