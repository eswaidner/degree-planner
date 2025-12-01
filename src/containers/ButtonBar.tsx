import css from "./../styles/DegreePlanner.module.css";
import UploadDegreeBtn from "./UploadFileBtn";
import { useGlobalStore } from "../state";
import ResetButton from "./ResetButton";

export default function ButtonBar() {
  const uploadDegreeAudit = useGlobalStore((s) => s.uploadDegreeAudit);

  return (
    <div className={css.buttonBar}>
      <UploadDegreeBtn
        onFileSelected={(file) => {
          file
            .text()
            .then(uploadDegreeAudit)
            .catch(() => {
              console.log("Error: failed to load file");
            });
        }}
      />
      <SelectDegreeBtn />
      <ResetButton />
      <AddYearBtn />
      <RemoveYearBtn />
    </div>
  );
}

function SelectDegreeBtn() {
  return (
    <button className={`btn ${css.btnBarButtons}`}>
      Degree: Computer Science (BS)
    </button>
  );
}

function AddYearBtn() {
  const addYear = useGlobalStore((s) => s.addYear);
  return (
    <button onClick={addYear} className={`btn ${css.btnBarButtons}`}>
      {" "}
      + Add Year
    </button>
  );
}

function RemoveYearBtn() {
  const removeYear = useGlobalStore((s) => s.removeYear);
  return (
    <button onClick={removeYear} className={`btn ${css.btnBarButtons}`}>
      {" "}
      - Remove Year
    </button>
  );
}
