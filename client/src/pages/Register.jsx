import { useState } from "react";
import GoogleLogin from "../components/Oauth/GoogleLogin";
import { Link } from "react-router-dom";

export default function Register() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex flex-col items-center h-screen justify-center p-5">
        <form
          onSubmit={handleSubmit}
          className="w-[500px] mx-auto bg-white shadow-lg px-8 py-5 "
        >
          <h3 className="font-semibold text-lg text-center mb-2">
            Create A new account
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="mb-3">
              <input
                type="text"
                placeholder="First Name"
                className="w-full rounded-t-md p-2 focus:outline-none border border-gray-400"
                id="firstName"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Last Name"
                className="w-full rounded-t-md p-2 focus:outline-none border border-gray-400"
                id="lastName"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Phone"
                className="w-full rounded-t-md p-2 focus:outline-none border border-gray-400"
                id="phone"
                onChange={handleChange}
              />
            </div>
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
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full rounded-t-md p-2 focus:outline-none border border-gray-400"
                id="password_confirmation"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3">
            <button
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 border-none hover:border-gray-300 py-2 px-4 bg-indigo-800 text-white rounded-md w-full active:bg-indigo-700 ${
                isLoading ? "disabled:opacity-90 cursor-not-allowed" : ""
              }`}
            >
              {isLoading && (
                <div className="rounded-full h-5 w-5 border-white border-t-2 border-b-2 animate-spin"></div>
              )}
              {isLoading ? "Loading ..." : "Submit"}
            </button>
            <div className="flex flex-col-reverse md:flex-col gap-1">
              <GoogleLogin />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <p>Already have an account ?</p>
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </div>
          <div>
            {error ? <p className="text-sm text-red-500">{error}</p> : ""}
          </div>
        </form>
      </div>
    </>
  );
}
