import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Home from "../src/pages/Home.jsx";
import SubmissionHistory from "./pages/SubmissionHistory.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import AppInnit from "./components/AppInnit.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/submission-history",
        // element: <SubmissionHistory />,
        element: (<AuthLayout authentication={true}>
          <SubmissionHistory />
        </AuthLayout>)
      },
      {
        //to do:: add authentication stuff here
        path: "/login",
        // element: <Login />,
        element: (<AuthLayout authentication={false}>
          <Login/>
        </AuthLayout>)
      },
      {
        //todo::add auth stuff here
        path: "/sign-up",
        element:( <AuthLayout authentication={false}>
          <SignUp />
        </AuthLayout>),
      },
      {
        path: "/profile",
        element:( <AuthLayout authentication={true}>
          <Profile />
        </AuthLayout>),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppInnit router={router}/>
    </Provider>
    
  </StrictMode>
);
