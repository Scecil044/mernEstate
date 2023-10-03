import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function createListing() {
  //Get user data
  const { userInfo } = useSelector(state => state.auth);
  const navigate = useNavigate();
  //states for error and loading
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [image, setImage] = useState([]);
  const [formData, setFormData] = useState({
    imageURLs: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    discountedPrice: 0,
    regularPrice: 0,
    parking: false,
    offer: false,
    furnished: false
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  console.log(formData);

  const handleImages = () => {
    if (image.length > 0 && image.length + formData.imageURLs.length < 7) {
      const promises = [];
      for (let i = 0; i < image.length; i++) {
        promises.push(storeImage(image[i]));
      }
      Promise.all(promises)
        .then(urls => {
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls)
          });
          setImageUploadError(false);
        })
        .then(err => {
          setImageUploadError("Image upload failed, 2 mb Max");
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  };
  const storeImage = async image => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + image.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "status_changed",
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        error => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = index => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i !== index)
    });
  };

  const handleChange = e => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id
      });
    }
    if (e.target.id === "furnished" || e.target.id === "parking" || e.target.id === "offer") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      });
    }
    if (e.target.type === "text" || e.target.type === "textarea" || e.target.type === "number") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      });
    }
  };
  //Function to handle form data
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (formData.imageURLs.length < 1) return setIsError("Upload at least one image for your listing");
      if (+formData.discountedPrice > +formData.regularPrice)
        return setIsError("The discounted price cannot be greater than the regular price");
      if (+formData.regularPrice < 1) return setIsError("The regular price cannot be a value less than one");
      setIsLoading(true);
      setIsError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userRef: userInfo._id
        })
      });
      const data = await res.json();
      if (data.success === false) {
        setIsLoading(false);
        setIsError(data.message);
      }
      setIsLoading(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setIsLoading(false);
      setIsError(error.message);
      console.log(error);
    }
  };
  return (
    <main className="max-w-4xl mx-auto p-3">
      <div className="text-3xl text-center font-semibold my-4">Create listing</div>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="p-3 border-3"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="textarea"
            placeholder="Description"
            minLength={10}
            id="description"
            className="p-3 border-3"
            required
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="p-3 border-3"
            required
            value={formData.address}
            onChange={handleChange}
          />

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={formData.type === "sale"} />
              <span>Sell</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={formData.type === "rent"} />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={formData.parking} />
              <span>Parking slot</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedRooms"
                className="p-3 border rounded-lg border-gray-300"
                min={1}
                max={10}
                required
                value={formData.bedRooms}
                onChange={handleChange}
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathRooms"
                className="p-3 border rounded-lg border-gray-300"
                min={1}
                max={10}
                required
                value={formData.bathRooms}
                onChange={handleChange}
              />
              <span>Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                className="p-3 border rounded-lg border-gray-300"
                min={1}
                max={400}
                required
                value={formData.regularPrice}
                onChange={handleChange}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span>($ /month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  className="p-3 border rounded-lg border-gray-300"
                  min={0}
                  max={400}
                  required
                  value={formData.discountedPrice}
                  onChange={handleChange}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span>($ /month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 p-3">
          <div className="flex gap-1 flex-wrap items-center">
            <span className="font-bold">Images</span>
            <span>first image will be the cover (Max:6)</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <input onChange={e => setImage(e.target.files)} type="file" id="image" accept="image/*" multiple />
            <button type="button" onClick={handleImages} className="border-2 border-green-500 py-2 px-3">
              Upload
            </button>
          </div>
          <p className="text-red-600 text-sm">{imageUploadError && imageUploadError}</p>
          {formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, index) => (
              <div key={url} className="flex items-center justify-between border p-2">
                <img src={url} alt="listing image" className="w-28 h-28 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="py-1 px-2 border text-red-600 hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={isLoading}
            className={`bg-neutral-700 hover:opacity-95 text-white rounded-lg py-1 px-4 mt-3 uppercase ${
              isLoading ? "cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Loading ..." : "Create Listing"}
          </button>
          {isError && <p className="text-red-500 text-sm">{isError}</p>}
        </div>
      </form>
    </main>
  );
}
