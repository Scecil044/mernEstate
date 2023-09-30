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
  updateFulfilledState,
  updatePendingState,
  updateRejectedState,
  logoutFulfilledState,
  logoutPendingState,
  logoutRejectedState,
  deleteAccountFulfilledState,
  deleteAccountPendingState,
  deleteAccountRejectedState,
  loginPendingState,
} from "../redux/auth/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const { userInfo, isLoading, isError } = useSelector((state) => state.auth);

  const fileRef = useRef();
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  //function to handle form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  //function to update user details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updatePendingState());
      const res = await fetch("/api/users/update/" + userInfo._id, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateRejectedState(data.message));
        return;
      }
      console.log(data);
      dispatch(updateFulfilledState(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateRejectedState(error.message));
      console.log(error);
    }
  };

  //function to logout user
  const logoutUser = async () => {
    try {
      dispatch(logoutPendingState());
      const res = await fetch("/api/users/logout");
      const data = res.json();
      if (data.success === false) {
        dispatch(logoutRejectedState(data.message));
      }
      dispatch(logoutFulfilledState(data));
    } catch (error) {
      dispatch(logoutRejectedState(error.message));
      console.log(error);
    }
  };
  //function to delete user
  const deleteAccount = async () => {
    try {
      dispatch(deleteAccountPendingState());
      const res = await fetch("/api/users/delete/" + userInfo._id, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.success === false) {
        dispatch(deleteAccountRejectedState(data.message));
      }
      dispatch(deleteAccountFulfilledState(data));
    } catch (error) {
      dispatch(logoutRejectedState(error.message));
      console.log(error);
    }
  };
  //function to handle selected image
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
  //function to get user listings
  const handleShowListings = async () => {
    try {
      setListingError(false);
      const res = await fetch("/api/listing/my-listings/" + userInfo._id);
      const data = await res.json();
      if (data.success === false) {
        setListingError(true);
      }
      setUserListings(data);
    } catch (error) {
      console.log(error);
      setListingError(true);
    }
  };

  //function to delete listing
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch("/api/listing/delete/" + listingId, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };
  //Use Effect hook checks if the image changes to initiate upload
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
          <button className=" flex items-center justify-center gap-2 py-2 px-4 w-full bg-neutral-600 text-white hover:bg-neutral-900 hover:shadow-md transition-colors duration-100 uppercase">
            {isLoading && (
              <div className="rounded-full border-white animate-spin w-5 h-5 border-t-2 border-r-2"></div>
            )}
            Update
          </button>
          <Link
            to="/create-listing"
            className="flex items-center justify-center gap-1 py-2 px-4 w-full bg-green-700 text-white hover:bg-green-500 hover:shadow-md transition-colors duration-100 hover:opacity-95"
          >
            {isLoading && (
              <div className="rounded-full border-white animate-spin w-5 h-5 border-t-2 border-r-2"></div>
            )}
            Create a New Listing
          </Link>
        </div>
        <div className="flex items-center justify-between mt-1">
          <Link onClick={deleteAccount} className="text-red-600">
            Delete Account
          </Link>
          <Link onClick={logoutUser} className="text-red-500">
            Logout
          </Link>
        </div>
        <div>
          <span>
            {isError ? <p className="text-red-500 text-sm">{isError}</p> : ""}
          </span>
          <span className="text-sm text-green-500">
            {updateSuccess ? "Details updated" : ""}
          </span>
          <button
            type="button"
            onClick={handleShowListings}
            className="text-green-700 w-full"
          >
            Show Listings
          </button>
          {/* listings */}
          {userListings &&
            userListings.length > 0 &&
            userListings.map((listing, index) => (
              <div
                key={index}
                className="p-3 border flex items-center justify-between gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageURLs[0]}
                    alt="listing image"
                    className="w-16 h-16 object-contain"
                  />
                </Link>
                <Link
                  to={`/listing/${listing._id}`}
                  className="flex-1 truncate hover:underline font-semibold"
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/update-listing/${listing._id}`}
                    className="text-green-500"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </form>
    </>
  );
}
