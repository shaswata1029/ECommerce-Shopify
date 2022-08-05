import React from "react";
import { Link } from "react-router-dom";

import MetaData from "../layout/Metadata";

import { Typography } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  return (
    <>
      <div className="orderSuccess">
        <CheckCircleIcon />
        <MetaData title="Order Success" />

        <Typography>Your Order has been Placed successfully </Typography>
        <Link to="/orders">View Orders</Link>
      </div>
    </>
  );
};

export default OrderSuccess;
