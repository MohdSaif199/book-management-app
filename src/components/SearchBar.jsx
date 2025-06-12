import { SearchSharp } from "@mui/icons-material";
import { InputBase, Paper } from "@mui/material";
import React from "react";

const SearchBar = React.memo(({ handleSearch, placeholder, searchedValue }) => {
  return (
    <Paper
      sx={{
        p: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "400px",
      }}
    >
      <SearchSharp style={{ width: 20, height: 20 }} />
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: 16 }}
        value={searchedValue}
        placeholder={`Search ${placeholder}`}
        inputProps={{ "aria-label": `search ${placeholder}` }}
        onChange={handleSearch}
      />
    </Paper>
  );
});

export default SearchBar;
