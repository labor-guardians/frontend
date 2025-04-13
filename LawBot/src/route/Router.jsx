import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { MainPage } from "../pages/MainPage";
import { Login } from "../pages/Login";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <MainPage /> },
            { path: "/login", element: <Login /> },
        ],
    },
]);
