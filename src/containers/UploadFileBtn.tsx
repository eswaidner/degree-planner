import React from 'react';
import css from "./../styles/DegreePlanner.module.css";

// COMMENT HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
interface Props {
    onFileSelected: (file: File) => void;
}


// COMMENT HERE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export default function UploadDegreeBtn({ onFileSelected }: Props) {
    return (
        <div>
            <input
                type="file"
                id="upload-degree-input"
                style={{ display: 'none' }}
                onChange={event => {
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