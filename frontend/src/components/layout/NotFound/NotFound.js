import React from "react";
import { Link } from "react-router-dom";

import ErrorIcon from "@material-ui/icons/Error";
import { Typography } from "@material-ui/core";

import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="PageNotFound">
      <ErrorIcon />

      <Typography>Page Not Found </Typography>
      <Link to="/">Home</Link>
    </div>
  );
};

export default NotFound;
