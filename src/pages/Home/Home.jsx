import React, { useCallback, useEffect, useState } from "react";
import { Dialog, DialogActions, Grid, Typography } from "@mui/material";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import StyledGrid from "../../components/StyledGrid";
import {
  deleteBookService,
  fetchAllBooksService,
} from "../../services/booksService";
import { useNavigate } from "react-router-dom";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import { normalize, notifyError, notifySuccess } from "../../utilities/helper";

const Home = () => {
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowData, setRowData] = useState([]);
  const [rowDataWithIds, setRowDataWithIds] = useState([]);
  const [rowLength, setRowLength] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchedValue, setSearchedValue] = useState("");
  const [bookDetails, setBookDetals] = useState({
    deletedId: null,
    name: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();

  const { deletedId, name } = bookDetails;

  useEffect(() => {
    getDataWithIds();
  }, [rowData]);

  //   Debounce the search input to avoid excessive filtering
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchedValue);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchedValue]);

  //   Logic for filtering the data based on the search input
  useEffect(() => {
    if (debouncedSearch && rowData && rowData.length > 0) {
      const normalizeSearched = normalize(debouncedSearch);
      const filteredData = rowData.filter(
        (row) =>
          normalize(row.title?.toLowerCase()).includes(normalizeSearched) ||
          normalize(row.author?.toLowerCase()).includes(normalizeSearched)
      );
      setRowDataWithIds(
        filteredData.map((row) => ({
          ...row,
          id: row._id,
        }))
      );
      setRowLength(filteredData.length);
    } else {
      getDataWithIds();
    }
  }, [debouncedSearch, rowData]);

  //   Function to handle search input changes
  const handleSearch = useCallback((e) => {
    setSearchedValue(e.target.value);
  }, []);

  useEffect(() => {
    fetchAllBooks();
  }, []);

  //   columns for the data grid
  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 250,
      renderHeader: () => <div className="grid-heading">{"Title"}</div>,
      renderCell: (params) => {
        const title = params.row.title;
        const id = params.row._id;
        return (
          <button
            className="edit-link-btn"
            onClick={() => {
              navigate("/add-update-books", {
                state: {
                  id: id,
                },
              });
            }}
          >
            {title}
          </button>
        );
      },
    },
    {
      field: "author",
      headerName: "Author",
      width: 250,
      renderHeader: () => <div className="grid-heading">{"Author"}</div>,
      renderCell: (params) => {
        const author = params.row.author;

        return <span className="data-font">{author}</span>;
      },
    },
    {
      field: "genre",
      headerName: "Genre",
      width: 250,
      renderHeader: () => <div className="grid-heading">{"Genre"}</div>,
      renderCell: (params) => {
        const genre = params.row.genre;

        return <span className="data-font">{genre}</span>;
      },
    },
    {
      field: "year",
      headerName: "Published Year",
      width: 250,
      renderHeader: () => (
        <div className="grid-heading">{"Published Year"}</div>
      ),
      renderCell: (params) => {
        const year = params.row.year;
        return <span className="data-font">{year}</span>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 250,
      renderHeader: () => <div className="grid-heading">{"Status"}</div>,
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <span className="data-font">
            {status == "issued" ? "Issued" : "Available"}
          </span>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderHeader: () => <div className="grid-heading">{"Action"}</div>,
      renderCell: (params) => {
        const id = params.row._id;
        const title = params.row.title;
        return (
          <>
            <button
              className="grid-edit-btn"
              onClick={() => {
                setShowConfirmModal(true);
                setBookDetals({ deletedId: id, name: title });
              }}
            >
              <DeleteOutlineOutlined sx={{ color: "white" }} />
            </button>
          </>
        );
      },
    },
  ];

  //   Function to fetch all books from the service
  const fetchAllBooks = async () => {
    try {
      setLoad(true);
      const res = await fetchAllBooksService();
      setRowData(res.data);
      setRowLength(res.data.length);
      setLoad(false);
      console.log(res);
    } catch (err) {
      setLoad(false);
      console.error("Error fetching books:", err);
    }
  };

  //   Function to handle the delete action
  const handleDelete = async () => {
    try {
      setLoad(true);
      const res = await deleteBookService(deletedId);
      if (res?.status == 200) {
        setBookDetals({
          deletedId: null,
          name: "",
        });
        setShowConfirmModal(false);
        setLoad(false);
        notifySuccess("Book deleted successfully");
        fetchAllBooks();
      }
    } catch (err) {
      setLoad(false);
      console.log(err?.message);
      setShowConfirmModal(false);
      setBookDetals({
        deletedId: null,
        name: "",
      });
      fetchAllBooks();
      notifyError(err?.message || "Failed to delete book");
    }
  };

  //   Function to get data with unique IDs for each row
  //   This is necessary for the data grid to function correctly as the data what we are getting from api has _id where as mui data grid required id column for unique identification
  const getDataWithIds = () => {
    if (rowData && rowData.length > 0) {
      const updatedRowData = rowData.map((row, index) => ({
        ...row,
        id: row._id, // Assigning a unique ID based on the index
      }));
      setRowDataWithIds(updatedRowData);
      setRowLength(updatedRowData.length);
    } else {
      setRowDataWithIds([]);
    }
  };

  return (
    <>
      <h2 className="main-heading">Book Management App</h2>
      <div className="content-body">
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%", margin: "0 auto 2%" }}
        >
          <Grid item md={4}></Grid>
          <Grid item md={8}>
            <div className="search-bar-container">
              <SearchBar
                searchedValue={searchedValue}
                handleSearch={handleSearch}
                placeholder={"Book"}
              />

              <button
                className="create-btn"
                onClick={() => {
                  navigate("/add-update-books");
                }}
              >
                Add New Book
              </button>
            </div>
          </Grid>
        </Grid>
        {load ? (
          <Loader />
        ) : (
          <StyledGrid
            rows={rowDataWithIds}
            columns={columns}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            length={rowLength}
          ></StyledGrid>
        )}
      </div>

      {/* Modal Component */}

      {showConfirmModal && (
        <Dialog
          open={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
        >
          <div
            style={{
              width: "400px",
              padding: "20px",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Delete Book Detail
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to delete <strong>{name}</strong> detail ?
            </Typography>
          </div>
          <DialogActions>
            <button
              className="create-btn"
              style={{ width: "120px" }}
              onClick={handleDelete}
            >
              Yes
            </button>
            <button
              className="btn-outlined"
              style={{ width: "120px" }}
              onClick={() => setShowConfirmModal(false)}
            >
              No
            </button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default Home;
