import React from 'react';
import css from "./../styles/DegreePlanner.module.css";
import ButtonBar from './ButtonBar';
import YearSchedule from './YearSchedule';

const DegreePlanner: React.FC = () => {
    return (
        <div className = {css.degreePlannerContainer}>
            <ButtonBar />
            <YearSchedule />
        </div>
    );
}

export default DegreePlanner;