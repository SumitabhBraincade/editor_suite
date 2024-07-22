import React, { useEffect } from "react";
import "./GoogleSignin.css";
// import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "../Utils/axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const GoogleSingin = () => {
  const userToken = Cookies.get("userToken");

  const handleCredentialResponse = (response) => {
    const data = jwtDecode(response.credential);
    loginUser(data);
  };

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id:
        "968282926242-n3sq6dn3c6cvdknf10f5hosj6vg013cl.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { theme: "filled_blue", size: "large" }
    );
    window.google.accounts.id.prompt();
  }, []);

  const loginUser = async (data) => {
    try {
      const response = await axiosInstance.post("/user/verify", {
        profileId: data.sub,
        name: data.name,
        email: data.email,
        profileImage: data.picture,
      });

      const userToken = response.data.data.id;
      console.log(userToken);
      Cookies.set("userToken", userToken, { expires: 0.5 });
    } catch (error) {
      console.error("Error during API call", error.response.data);
    }
  };

  return <div id="google-signin-button" className="g-signin2"></div>;
};

export default GoogleSingin;
