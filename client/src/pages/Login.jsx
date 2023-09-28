import { useState } from "react";
import GoogleLogin from "../components/Oauth/GoogleLogin";
import GitHubLogin from "../components/Oauth/GitHubLogin";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loginPendingState,
  loginFulfilledState,
  loginRejectedState,
} from "../redux/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const {isError, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginPendingState);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(loginRejectedState(data.message));
        return;
      }
      dispatch(loginFulfilledState(data));
      navigate("/");
    } catch (error) {
      dispatch(loginRejectedState(error.message));
    }
  };
  return (
    <>
      <div className="flex flex-col items-center h-screen justify-center px-8 py-5">
        <form
          onSubmit={handleSubmit}
          className="w-[400px] mx-auto bg-white p-5 shadow-lg "
        >
          <h3 className="font-semibold text-center mb-4 text-xl">
            Login to your account
          </h3>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-t-md p-2 focus:outline-none border border-gray-400"
              id="email"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-t-md p-2 focus:outline-none border border-gray-400"
              id="password"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 border-none hover:border-gray-300 py-2 px-4 bg-indigo-800 text-white rounded-md w-full ${
                isLoading ? "bg-indigo-7oo cursor-not-allowed" : ""
              }`}
            >
              Login
            </button>
            <div className="flex flex-col-reverse md:flex-col gap-1">
              <GoogleLogin />
              <GitHubLogin />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>Dont have an account ?</span>
            <Link to="/register" className="text-blue-600">
              Sign up
            </Link>
          </div>
          <div>
            {isError ? <p className="text-red-500 text-sm">{isError}</p> : ""}
          </div>
        </form>
      </div>
    </>
  );
}
