import axios from "axios";

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
    timeout: 1000,
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
  // .. other options
});

export default instance;
