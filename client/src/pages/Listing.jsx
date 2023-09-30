import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwipperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwipperCore.use(Navigation);
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const res = await fetch(`/api/listing/get-listing/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data);
          setIsLoading(false);
          setIsError(data.message);
          return;
        }
        setIsLoading(false);
        setListing(data);
        console.log(data);
      } catch (error) {
        setIsLoading(false);
        setIsError(error.message);
        console.log(error);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {listing && !isError && !isLoading && (
        <>
          <Swiper navigation>
            {listing.imageURLs.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-[250px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
}
