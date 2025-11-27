import css from "./../styles/DegreePlanner.module.css";
import m_css from "./../styles/Modal.module.css";
import { useGlobalStore } from "../state";

// Check if selected element is of type File
interface Props {
  onFileSelected: (file: File) => void;
}

// If a file is selected (event.target.files?.[0]), verify through Props
// Have to clear <input> style (display: none) and override with <label>
export default function UploadDegreeBtn({ onFileSelected }: Props) {
  const setModalContent = useGlobalStore((s) => s.setModalContent);

  return (
    <div>
      <input
        type="file"
        accept=".html"
        id="upload-degree-input" /* reference for reading file in fileInput */
        style={{ display: "none" }}
        onChange={(event) => {
          /*If 1 file of type file is selected, set file var to selected file */
          const file = event.target.files?.[0];

          if (file) {
            if (file.size === 0) {
              setModalContent(
                "emptyFileWarning",
                <div>
                  <h2>Warning: Empty File</h2>
                  <div className={m_css.modalRow}>
                    <button
                      className={`btn ${m_css.modalBtn}`}
                      onClick={() => {
                        setModalContent("emptyFileWarning", null);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>,
              );

              console.log("File is empty");
              return;
            }

            onFileSelected(file);
          } // if file END
        }}
      />
      <label
        htmlFor="upload-degree-input"
        className={`btn ${css.btnBarButtons}`}
      >
        + Upload Degree Audit
      </label>
    </div>
  );
}
