import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingCard({ listing }) {
  return (
    <>
      <div className="overflow-hidden shadow-lg hover:shadow-md rounded-lg w-full sm:w-[300px]">
        <Link to={`/listing/${listing._id}`}>
          <img
            src={listing.imageURLs[0]}
            alt="image cover"
            className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 duration-300 transition"
          />
          <div className="p-3 flex flex-col gap-2">
            <p className="truncate text-lg text-slate-700 font-semibold">{listing.name}</p>
            <div className="flex items-center gap-1">
              <MdLocationOn className="w-4 h-4 text-green-400" />
              <p className="truncate text-sm w-full">{listing.address}</p>
            </div>
            <p className="text-gray-500 line-clamp-2">{listing.description}</p>
            <p>
              ${" "}
              {listing.parking ? listing.discountedPrice.toLocaleString("en-Us") : listing.regularPrice.toLocaleString("en-Us")}
              {listing.type === "rent" && "/month"}
            </p>
          </div>
        </Link>
      </div>
    </>
  );
}
