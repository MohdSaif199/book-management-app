import { alpha, Box, createTheme, styled, ThemeProvider } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";

const StyledGrid = ({
  rows,
  columns,
  page,
  setPage,
  pageSize,
  setPageSize,
  length,
}) => {
  const EVEN_OPACTIY = 0.4;

  // Create a custom theme for the DataGrid
  const getMuiTheme = createTheme({
    typography: {
      fontSize: 12,
    },
    ".css-1x51dt5-MuiInputBase-input-MuiInput-input": {
      color: "#000000 !important",
    },
  });

  // Styled DataGrid with striped rows and custom header styles
  // Using styled from MUI to create a custom DataGrid component
  // The striped rows will have alternating background colors for better readability
  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: "rgba(203, 251, 255, 0.26)",
      "&:hover, &.Mui-hovered": {
        backgroundColor: "rgb(219, 238, 240)",
        "@media (hover: none)": {
          backgroundColor: "transparent",
        },
      },
    },
    [`& .${gridClasses.row}`]: {
      backgroundColor: "white",
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(theme.palette.grey["100"], EVEN_OPACTIY),
        "@media (hover: none)": {
          backgroundColor: "transparent",
        },
      },
    },
  }));

  return (
    <Box
      sx={{
        height: "auto",
        width: "100%",
        display: "flex",
        boxShadow: "5px 5px 10px #CCC",
        borderRadius: "15px",
      }}
    >
      <ThemeProvider theme={getMuiTheme}>
        <StripedDataGrid
          className="data-grid"
          rows={rows}
          columns={columns}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "red",
              color: "#fff",
              fontWeight: "bold",
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          pagination
          paginationMode="client"
          rowCount={length}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          rowHeight={38}
          disableSelectionOnClick
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
        />
      </ThemeProvider>
    </Box>
  );
};

export default StyledGrid;
