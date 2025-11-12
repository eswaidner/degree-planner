import { useGlobalStore } from "../state"; 
import css from "./../styles/DegreePlanner.module.css";

function AddClassBtn() {
  function handleClick() {
    alert("Add Class Button Clicked");
  }
  return <button onClick={handleClick}>+ Add Class</button>;
}

function AddYearBtn() { 
	const addYear = useGlobalStore((s) => s.addYear); 
   return <button onClick={addYear}> + Add Additonal Year</button> 
}

function RemoveYearBtn(){ 
	const removeYear = useGlobalStore((s) => s.removeYear); 
   return <button onClick={removeYear}> - Remove Last Year</button>; 
}

function Semester({ semester }) { 
	const CLASS_SLOTS_PER_SEMESTER  = 6; 
	const classSlots = Array.from( { length: CLASS_SLOTS_PER_SEMESTER }, (_, i) => i); //name something different? 
  
 return (
	  <div className={css.semester}>
          	<h2><center>{semester}</center></h2> 
    	  	{classSlots.map(classSlot => ( 
			<AddClassBtn/> 
	  	))}
	  </div>
	); 
}

function Year({ year }) {
	const CLASS_SLOTS_PER_SEMESTER  = 6; 
	const classSlots = Array.from( { length: CLASS_SLOTS_PER_SEMESTER }, (_, i) => i); //name something different? 
  return (
    <div className={css.year}>
          <h2><center>{year}</center></h2>
	  <Semester semster={'Fall'}/> 
	  <Semester semester={'Spring'}/> 
    </div>
  );
}

const YearlySchedule: React.FC = () => {
	const startYear = useGlobalStore((s) => s.startYear);
        const numYears = useGlobalStore((s) => s.numYears);
	const years = Array.from( { length: numYears}, (_, i) 	=> startYear + i);

  return (
    <div className={css.yearlySchedule}>
      {years.map(year => ( 
        <div>
		<Year year={year} /> 
        </div>
      ))}
     <AddYearBtn/>
     <RemoveYearBtn/>  
    </div> 
  );
}
export default YearlySchedule;
