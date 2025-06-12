import axios from "axios";
const api = process.env.REACT_APP_API_URL;

export const fetchAllBooksService = async () => {
  try {
    return axios.get(`${api}/books`);
  } catch (err) {
    return err;
  }
};

export const addNewBookService = async (data) => {
  try {
    return axios.post(`${api}/books`, data);
  } catch (err) {
    return err;
  }
};

export const updateBookService = async (data, id) => {
  try {
    return axios.put(`${api}/books/${id}`, data);
  } catch (err) {
    return err;
  }
};

export const deleteBookService = async (id) => {
  try {
    return axios.delete(`${api}/books/${id}`);
  } catch (err) {
    return err;
  }
};

export const fetchBookByIdService = async (id) => {
  try {
    return axios.get(`${api}/books/${id}`);
  } catch (err) {
    return err;
  }
};
