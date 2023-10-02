import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "Created_at",
    order: "desc"
  });

  const handleChange = e => {
    if (e.target.id === "all" || e.target.id === "rent" || e.target.id === "offer" || e.target.id === "sale") {
      setSidebarData({
        ...sidebarData,
        type: e.target.id
      });
    }
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    const furnished = urlParams.set("furnished", sidebarData.furnished);
    const searchTerm = urlParams.set("searchTerm", sidebarData.searchTerm);
    const type = urlParams.set("type", sidebarData.type);
    const parking = urlParams.set("parking", sidebarData.parking);
    const offer = urlParams.set("offer", sidebarData.offer);
    const sort = urlParams.set("sort", sidebarData.sort);
    const order = urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate("/search?" + searchQuery);
  };

  useEffect(
    () => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromURL = urlParams.get("searchTerm");
      const furnishedFromURL = urlParams.get("furnished");
      const typeFromURL = urlParams.get("type");
      const parkingFromURL = urlParams.get("parking");
      const offerFromURL = urlParams.get("offer");
      const sortFromURL = urlParams.get("sort");
      const orderFromURL = urlParams.get("order");

      if (
        searchTermFromURL ||
        typeFromURL ||
        orderFromURL ||
        sortFromURL ||
        parkingFromURL ||
        furnishedFromURL ||
        offerFromURL
      ) {
        setSidebarData({
          searchTerm: searchTermFromURL || "",
          type: typeFromURL || "all",
          furnished: furnishedFromURL === "true" ? true : false,
          parking: parkingFromURL === "true" ? true : false,
          offer: offerFromURL === "true" ? true : false,
          order: orderFromURL || "desc",
          sort: sortFromURL || "created_at"
        });
      }

      const fetchListings = async () => {
        setIsLoading(false);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        setListings(data);
        setIsLoading(false);
      };
      fetchListings();
    },
    [location.search]
  );

  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-5 p-7">
      <form onSubmit={handleSubmit} className="flex flex-col p-5 w-full md:w-[400px]">
        <div className="flex items-center gap-2">
          <label htmlFor="search" className="whitespace-nowrap text-lg font-semibold">
            Search Term
          </label>
          <input
            type="text"
            placeholder="Search...."
            id="searchTerm"
            className="p-2 border w-full"
            value={sidebarData.searchTerm}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <label htmlFor="type">Type</label>
          <div className="flex gap-2">
            <input type="checkbox" className="w-5" id="all" onChange={handleChange} checked={sidebarData.type === "all"} />
            <span>Rent and Sale</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" className="w-5" id="rent" onChange={handleChange} checked={sidebarData.type === "rent"} />
            <span>Rent</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" className="w-5" id="sale" onChange={handleChange} checked={sidebarData.type === "sale"} />
            <span>Sale</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" className="w-5" id="offer" onChange={handleChange} checked={sidebarData.offer} />
            <span>Offer</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <label htmlFor="amenities">Amenities</label>
          <div className="flex gap-3">
            <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={sidebarData.furnished} />
            <span>Furnished</span>
          </div>
          <div className="flex gap-3">
            <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={sidebarData.parking} />
            <span>Parking</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <label htmlFor="sort">Sort</label>
          <select
            onChange={handleChange}
            defaultValue={"created_at_desc"}
            name="sort_order"
            id="sort_order"
            className="p-2 border"
          >
            <option value="regularPrice_desc">Price High to Low</option>
            <option value="regularPrice_asc">Price Low to High</option>
            <option value="createdAt_desc">Latest First</option>
            <option value="createdAt_asc">Oldest First</option>
          </select>
        </div>
        <button className="bg-slate-700 py-2 px-4 text-white uppercase text-center mt-3 hover:opacity-90">Submit</button>
      </form>
      <div className="flex-1 p-5">two</div>
    </div>
  );
}
