import React, { useEffect } from "react";
import { CgMouse } from "react-icons/all";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/Metadata";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import SearchImage from "../../images/Search.png";
import { Link } from "react-router-dom";
import "./Home.css";

const product = {
  _id: 123,
  name: "Hsm",
  numOfReviews: 2,
  rating: 3.5,
  images: [
    {
      url: "https://st3.depositphotos.com/13349494/16859/i/600/depositphotos_168595652-stock-photo-t-shirt.jpg",
    },
  ],
  price: 34,
};

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, alert, error]);
  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <MetaData title="Shopify" />
          {/* Banner Container */}
          <div className="banner">
            <p>Welcome to Shopify</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>

            <h2 className="homeHeading">
              Featured Products
              <Link to="/search">
                <img className="searchImage" src={SearchImage} alt="Search" />
              </Link>
            </h2>
          </div>

          {/* Product Container */}
          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
