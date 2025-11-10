import { classes, useGlobalStore, type Class } from "../state";
import css from "./../styles/ClassBrowser.module.css";

export default function ClassDisplay() {
  const selectedClass = useGlobalStore((s) => s.selectedClass);
  const cls = selectedClass ? classes[selectedClass] : null;

  return (
    <div className={css.display}>
      <AddClassButton cls={cls} />
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

interface AddClassButtonProps {
  cls: Class | null;
}

function AddClassButton({ cls }: AddClassButtonProps) {
  const setClassToAdd = useGlobalStore((s) => s.setClassToAdd);
  const classToAdd = useGlobalStore((s) => s.classToAdd);

  return (
    <button
      className={css.addButton}
      onClick={() => {
        if (classToAdd) setClassToAdd(null);
        else if (cls) setClassToAdd(cls.number);
      }}
    >
      {classToAdd ? "Cancel" : "Add Class"}
    </button>
  );
}
