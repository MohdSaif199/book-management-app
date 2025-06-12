import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../components/Loader";
import { Box, Grid } from "@mui/system";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuItem, Select, TextField } from "@mui/material";
import { notifyError, notifySuccess } from "../../utilities/helper";
import {
  addNewBookService,
  fetchBookByIdService,
  updateBookService,
} from "../../services/booksService";

const AddUpdateBooks = () => {
  const id = useLocation()?.state?.id;

  const [load, setLoad] = useState(false);

  const navigate = useNavigate();

  // Validation schema for the form
  const createBookSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    author: yup.string().required("Author is required"),
    genre: yup.string().required("Genre is required"),
    year: yup
      .string()
      .required("Year is required")
      .max(4, "Year must be at most 4 characters long"),
    status: yup.string().required("Status is required"),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createBookSchema),
    defaultValues: {
      author: "",
      genre: "",
      year: "",
      status: "",
      title: "",
    },
  });

  const yearRegister = register("year");

  useEffect(() => {
    if (id) {
      getBookById(id);
    }
  }, [id]);

  // Function to fetch book details by ID
  const getBookById = async (id) => {
    setLoad(true);
    try {
      const res = await fetchBookByIdService(id);
      const data = res.data;
      if (res?.status == 200) {
        setLoad(false);
        reset({
          author: data.author,
          genre: data.genre,
          year: data.year,
          status: data.status,
          title: data.title,
        });
      }
    } catch (err) {
      setLoad(false);
      console.log(err.message);
      notifyError(err.message);
    }
  };

  // Function to add or update book details on the basis of the ID
  // If ID is present, it updates the book; otherwise, it adds a new book
  const addUpdateBook = async (data) => {
    setLoad(true);
    try {
      if (!id) {
        const res = await addNewBookService(data);
        if (res?.status == 201) {
          setLoad(false);
          notifySuccess("Book Added successfully !");
          reset();
          navigate("/");
        }
      } else {
        const res = await updateBookService(data, id);
        if (res?.status == 200) {
          setLoad(false);
          reset();
          navigate("/");
        }
      }
    } catch (err) {
      setLoad(false);
      console.log(err.message);
      notifyError(err.message);
    }
  };

  return (
    <div className="content-body">
      {load ? (
        <Loader />
      ) : (
        <>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%", margin: "0 auto" }}
          >
            <Grid item md={12}>
              <p className="page-heading">Book Details</p>
            </Grid>
          </Grid>
          <Box
            component="form"
            autoComplete="off"
            sx={{ height: "auto", width: "100%" }}
            onSubmit={handleSubmit(addUpdateBook)}
          >
            <Grid
              container
              alignItems="center"
              justifyContent={"space-between"}
              sx={{ width: "100%", margin: "0 auto" }}
              gap={1}
            >
              <Grid size={{ xl: 5, md: 5, lg: 5, sm: 12, xs: 12 }}>
                <div>
                  <p className="labelStyles">
                    Title
                    <span>*</span>
                  </p>
                  <TextField
                    size="small"
                    fullWidth
                    type={"text"}
                    {...register("title")}
                  />
                </div>
                {errors.title && (
                  <div className="error-container">{errors.title.message}</div>
                )}
              </Grid>
              <Grid size={{ xl: 5, md: 5, lg: 5, sm: 12, xs: 12 }}>
                <div>
                  <p className="labelStyles">
                    Author
                    <span>*</span>
                  </p>
                  <TextField
                    size="small"
                    fullWidth
                    type={"text"}
                    {...register("author")}
                  />
                </div>
                {errors.author && (
                  <div className="error-container">{errors.author.message}</div>
                )}
              </Grid>

              <Grid size={{ xl: 5, md: 5, lg: 5, sm: 12, xs: 12 }}>
                <div>
                  <p className="labelStyles">
                    Genre
                    <span>*</span>
                  </p>
                  <TextField
                    size="small"
                    fullWidth
                    type={"text"}
                    {...register("genre")}
                  />
                </div>
                {errors.genre && (
                  <div className="error-container">{errors.genre.message}</div>
                )}
              </Grid>

              <Grid size={{ xl: 5, md: 5, lg: 5, sm: 12, xs: 12 }}>
                <div>
                  <p className="labelStyles">
                    Published Year
                    <span>*</span>
                  </p>
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    {...yearRegister}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length > 4) value = value.slice(0, 4);
                      e.target.value = value;
                      yearRegister.onChange(e);
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
                {errors.year && (
                  <div className="error-container">{errors.year.message}</div>
                )}
              </Grid>
              <Grid size={{ xl: 5, md: 5, lg: 5, sm: 12, xs: 12 }}>
                <div>
                  <p className="labelStyles">
                    Status
                    <span>*</span>
                  </p>
                  <Controller
                    name="status"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        id="status"
                        fullWidth
                        size="small"
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        {...field}
                        value={field.value || ""}
                      >
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="issued">Issued</MenuItem>
                      </Select>
                    )}
                  />
                </div>
                {errors.status && (
                  <div className="error-container">{errors.status.message}</div>
                )}
              </Grid>
            </Grid>

            <Grid
              alignItems={"end"}
              justifyContent="end"
              container
              gap={3}
              sx={{ marginTop: "2%" }}
            >
              <Grid item md={6}>
                <button
                  type="button"
                  className="btn-outlined"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                  }}
                >
                  Back
                </button>
              </Grid>
              <Grid item md={6}>
                <button type="submit" className={"create-btn"}>
                  {id ? "Update" : "Save"}
                </button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </div>
  );
};

export default AddUpdateBooks;
