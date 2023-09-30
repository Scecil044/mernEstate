import { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [message, setMessage] = useState("");
  console.log(message);
  return (
    <>
      {listing && (
        <div className="flex flex-col gap-3">
          <div className="font-bold">
            <span>
              contact{" "}
              {listing.userRef.firstName + " " + listing.userRef.lastName + " "}
            </span>
            <span>for {listing.name.toLowerCase()}</span>
          </div>
          <textarea
            name="message"
            id="message"
            rows="2"
            placeholder="Type a message here"
            className="p-3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <Link
            to={`mailto:${listing.userRef.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white rounded-lg hover:opacity-95 py-2 px-3 w-full uppercase text-center"
          >
            Send message
          </Link>
        </div>
      )}
    </>
  );
}
