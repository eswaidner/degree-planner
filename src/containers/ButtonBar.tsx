import { useGlobalStore } from "../state"; 
import css from "./../styles/DegreePlanner.module.css";
import UploadDegreeBtn from "./UploadFileBtn";
import { useGlobalStore } from "../state";

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

function AddYearBtn() { 
	const addYear = useGlobalStore((s) => s.addYear); 
  return <button onClick={addYear} className={`btn ${css.btnBarButtons}`}> + Add Year</button> 
} 

function RemoveYearBtn() { 
	const removeYear = useGlobalStore((s) => s.removeYear); 
  return <button onClick={removeYear} className={`btn ${css.btnBarButtons}`}> - Remove Year</button>
} 

const ButtonBar: React.FC = () => {
  const uploadDegreeAudit = useGlobalStore((s) => s.uploadDegreeAudit);

  return (
    <div className={css.buttonBar}>
      <UploadDegreeBtn
        onFileSelected={(file) => {
          //TODO modal confirm
          file
            .text()
            .then(uploadDegreeAudit)
            .catch(() => {
              console.log("Error: failed to load file");
            });
        }}
      />
      <SelectDegreeBtn />
      <ExportPlanBtn />
      <ResetBtn />
      <AddYearBtn /> 
      <RemoveYearBtn /> 
    </div>
  );
};

export default ButtonBar;
