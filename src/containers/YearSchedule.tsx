import React from "react";
import css from "./../styles/DegreePlanner.module.css";

function AddClassBtn() {
  function handleClick() {
    alert("Add Class Button Clicked");
  }
  return <button onClick={handleClick}>+ Add Class</button>;
}

function RemoveYearBtn() {
  function handleClick() {
    alert("Remove Year Button CLicked");
  }
  return <button onClick={handleClick}>-</button>;
}

function Semester() {
  return (
    <div className={css.semester}>
      <h2>
        <center>Fall</center>
      </h2>
      <AddClassBtn /> <AddClassBtn /> <AddClassBtn />
      <AddClassBtn /> <AddClassBtn /> <AddClassBtn />
    </div>
  );
}

function YearHeader() {
  return (
    <div className={css.header}>
      <h2>
        <center>2024</center>
      </h2>
      <RemoveYearBtn />
    </div>
  );
}

function Year() {
  return (
    <div className={css.year}>
      <YearHeader />
      <Semester /> <Semester />
    </div>
  );
}

const YearSchedule: React.FC = () => {
  return (
    <div className={css.yearlySchedule}>
      <Year /> <Year /> <Year /> <Year />
    </div>
  );
};

export default YearSchedule;
