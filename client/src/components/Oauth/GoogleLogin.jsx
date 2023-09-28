import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";

export default function GoogleLogin() {
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      //initiate process
      const res = await signInWithPopup(auth, provider);
      console.log(res);
    } catch (error) {
      console.log(error);
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
