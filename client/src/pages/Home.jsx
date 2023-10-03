import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingCard from "../components/ListingCard";

export default function Home() {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        fetchSaleListings();
        setRentListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-7 px-3 py-7">
          <h1 className="text-3xl md:text-6xl text-slate-600 font-bold">
            Find your next <span className="text-slate-700">Perfect</span>
            <br />
            place with ease
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Cecil Estate offers you some of the best selections in town. You only need to tell as what you want and leave the
            rest to us!
            <br /> Looking for a house has never been this simple. We combine IT with our experience in the market to ensure we
            have you covered
          </p>
          <Link className="text-blue-700 font-semibold hover:underline" to="/search">
            Show more ....
          </Link>
        </div>
      </div>
      {/* Swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map(listing => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-[300px]"
                style={{ background: `url(${listing.imageURLs[0]}) center no-repeat`, backgroundSize: "cover" }}
              />
            </SwiperSlide>
          ))}
      </Swiper>
      {/* listings */}
      <div className="mx-auto max-w-6xl my-10 gap-8 p-3 flex flex-col">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-1">
              <h2 className="font-semibold text-2xl text-slate-500">Recent Offers</h2>
              <Link className="tex-sx sm:text-sm text-blue-600" to={"/search?offer=true"}>
                Show more
              </Link>
            </div>
            <div className="flex flex-col gap-3 md:grid md:grid-cols-4 md:gap-5">
              {offerListings.map(listing => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="my-1">
              <h2 className="font-semibold text-2xl text-slate-500">Recent places for rent</h2>
              <Link className="tex-sx sm:text-sm text-blue-600" to={"/search?offer=true"}>
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-col gap-3 md:grid md:grid-cols-4 md:gap-5">
              {rentListings.map(listing => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="my-1">
              <h2 className="font-semibold text-2xl text-slate-500">Recent places for sale</h2>
              <Link className="tex-sx sm:text-sm text-blue-600" to={"/search?offer=true"}>
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-col gap-3 md:grid md:grid-cols-4 md:gap-5">
              {saleListings.map(listing => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
