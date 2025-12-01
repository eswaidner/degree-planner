import css from "./../styles/DegreePlanner.module.css";
import ButtonBar from "./ButtonBar";
import YearSchedule from "./YearSchedule";

export default function DegreePlanner() {
  return (
    <div className={css.degreePlannerContainer}>
      <ButtonBar />
      <YearSchedule />
    </div>
  );
}
