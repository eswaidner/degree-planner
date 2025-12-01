import { PiWarningBold } from "react-icons/pi";
import {
  CLASS_SLOTS_PER_SEMESTER,
  CLASS_SLOTS_PER_YEAR,
  useGlobalStore,
} from "../state";
import css from "./../styles/DegreePlanner.module.css";
import { isClassOfferedInSemester, isDuplicateClass } from "../utils";

export default function YearlySchedule() {
  const startYear = useGlobalStore((s) => s.startYear);
  const numYears = useGlobalStore((s) => s.numYears);
  const years = Array.from({ length: numYears }, (_, i) => startYear + i);

  return (
    <div className={css.yearlySchedule}>
      {years.map((year, i) => (
        <Year key={i} year={year} startingSlot={i * CLASS_SLOTS_PER_YEAR} />
      ))}
    </div>
  );
}

function Year({ year, startingSlot }: { year: number; startingSlot: number }) {
  const nextYear = year + 1;
  return (
    <div className={css.year}>
      <div className={css.yearText}>
        <h2>
          <center>
            {year}-{nextYear}
          </center>
        </h2>
      </div>
      <Semester semester={"Fall"} startingSlot={startingSlot} year={year} />
      <Semester
        semester={"Spring"}
        startingSlot={startingSlot + CLASS_SLOTS_PER_SEMESTER}
        year={nextYear}
      />
    </div>
  );
}

function Semester({
  semester,
  startingSlot,
  year,
}: {
  semester: string;
  startingSlot: number;
  year: number;
}) {
  const classSlots = Array.from(
    { length: CLASS_SLOTS_PER_SEMESTER },
    (_, i) => i,
  );

  return (
    <div className={css.semester}>
      <h2>
        <center>
          {semester} {year}
        </center>
      </h2>
      {classSlots.map((classSlot, i) => {
        const slotIndex = startingSlot + classSlot;
        return <ClassSlot key={i} slotIndex={slotIndex} />;
      })}
    </div>
  );
}

function ClassSlot({ slotIndex }: { slotIndex: number }) {
  const classToAdd = useGlobalStore((s) => s.classToAdd);
  const setClassToAdd = useGlobalStore((s) => s.setClassToAdd);
  const classSlots = useGlobalStore((s) => s.classSlots);
  const setClassSlot = useGlobalStore((s) => s.setClassSlot);
  const setSelectedClass = useGlobalStore((s) => s.setSelectedClass);
  const selectedClassSlotIndex = useGlobalStore(
    (s) => s.selectedClassSlotIndex,
  );
  const classSearchFilter = useGlobalStore((s) => s.classSearchFilter);

  const classSlot = classSlots[slotIndex];

  const slotEmpty = classToAdd && classSlot == null;

  const reqHighlighted =
    !classToAdd &&
    classSlot &&
    classSearchFilter !== undefined &&
    classSlot.countsTowardsReqIndex === classSearchFilter;

  let showWarning = false;

  if (classSlot) {
    // display warning if duplicate class
    if (isDuplicateClass(classSlot.classId, classSlots)) showWarning = true;

    // display warning if class not offered in semester
    if (!classSlot.auditSemester) {
      if (!isClassOfferedInSemester(classSlot.classId, slotIndex)) {
        showWarning = true;
      }
    }
  }

  const selected = selectedClassSlotIndex === slotIndex;

  return (
    <button
      className={`
        ${css.classSlot} ${slotEmpty ? css.highlight : ""}
        ${reqHighlighted ? css.highlight2 : ""}
        ${selected ? css.selected : ""}
        `}
      disabled={!classToAdd && !classSlot}
      onClick={() => {
        // check if class to add
        if (classToAdd) {
          // check if slot is empty
          if (classSlot == null || classSlot.auditSemester == null) {
            setClassSlot(slotIndex, {
              classId: classToAdd,
              auditSemester: null,
            });
            setSelectedClass(classToAdd, slotIndex);
            setClassToAdd(null);
          }
        } else if (classSlot) {
          setSelectedClass(classSlot.classId, slotIndex);
        }
      }}
    >
      {classSlot ? <>{classSlot.classId}</> : "-"}
      {showWarning && <PiWarningBold className={css.warningIcon} size={22} />}
    </button>
  );
}
