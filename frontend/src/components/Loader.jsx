import React from "react";

const Loader = ({ color, size, border }) => {
  const options = {
    borderColor: `${color} transparent ${color} transparent`,
    width: `${size}px`,
    height: `${size}px`,
    borderWidth: `${border}px`,
  };
  return <div className="btnLoader" style={options}></div>;
};

export default Loader;
