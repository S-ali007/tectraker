import axios from "axios";

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://tectraker-production.up.railway.app/"
    : "http://localhost:3000/";

const createInstance = (baseUrl) => {
  const instance = axios.create({
    baseURL: baseUrl,
    headers: { "Content-Type": "application/json" },
  });
  return instance;
};

export default createInstance(API_URL);
  