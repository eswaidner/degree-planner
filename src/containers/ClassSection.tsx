import React from 'react';
import css from "./../styles/ClassSection.module.css";
import ClassTop from './ClassTop';
import ClassBottom from './ClassBottom';

const ClassSection: React.FC = () => {
    return (
        <div className = {css.classSectionContainer}>
            <ClassTop />
            <ClassBottom />
        </div>
    );
}

export default ClassSection;