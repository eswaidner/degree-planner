import { classes, useGlobalStore, type Class } from "../state";
import css from "./../styles/ClassBrowser.module.css";

export default function ClassDisplay() {
  const selectedClass = useGlobalStore((s) => s.selectedClass);
  const cls = selectedClass ? classes[selectedClass] : null;

  if (!cls) {
    return <div className={css.display}>Select a class to see details</div>;
  }

  return (
    <div className={css.display}>
      <AddClassButton cls={cls} />
      <h2>
        {cls.number} - {cls.name}
      </h2>
      {cls.prereqs && (
        <div>
          <span className={css.bold}>Prer. </span>
          {cls.prereqs}
        </div>
      )}
      {cls.coreqs && (
        <div>
          <span className={css.bold}>Coreq. </span>
          {cls.coreqs}
        </div>
      )}
      <div>{cls.description}</div>
      <div>
        <span className={css.bold}>Semesters Offered: </span>
        {cls.offered}
      </div>
    </div>
  );
}

interface AddClassButtonProps {
  cls: Class | null;
}

function AddClassButton({ cls }: AddClassButtonProps) {
  const setClassToAdd = useGlobalStore((s) => s.setClassToAdd);
  const classToAdd = useGlobalStore((s) => s.classToAdd);
  const selectedClassSlotIndex = useGlobalStore(
    (s) => s.selectedClassSlotIndex,
  );
  const classSlots = useGlobalStore((s) => s.classSlots);
  const setClassSlot = useGlobalStore((s) => s.setClassSlot);
  const setSelectedClass = useGlobalStore((s) => s.setSelectedClass);

  const fromSlot = selectedClassSlotIndex != null;
  const classSlot = fromSlot ? classSlots[selectedClassSlotIndex] : null;
  const fromAudit = classSlot?.auditSemester != null;

  if (fromSlot && !fromAudit) {
    return (
      <button
        className={css.addButton}
        onClick={() => {
          if (selectedClassSlotIndex !== null) {
            setClassSlot(selectedClassSlotIndex, null);
            setSelectedClass(null);
          }
        }}
      >
        Remove Class
      </button>
    );
  }
  return (
    <button
      className={css.addButton}
      onClick={() => {
        if (classToAdd) setClassToAdd(null);
        else if (cls) setClassToAdd(cls.number);
      }}
      disabled={fromSlot && fromAudit}
    >
      {classToAdd ? "Cancel" : "Add Class"}
    </button>
  );
}
