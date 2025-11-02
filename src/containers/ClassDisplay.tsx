import { classes, useGlobalStore } from "../state";
import css from "./../styles/ClassBrowser.module.css";

export default function ClassDisplay() {
  const hoveredClass = useGlobalStore((s) => s.hoveredClass);
  const cls = hoveredClass ? classes[hoveredClass] : null;

  return (
    <div className={css.display}>
      <h2>
        {cls?.number} - {cls?.name}
      </h2>
      {cls?.prereqs && <div>Prer. {cls.prereqs}</div>}
      {cls?.coreqs && <div>Coreq. {cls.coreqs}</div>}
      <div>{cls?.description}</div>
      <div>Semesters Offered: {cls?.offered}</div>
    </div>
  );
}
