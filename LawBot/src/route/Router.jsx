import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { MainPage } from '../pages/MainPage';
import { Login } from '../pages/Login';
import { SignUp } from '../pages/SignUp';
import { SignUpLabor } from '../pages/SignUpLabor';
import { FindId } from '../pages/FindId';
import { LaborAttorneyList } from '../pages/LaborAttorneyList';
import { ChatBot } from '../pages/ChatBot';
import { LaborAttorneyChatHistory } from '../pages/LaborAttorneyChatHistory';
import { MyPage } from '../pages/MyPage';
import {
  CHAT_BOT,
  FIND_ID,
  FIND_PASSWORD,
  LABOR_ATTORNEY_CHAT,
  LABOR_ATTORNEY_CHAT_HISTORY,
  LABOR_ATTORNEY_LIST,
  LOGIN,
  MYPAGE,
  SIGN_UP,
  SIGN_UP_LABOR,
} from '../constants/path';
import { FindPassword } from '../pages/FindPassword';
import { LaborAttorneyChat } from '../pages/LaborAttorneyChat';
import { PrivateRoute } from '../components/PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: LOGIN, element: <Login /> },
      { path: SIGN_UP, element: <SignUp /> },
      { path: SIGN_UP_LABOR, element: <SignUpLabor /> },
      { path: FIND_ID, element: <FindId /> },
      { path: FIND_PASSWORD, element: <FindPassword /> },
      { path: CHAT_BOT, element: <ChatBot /> },
      { path: LABOR_ATTORNEY_LIST, element: <LaborAttorneyList /> },
      {
        path: LABOR_ATTORNEY_CHAT_HISTORY,
        element: (
          <PrivateRoute>
            <LaborAttorneyChatHistory />
          </PrivateRoute>
        ),
      },
      {
        path: `${LABOR_ATTORNEY_CHAT}`,
        element: <LaborAttorneyChat />,
      },
      {
        path: MYPAGE,
        element: (
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
