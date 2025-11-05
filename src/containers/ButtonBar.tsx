import React from "react";
import css from "./../styles/DegreePlanner.module.css";
import UploadDegreeBtn from "./UploadFileBtn";

function SelectDegreeBtn() {
  return (
    <button className={`btn ${css.btnBarButtons}`}>
      Degree: Computer Science (BS)
    </button>
  );
}

function ExportPlanBtn() {
  function handleClick() {
    alert("Export Degree Plan button clicked");
  }
  return (
    <button onClick={handleClick} className={`btn ${css.btnBarButtons}`}>
      Export Plan
    </button>
  );
}

function ResetBtn() {
  function handleClick() {
    alert("Reset button clicked");
  }
  return (
    <button onClick={handleClick} className={`btn ${css.btnBarButtons}`}>
      Reset
    </button>
  );
}

const ButtonBar: React.FC = () => {
  return (
    <div className={css.buttonBar}>
      <UploadDegreeBtn
        onFileSelected={(file) => {
          console.log("File:", file);
        }}
      />
      <SelectDegreeBtn />
      <ExportPlanBtn />
      <ResetBtn />
    </div>
  );
};

export default ButtonBar;
