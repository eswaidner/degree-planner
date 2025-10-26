import React from 'react';
import css from "./../App.module.css";
import ClassList from "./ClassList"
import ClassFilters from './ClassFilters';

const ClassTop: React.FC = () => {
    return (
        <div className = {css.classTopSection}>
            <ClassList />
            <ClassFilters />
        </div>
    );
}

export default ClassTop;