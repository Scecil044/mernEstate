import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { loginFulfilledState } from "../../redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function GoogleLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      //initiate process
      const res = await signInWithPopup(auth, provider);
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: res.user.displayName,
          email: res.user.email,
          photo: res.user.photoURL,
        }),
      });
      const data = await response.json();
      dispatch(loginFulfilledState(data));
      navigate("/");
    } catch (error) {
      console.log("could not login with google", error);
    }
  };
  return (
    <>
      <button
        onClick={loginWithGoogle}
        type="button"
        className="mt-1 w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-700 text-white border-none hover:border-gray-400"
      >
        <img src="google.svg" alt="img" className="w-5 h-5" />
        Continue with google
      </button>
    </>
  );
}
