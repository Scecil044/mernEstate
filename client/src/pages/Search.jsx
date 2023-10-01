export default function Search() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-5 p-7">
      <form className="flex flex-col p-5 w-full md:w-[400px]">
        <div className="flex items-center gap-2">
          <label
            htmlFor="search"
            className="whitespace-nowrap text-lg font-semibold"
          >
            Search Term
          </label>
          <input
            type="text"
            placeholder="Search...."
            id="searchTerm"
            className="p-2 border w-full"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <label htmlFor="type">Type</label>
          <div className="flex gap-2">
            <input type="checkbox" className="w-5" id="all" />
            <span>Rent and Sale</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" className="w-5" id="rent" />
            <span>Rent</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" className="w-5" id="sale" />
            <span>Sale</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" className="w-5" id="offer" />
            <span>Offer</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <label htmlFor="amenities">Amenities</label>
          <div className="flex gap-3">
            <input type="checkbox" id="furnished" className="w-5" />
            <span>Furnished</span>
          </div>
          <div className="flex gap-3">
            <input type="checkbox" id="parking" className="w-5" />
            <span>Parking</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <label htmlFor="sort">Sort</label>
          <select name="sort_order" id="sort_order" className="p-2 border">
            <option value="">Latest First</option>
            <option value="">Oldest First</option>
          </select>
        </div>
        <button className="bg-slate-700 py-2 px-4 text-white uppercase text-center mt-3 hover:opacity-90">
          Submit
        </button>
      </form>
      <div className="flex-1 p-5">two</div>
    </div>
  );
}
