import { GithubAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
export default function GitHubLogin() {
  const loginWithGitHub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const auth = getAuth(app);
      const res = await signInWithPopup(auth, provider);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <button
        onClick={loginWithGitHub}
        type="button"
        className="mt-1 w-full flex items-center justify-center gap-2 py-2 px-4 bg-neutral-700 text-white border-none hover:border-gray-400"
      >
        <img src="github.svg" alt="img" className="w-5 h-5" />
        Continue with GitHub
      </button>
    </>
  );
}
