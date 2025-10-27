import React from 'react';
import css from "./../styles/DegreePlanner.module.css";

function UploadDegreeBtn() {
    function handleClick() {
        alert('Upload Degree Audit button clicked');
    }
    return (
        <button onClick={handleClick}>
            + Upload Degree Audit
        </button>
    )
}

function SelectDegreeBtn() {
    // function handleClick() {
    //     alert('Export Degree Plan button clicked');
    // }
    // return (
    //     // <button class="dropdown" onClick={handleClick}>Degree: Undeclared</button>
    //     // <div>
    //     //     <p></p>
    //     // </div>
    // )
}

function ExportPlanBtn() {
    function handleClick() {
        alert('Export Degree Plan button clicked');
    }
    return (
        <button onClick={handleClick}>
            Export Plan
        </button>
    )
}

function ResetBtn() {
    function handleClick() {
        alert('Reset button clicked');
    }
    return (
        <button onClick={handleClick}>
            Reset
        </button>
    )
}

const ButtonBar: React.FC = () => {
    return (
        <div className = {css.buttonBar}>
            <UploadDegreeBtn /> <ExportPlanBtn /> <ResetBtn />
        </div>
    );
}

export default ButtonBar;