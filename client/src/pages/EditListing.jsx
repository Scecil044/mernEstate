import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { useSelector } from "react-redux";

export default function EditListing() {
  const params = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [file, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [fetchedListing, setFetchedListing] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [formData, setFormData] = useState({
    imageURLs: [],
    name: "",
    description: "",
    address: "",
    bedRooms: 0,
    bathRooms: 0,
    parking: false,
    sale: false,
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    type: "rent",
    furnished: false,
  });
  console.log(formData);

  //function to handle images
  const handleImages = () => {
    if (file.length > 0 && file.length + formData.imageURLs.length < 7) {
      const promises = [];
      for (let i = 0; i < file.length; i++) {
        promises.push(setImage(file[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls),
          });
          setImageUploadError(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed: 2 mb Max");
        });
    } else {
      setImageUploadError(
        "You can only upload a maximum of 7 and minimum of 1 image per listing"
      );
    }
  };

  const setImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`image uploading.... ${progress}%`);
        },
        (err) => {
          reject(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    if (
      e.target.id === "furnished" ||
      e.target.id === "parking" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "number"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i !== index),
    });
  };
  //function to submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/listing/update/" + params.listingId, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userRef: userInfo._id,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setIsLoading(false);
        setIsError(data.message);
        console.log(data.message);
      }
      setIsLoading(false);
      setIsError(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(error.message);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      try {
        const res = await fetch("/api/listing/get-listing/" + listingId);
        const data = await res.json();
        if (data.success === false) {
          setFetchedListing(data);
        }
        console.log(data);
        setFormData(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchListing();
  }, []);
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <h4 className="text-2xl text-center font-semibold my-4">
          Update Listing
        </h4>
        <form
          onSubmit={handleSubmit}
          className="p-3 flex flex-col gap-2 md:flex-row md:gap-5"
        >
          <div className="flex-1">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="p-3 focus:outline-none border border-gray-300"
              />
              <input
                type="textarea"
                placeholder="Description"
                id="description"
                required
                value={formData.description}
                onChange={handleChange}
                className="p-3 focus:outline-none border border-gray-300"
              />
              <input
                type="text"
                placeholder="Address"
                id="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="p-3 focus:outline-none border border-gray-300"
              />
            </div>
            <div className="flex flex-wrap gap-6 p-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  name="rent"
                  className=""
                  onChange={handleChange}
                  checked={formData.type == "rent"}
                />
                <span>Rent</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  name="sale"
                  className=""
                  onChange={handleChange}
                  checked={formData.type == "sale"}
                />
                <span>Sell</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  name="furnished"
                  className=""
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  name="parking"
                  className=""
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  name="offer"
                  className=""
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedRooms"
                  name="bedRooms"
                  min={1}
                  max={10}
                  value={formData.bedRooms}
                  onChange={handleChange}
                  className="border border-gray-300 p-2"
                />
                <span>Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathRooms"
                  name="bathRooms"
                  min={1}
                  max={20}
                  required
                  value={formData.bathRooms}
                  onChange={handleChange}
                  className="border border-gray-300 p-2"
                />
                <span>Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  name="discountedPrice"
                  min={10}
                  max={1000}
                  required
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  className="border border-gray-300 p-2"
                />
                <span className="flex flex-col">
                  <span>Discount</span>($/month)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  name="regularPrice"
                  min={20}
                  max={1000}
                  required
                  value={formData.regularPrice}
                  onChange={handleChange}
                  className="border border-gray-300 p-2"
                />
                <span className="flex flex-col">
                  <span>Regular</span>($/month)
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-1">
                <span className="font-bold">Images</span>
                <span>First image will the the cover picture (max 6)</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
                <button
                  type="button"
                  className="py-2 px-3 border border-green-600 hover:border-2"
                  onClick={handleImages}
                >
                  Upload
                </button>
              </div>
              {imageUploadError && (
                <p className="text-red-500">{imageUploadError}</p>
              )}
              {formData.imageURLs.length > 0 &&
                formData.imageURLs.map((image, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2 border"
                  >
                    <img
                      src={image}
                      alt="listing image"
                      className="w-16 h-16"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="text-red-600 py-2 px-3"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              <div className="my-3">
                <button
                  type="submit"
                  className="py-2 px-4 bg-neutral-700 text-white hover:neutral-700 disabled:opacity-75 uppercase w-full "
                >
                  {isLoading ? "Loading ..." : "Update Listing"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
