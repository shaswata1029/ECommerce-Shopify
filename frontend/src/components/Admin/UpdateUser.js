import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/Metadata";
import SideBar from "./Sidebar";

import {
  getUserDetails,
  updateUser,
  clearErrors,
} from "../../actions/userAction";

import { UPDATE_USER_RESET } from "../../constants/userConstants";

import { Button } from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonIcon from "@material-ui/icons/Person";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const alert = useAlert();

  const { loading, error, user } = useSelector((state) => state.userDetails);

  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("User Updated Successfully");
      navigate("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
      dispatch(getUserDetails(userId));
    }
  }, [dispatch, alert, error, isUpdated, updateError, user, userId, navigate]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUser(userId, myForm));
  };

  return (
    <>
      <MetaData title="Update User" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="dashboard">
            <SideBar />

            <div className="newProductContainer">
              <form
                className="createProductForm"
                onSubmit={updateUserSubmitHandler}
              >
                <h1>Update User</h1>

                <div>
                  <PersonIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    value={name}
                    readOnly
                  />
                </div>
                <div>
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    readOnly
                  />
                </div>

                <div>
                  <VerifiedUserIcon />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Choose Role</option>
                    <option value="admin">Admin</option>
                    {user.role === "user" && <option value="user">User</option>}
                  </select>
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={
                    updateLoading ? true : false || role === "" ? true : false
                  }
                >
                  Update
                </Button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateUser;
