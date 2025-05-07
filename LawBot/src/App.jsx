import { Outlet } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";

function App() {
  return (
    <div className="max-w-[1440px] m-auto">
      <Header />
      <div className="mt-[150px]">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
