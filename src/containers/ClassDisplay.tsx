import { PiWarningBold } from "react-icons/pi";
import { classes, useGlobalStore, type Class } from "../state";
import css from "./../styles/ClassBrowser.module.css";
import { isClassOfferedInSemester, isDuplicateClass } from "../utils";

export default function ClassDisplay() {
  const selectedClass = useGlobalStore((s) => s.selectedClass);
  const selectedClassSlotIndex = useGlobalStore(
    (s) => s.selectedClassSlotIndex,
  );
  const classSlots = useGlobalStore((s) => s.classSlots);
  const cls = selectedClass ? classes[selectedClass] : null;

  if (!cls) {
    return <div className={css.display}>Select a class to see details</div>;
  }

  let duplicateWarning = false;
  let semesterWarning = false;

  if (selectedClass !== null && selectedClassSlotIndex !== null) {
    duplicateWarning = isDuplicateClass(selectedClass, classSlots);

    if (!classSlots[selectedClassSlotIndex]?.auditSemester) {
      semesterWarning = !isClassOfferedInSemester(
        selectedClass,
        selectedClassSlotIndex,
      );
    }
  }

  const showWarnings = duplicateWarning || semesterWarning;

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
      {showWarnings && (
        <div className={css.warnings}>
          {duplicateWarning && (
            <Warning
              title="Duplicate Class"
              description="This class already exists in the degree plan."
            />
          )}
          {semesterWarning && (
            <Warning
              title="Not Offered"
              description="This class is not typically offered during this semester."
            />
          )}
        </div>
      )}
    </div>
  );
}

interface WarningProps {
  title: string;
  description: string;
}

function Warning({ title, description }: WarningProps) {
  return (
    <div className={css.warning}>
      <PiWarningBold className={css.warningIcon} size={20} />
      <div className={css.warningTitle}>{title}</div>
      <div>{description}</div>
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

  const selectedFromSlot = selectedClassSlotIndex !== null;
  const classSlot = selectedFromSlot
    ? classSlots[selectedClassSlotIndex]
    : null;
  const fromAudit = classSlot?.auditSemester != null;

  if (selectedFromSlot) {
    return (
      <button
        className={css.addButton}
        onClick={() => {
          if (selectedClassSlotIndex !== null) {
            setClassSlot(selectedClassSlotIndex, null);
            setSelectedClass(null);
          }
        }}
        disabled={fromAudit}
      >
        Remove Class
      </button>
    );
  } else {
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
}
