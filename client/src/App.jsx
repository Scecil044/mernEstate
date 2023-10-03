import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import About from "./pages/About";
import Layout from "./components/Layout";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/update-listing/:listingId" element={<EditListing />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listing/:listingId" element={<Listing />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
