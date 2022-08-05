import "./App.css";
import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/layout/Header/Header.js";
import UserOptions from "./components/layout/Header/UserOptions";
import Footer from "./components/layout/Footer/Footer.js";
import ProductDetails from "./components/Product/ProductDetails";
import Products from "./components/Product/Products";
import Search from "./components/Product/Search";
import Home from "./components/Home/Home.js";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import LoginSignUp from "./components/User/LoginSignUp";
import Profile from "./components/User/Profile";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import Payment from "./components/Cart/Payment";
import OrderSucess from "./components/Cart/OrderSuccess";
import MyOrders from "./components/Order/MyOrders";
import OrderDetails from "./components/Order/OrderDetails";
import Dashboard from "./components/Admin/Dashboard";
import ProductList from "./components/Admin/ProductList";
import NewProduct from "./components/Admin/NewProduct";
import UpdateProduct from "./components/Admin/UpdateProduct";
import OrderList from "./components/Admin/OrderList";
import ProcessOrder from "./components/Admin/ProcessOrder";
import UsersList from "./components/Admin/UsersList";
import UpdateUser from "./components/Admin/UpdateUser";
import ProductReviews from "./components/Admin/ProductReviews";
import NotFound from "./components/layout/NotFound/NotFound";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import WebFont from "webfontloader";
import store from "./store";
import { loadUser } from "./actions/userAction";

const axios = require("axios");

function App() {
  const { isAuthenticated, user, error } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get(`/api/v1/payment/stripeapikey`);
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  return (
    <>
      <Router>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/products" element={<Products />} />
          <Route exact path="/products/:keyword" element={<Products />} />
          <Route exact path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<LoginSignUp />} />
          <Route exact path="/account" element={<ProtectedRoute />}>
            <Route exact path="/account" element={<Profile />} />
          </Route>
          <Route exact path="/me/update" element={<ProtectedRoute />}>
            <Route exact path="/me/update" element={<UpdateProfile />} />
          </Route>
          <Route exact path="/password/update" element={<ProtectedRoute />}>
            <Route exact path="/password/update" element={<UpdatePassword />} />
          </Route>
          <Route exact path="/password/forgot" element={<ForgotPassword />} />

          <Route
            exact
            path="/password/reset/:token"
            element={<ResetPassword />}
          />

          <Route exact path="/cart" element={<Cart />} />

          <Route exact path="/shipping" element={<ProtectedRoute />}>
            <Route exact path="/shipping" element={<Shipping />} />
          </Route>

          <Route exact path="/order/confirm" element={<ProtectedRoute />}>
            <Route exact path="/order/confirm" element={<ConfirmOrder />} />
          </Route>

          <Route exact path="/process/payment" element={<ProtectedRoute />}>
            <Route
              exact
              path="/process/payment"
              element={
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <Payment />
                </Elements>
              }
            />
          </Route>

          <Route exact path="/success" element={<ProtectedRoute />}>
            <Route exact path="/success" element={<OrderSucess />}></Route>
          </Route>

          <Route exact path="/orders" element={<ProtectedRoute />}>
            <Route exact path="/orders" element={<MyOrders />}></Route>
          </Route>

          <Route exact path="/order/:orderId" element={<ProtectedRoute />}>
            <Route
              exact
              path="/order/:orderId"
              element={<OrderDetails />}
            ></Route>
          </Route>

          <Route
            exact
            path="/admin/dashboard"
            element={<ProtectedRoute isAdmin={true} />}
          >
            <Route
              exact
              path="/admin/dashboard"
              element={<Dashboard />}
            ></Route>
          </Route>

          <Route
            exact
            path="/admin/products"
            element={<ProtectedRoute isAdmin={true} />}
          >
            <Route
              exact
              path="/admin/products"
              element={<ProductList />}
            ></Route>
          </Route>

          <Route
            exact
            path="/admin/product"
            element={<ProtectedRoute isAdmin={true} />}
          >
            <Route exact path="/admin/product" element={<NewProduct />}></Route>
          </Route>

          <Route
            exact
            path="/admin/product/:productId"
            element={<ProtectedRoute isAdmin={true} />}
          >
            <Route
              exact
              path="/admin/product/:productId"
              element={<UpdateProduct />}
            ></Route>
          </Route>

          <Route
            exact
            path="/admin/orders"
            element={<ProtectedRoute isAdmin={true} />}
          >
            <Route exact path="/admin/orders" element={<OrderList />}></Route>
          </Route>

          <Route
            exact
            path="/admin/order/:orderId"
            element={<ProtectedRoute isAdmin={true} />}
          >
            <Route
              exact
              path="/admin/order/:orderId"
              element={<ProcessOrder />}
            ></Route>
          </Route>

          <Route
            exact
            path="/admin/users"
            element={<ProtectedRoute isAdmin={true} />}
          >
            <Route exact path="/admin/users" element={<UsersList />}></Route>
          </Route>

          <Route
            exact
            path="/admin/user/:userId"
            element={<ProtectedRoute isAdmin={true} />}
          >
            <Route
              exact
              path="/admin/user/:userId"
              element={<UpdateUser />}
            ></Route>
          </Route>
          <Route
            exact
            path="/admin/reviews"
            element={<ProtectedRoute isAdmin={true} />}
          >
            <Route
              exact
              path="/admin/reviews"
              element={<ProductReviews />}
            ></Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </Router>
    </>
  );
}

export default App;
