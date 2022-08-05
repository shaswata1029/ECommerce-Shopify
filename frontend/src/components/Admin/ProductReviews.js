import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/Metadata";
import SideBar from "./Sidebar";
import { DataGrid } from "@material-ui/data-grid";

import {
  clearErrors,
  getAllReviews,
  deleteReviews,
} from "../../actions/productAction";

import { DELETE_REVIEW_RESET } from "../../constants/productConstants";

import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Star from "@material-ui/icons/Star";
import "./ProductReviews.css";

const ProductReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.review
  );

  const { loading, reviews, error } = useSelector(
    (state) => state.productReviews
  );

  const [productId, setProductId] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Review Deleted Successfully");
      navigate("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
      dispatch(getAllReviews(productId));
    }
  }, [dispatch, alert, error, deleteError, navigate, isDeleted, productId]);

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();

    if (productId.length !== 24) {
      alert.error("Product ID must be 24 characters long");
      return;
    }

    dispatch(getAllReviews(productId));
  };

  const deleteReviewHandler = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?"))
      dispatch(deleteReviews(reviewId, productId));
  };

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

    {
      field: "user",
      headerName: "User",
      minWidth: 200,
      flex: 0.6,
    },

    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
      flex: 1,
    },

    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 180,
      flex: 0.4,

      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "greenColor"
          : "redColor";
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() =>
                deleteReviewHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
      });
    });

  return (
    <>
      <MetaData title={`ALL REVIEWS - Admin`} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="dashboard">
            <SideBar />
            <div className="productReviewsContainer">
              <form
                className="productReviewsForm"
                onSubmit={productReviewsSubmitHandler}
              >
                <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

                <div>
                  <Star />
                  <input
                    type="text"
                    placeholder="Product Id"
                    required
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  />
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={
                    loading ? true : false || productId === "" ? true : false
                  }
                >
                  Search
                </Button>
              </form>

              {reviews && reviews.length > 0 ? (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  disableSelectionOnClick
                  className="productListTable"
                  autoHeight
                />
              ) : (
                <h1 className="productReviewsFormHeading">No Reviews Found</h1>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductReviews;
