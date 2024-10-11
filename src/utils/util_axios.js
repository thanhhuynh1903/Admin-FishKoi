import axios from "axios";

const MASTER_URL = "https://fengshuikoiapi.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: MASTER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("e_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apost = async (path, data) => {
  try {
    const response = await axiosInstance.post(path, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const apostfile = async (path, selectedFile, dataObject) => {
  const formData = new FormData();
  formData.append("file", selectedFile);
  Object.entries(dataObject).forEach(([key, value]) => {
    formData.append(key, value);
  });

  try {
    const response = await axiosInstance.post(path, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const aget = async (path) => {
  try {
    const response = await axiosInstance.get(path);
    return response;
  } catch (error) {
    throw error;
  }
};

export const adelete = async (path) => {
  try {
    const response = await axiosInstance.delete(path);
    return response;
  } catch (error) {
    throw error;
  }
};

export const aupdate = async (path, data) => {
  try {
    const response = await axiosInstance.put(path, data);
    return response;
  } catch (error) {
    throw error;
  }
};
