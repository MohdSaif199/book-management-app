import React from "react";
import { BeatLoader } from "react-spinners";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <BeatLoader color="#3661eb" />
    </div>
  );
};

export default Loader;
