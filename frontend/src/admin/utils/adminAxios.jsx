import axios from "axios";

const adminAxios = axios.create({
  baseURL: "https://api.ez-tix.com/admin",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Token untuk admin
  },
});

export default adminAxios;
