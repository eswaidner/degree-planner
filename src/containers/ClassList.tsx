import React from 'react';
import css from "./../styles/ClassSection.module.css";

const ClassList: React.FC = () => {
    return (
        <div className = {css.classList}>
            <h2>List</h2>
        </div>
    );
}

export default ClassList;