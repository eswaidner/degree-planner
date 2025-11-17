import React from 'react';
import css from "./../styles/DegreePlanner.module.css";

// Check if selected element is of type File
interface Props {
    onFileSelected: (file: File) => void;
}


// If a file is selected (event.target.files?.[0]), verify through Props
// Have to clear <input> style (display: none) and override with <label>
export default function UploadDegreeBtn({ onFileSelected }: Props) {
    return (
        <div>
            <input
                type="file"
                accept='.html'
                id="upload-degree-input" /* reference */
                style={{ display: 'none' }}
                onChange={event => {
                /*If 1 file of type file is selected, set file var to selected file */
                if (event.target.files?.[0]) {
                    onFileSelected(event.target.files[0]);
                }
                }}
            />
            <label htmlFor="upload-degree-input" className={`btn ${css.btnBarButtons}`}>
                + Upload Degree Audit
            </label>
        </div>
    );
}