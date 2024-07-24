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

  const handleSignInClick = () => {
    window.google.accounts.id.prompt();
  };

  const loginUser = async (data) => {
    try {
      const response = await axiosInstance.post("/user/verify", {
        profileId: data.sub,
        name: data.name,
        email: data.email,
        profileImage: data.picture,
      });

      const userToken = response.data.data.id;
      setUserToken(userToken);
    } catch (error) {
      console.error("Error during API call", error.response.data);
    }
  };

  return (
    <button
      onClick={handleSignInClick}
      className="w-full h-[40px] rounded-lg text-white font-semibold font-sans"
      style={{
        background:
          "radial-gradient(66.32% 116.23% at 48.37% 13.1%, #FF8956 0%, #FF4D00 100%)",
      }}
    >
      Sign In
    </button>
  );
};

export default GoogleSingin;
