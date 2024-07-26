import React, { useEffect } from "react";
import "./GoogleSignin.css";
import axiosInstance from "../Utils/axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { setUserToken } from "../Utils/auth";

const GoogleSingin = () => {
  const handleCredentialResponse = (response) => {
    const data = jwtDecode(response.credential);
    loginUser(data);
  };

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            "176264459907-6gi9nidg2mb0bp3kq40bruueg7061opg.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "filled_blue", size: "large" }
        );
        window.google.accounts.id.prompt();
      } else {
        console.error("Google Sign-In script not loaded.");
      }
    };

    if (document.readyState === "complete") {
      initializeGoogleSignIn();
    } else {
      window.addEventListener("load", initializeGoogleSignIn);
    }

    return () => {
      window.removeEventListener("load", initializeGoogleSignIn);
    };
  }, []);

  const loginUser = async (data) => {
    console.log(data);
    try {
      const response = await axiosInstance.post("/user/verify", {
        accountType: "google",
        accountId: data.sub,
        name: data.name,
        email: data.email,
        profileImage: data.picture,
      });

      // const userToken = response.data.data.profileId;
      // setUserToken(userToken);
    } catch (error) {
      console.error("Error during API call", error.response.data);
    }
  };

  return <div id="google-signin-button" className="g-signin2"></div>;
};

export default GoogleSingin;
