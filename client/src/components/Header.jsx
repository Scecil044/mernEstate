import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <header className="bg-slate-200 w-full">
      <div className="flex items-center justify-between max-w-6xl mx-auto p-3">
        <Link to={"/"}>
          <h1 className="flex flex-wrap text-sm sm:text-xl">
            <span className="font bold text-slate-600">Cecil</span>
            <span className="font-bold text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center gap-1">
          <input
            type="text"
            placeholder="search ..."
            className="bg-transparent w-24 sm:w-64 focus:outline-none"
          />
          <FaSearch />
        </form>
        <ul className="flex items-center gap-5">
          <Link to={"/"}>
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to={"/profile"}>
            {userInfo ? (
              <img
                src={userInfo.avatar}
                alt="avatar"
                className="w-7 h-7 rounded-full"
              />
            ) : (
              <li className=" text-slate-700 hover:underline">Login</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
