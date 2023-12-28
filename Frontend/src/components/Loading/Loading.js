import React from "react";
import "./loading.css";
const Loading = (prop) => {
  const isCustomClass = prop.isTable ? "vw-80" : "vw-98";
  return (
    <div
      className={
        prop.noContainer ? "container3" : `container2 ${isCustomClass}`
      }
    >
      <div className="loader2">
        <div className="loader--dot"></div>
        <div className="loader--dot"></div>
        <div className="loader--dot"></div>
        <div className="loader--dot"></div>
        <div className="loader--dot"></div>
        <div className="loader--dot"></div>
        <div className="loader--text"></div>
      </div>
    </div>
  );
};

export default Loading;
