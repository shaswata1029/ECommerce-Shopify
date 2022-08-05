import React, { useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { clearErrors, getProduct } from "../../actions/productAction";

import { Link } from "react-router-dom";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/Metadata";
import ProductCard from "../Home/ProductCard";

import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const categories = [
  "All",
  "Electronics",
  "SmartPhone",
  "Camera",
  "Laptop",
  "Footwear",
  "Attire",
  "Grocery",
  "Stationery",
];

const minPrice = 0;
const maxPrice = 200000;
const minRating = 0;
const maxRating = 5;

const Products = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([minPrice, maxPrice]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const {
    products,
    productsCount,
    filteredProductsCount,
    resultsPerPage,
    loading,
    error,
  } = useSelector((state) => state.products);

  const count = filteredProductsCount;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <MetaData title="PRODUCTS -- SHOPIFY" />
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="filterBox">
            <Link to="/search">
              <Button variant="outlined" className="buttonOutline">
                Search
              </Button>
            </Link>
            <p></p>
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={minPrice}
              max={maxPrice}
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() =>
                    setCategory(category === "All" ? "" : category)
                  }
                >
                  {category}
                </li>
              ))}
            </ul>

            <Typography component="legend">Ratings Above</Typography>
            <Slider
              value={ratings}
              onChange={(e, newRating) => {
                setRatings(newRating);
              }}
              aria-labelledby="continuous-slider"
              valueLabelDisplay="auto"
              min={minRating}
              max={maxRating}
            />
          </div>
          {resultsPerPage < count && (
            <>
              <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultsPerPage}
                  totalItemsCount={count}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="1st"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Products;
