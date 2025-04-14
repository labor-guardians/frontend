import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { MainPage } from "../pages/MainPage";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import { SignUpLabor } from "../pages/SignUpLabor";
import { FindIdPassWord } from "../pages/FindIdPassWord";
import { LaborAttorneyList } from "../pages/LaborAttorneyList";
import { ChatBot } from "../pages/ChatBot";
import { LaborAttorneyChatHistory } from "../pages/LaborAttorneyChatHistory";
import { MyPage } from "../pages/MyPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "/login", element: <Login /> },
      { path: "/sign-up", element: <SignUp /> },
      { path: "/find-id-password", element: <FindIdPassWord /> },
      { path: "/chatbot", element: <ChatBot /> },
      { path: "labor-attorney-list", element: <LaborAttorneyList /> },
      {
        path: "/labor-attorney-chat-history",
        element: <LaborAttorneyChatHistory />,
      },
      { path: "/mypage", element: <MyPage /> },
      { path: "/sign-up-labor", element: <SignUpLabor /> },
    ],
  },
]);
