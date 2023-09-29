import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

export default function createListing() {
  const [image, setImage] = useState([]);
  const [formData, setFormData] = useState({
    imageURLs: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);

  const handleImages = () => {
    if (image.length > 0 && image.length + formData.imageURLs.length < 7) {
      const promises = [];
      for (let i = 0; i < image.length; i++) {
        promises.push(storeImage(image[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls),
          });
          setImageUploadError(false);
        })
        .then((err) => {
          setImageUploadError("Image upload failed, 2 mb Max");
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  };
  const storeImage = async (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + image.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "status_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i !== index),
    });
  };
  return (
    <main className="max-w-4xl mx-auto p-3">
      <div className="text-3xl text-center font-semibold my-4">
        Create listing
      </div>
      <form className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="p-3 border-3"
            required
          />
          <input
            type="textarea"
            placeholder="Description"
            maxLength={60}
            minLength={10}
            id="description"
            className="p-3 border-3"
            required
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="p-3 border-3"
            required
          />

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking slot</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="beds"
                className="p-3 border rounded-lg border-gray-300"
                min={1}
                max={10}
                required
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                className="p-3 border rounded-lg border-gray-300"
                min={1}
                max={10}
                required
              />
              <span>Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regular"
                className="p-3 border rounded-lg border-gray-300"
                min={1}
                max={400}
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span>($ /month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discount"
                className="p-3 border rounded-lg border-gray-300"
                min={1}
                max={400}
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span>($ /month)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 p-3">
          <div className="flex gap-1 flex-wrap items-center">
            <span className="font-bold">Images</span>
            <span>first image will be the cover (Max:6)</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <input
              onChange={(e) => setImage(e.target.files)}
              type="file"
              id="image"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImages}
              className="border-2 border-green-500 py-2 px-3"
            >
              Upload
            </button>
          </div>
          <p className="text-red-600 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, index) => (
              <div
                key={url}
                className="flex items-center justify-between border p-2"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-28 h-28 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="py-1 px-2 border text-red-600 hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="bg-neutral-700 hover:opacity-95 text-white rounded-lg py-1 px-4 mt-3 uppercase">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
