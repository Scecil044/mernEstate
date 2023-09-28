import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  loginRejectedState,
  updateFulfilledState,
  updatePendingState,
  updateRejectedState,
} from "../redux/auth/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const { userInfo, isLoading, isError } = useSelector((state) => state.auth);
  const fileRef = useRef();
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadError, setUploadError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updatePendingState);
      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = res.json();
      if (data.success === false) {
        dispatch(loginRejectedState(data.message));
      }
      dispatch(updateFulfilledState(data));
    } catch (error) {
      dispatch(updateRejectedState(error.message));
      console.log(error);
    }
  };

  const handleImage = (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "stat_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(Math.floor(progress));
        // console.log(uploadPercentage);
      },
      (error) => {
        setUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  useEffect(() => {
    if (image) {
      handleImage(image);
    }
  }, [image]);
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-5 shadow-md mt-20"
      >
        <h3 className="text-lg font-semibold mb-3 text-center">Profile</h3>
        <img
          src={formData.avatar || userInfo.avatar}
          alt="profile"
          className="rounded-full object-cover h-24 w-24 mx-auto mb-3 cursor-pointer"
          onClick={() => fileRef.current.click()}
        />
        <div className="text-center">
          {uploadError ? (
            <p className="text-red-500 text-sm">
              Error uploading image (image size must not exceed 2mbs)
            </p>
          ) : uploadPercentage > 0 ? (
            <p className="text-green-600 text-sm">{`Uploading ... ${uploadPercentage}%`}</p>
          ) : uploadPercentage === 100 ? (
            <p className="text-green-600 text-sm">
              Image uploaded successfully
            </p>
          ) : (
            ""
          )}
        </div>
        <input
          type="file"
          className="hidden"
          ref={fileRef}
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div className="flex-col gap-2 md:grid md:grid-cols-2 md:gap-4">
          <div className="mb-3">
            <input
              type="text"
              id="firstName"
              defaultValue={userInfo.firstName}
              placeholder="First Name"
              className="w-full py-1 px-3 focus:outline-none border border-gray-300"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="lastName"
              defaultValue={userInfo.lastName}
              placeholder="Last Name"
              className="w-full py-1 px-3 focus:outline-none border border-gray-300"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              id="email"
              defaultValue={userInfo.email}
              placeholder="Email"
              className="w-full py-1 px-3 focus:outline-none border border-gray-300"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="userName"
              defaultValue={userInfo.userName}
              placeholder="User Name"
              className="w-full py-1 px-3 focus:outline-none border border-gray-300"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full py-1 px-3 focus:outline-none border border-gray-300"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              id="password_confirmation"
              placeholder="Confirm Password"
              className="w-full py-1 px-3 focus:outline-none border border-gray-300"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button className=" flex items-center justify-center gap-2 py-2 px-4 w-full bg-blue-600 text-white hover:bg-blue-500 hover:shadow-md transition-colors duration-100">
            {isLoading && (
              <div className="rounded-full border-white animate-spin w-5 h-5 border-t-2 border-r-2"></div>
            )}
            Update
          </button>
          <button className="flex items justify-center py-2 px-4 w-full bg-green-600 text-white hover:bg-green-500 hover:shadow-md transition-colors duration-100">
            {isLoading && (
              <div className="rounded-full border-white animate-spin w-5 h-5 border-t-2 border-r-2"></div>
            )}
            Create a New Listing
          </button>
        </div>
        <div className="flex items-center justify-between mt-1">
          <Link className="text-red-600">Delete Account</Link>
          <Link className="text-red-500">Logout</Link>
        </div>
      </form>
    </>
  );
}
