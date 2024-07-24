import Cookies from "js-cookie";

export const setUserToken = (token, expiresInMinutes = 5) => {
  const expirationTime = new Date(
    new Date().getTime() + expiresInMinutes * 60 * 1000
  );
  Cookies.set("userToken", token, { expires: expiresInMinutes / 1440 });
  Cookies.set("tokenExpiration", expirationTime.toISOString());

  const event = new Event("userTokenChange");
  window.dispatchEvent(event);
};

export const checkTokenExpiration = () => {
  const tokenExpiration = Cookies.get("tokenExpiration");
  if (!tokenExpiration) {
    return true;
  }

  const expirationTime = new Date(tokenExpiration);
  return new Date() > expirationTime;
};
