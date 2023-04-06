import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

const Router = ({ refreshUser, isLoggedIn, userObj }) => {
  //const isLoggedIn = true;
  return (
    <>
      {" "}
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home userObj={userObj} />} />
            <Route
              path="/profile"
              element={<Profile userObj={userObj} refreshUser={refreshUser} />}
            />
          </>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </>
  );
};

export default Router;
