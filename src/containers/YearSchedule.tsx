import {
  CLASS_SLOTS_PER_SEMESTER,
  CLASS_SLOTS_PER_YEAR,
  useGlobalStore,
} from "../state";
import css from "./../styles/DegreePlanner.module.css";

function AddClassBtn({ slotIndex }: { slotIndex: number }) {
  const classToAdd = useGlobalStore((s) => s.classToAdd);
  const setClassToAdd = useGlobalStore((s) => s.setClassToAdd);
  const classSlot = useGlobalStore((s) => s.classSlots[slotIndex]);
  const setClassSlot = useGlobalStore((s) => s.setClassSlot);
  const setSelectedClass = useGlobalStore((s) => s.setSelectedClass);
  const classSearchFilter = useGlobalStore((s) => s.classSearchFilter);

  const slotEmpty = classToAdd && classSlot == null;

  const reqHighlighted =
    !classToAdd &&
    classSlot &&
    classSearchFilter !== undefined &&
    classSlot.countsTowardsReqIndex === classSearchFilter;

  return (
    <button
      className={`${css.classSlot} ${slotEmpty ? css.highlight : ""} ${reqHighlighted ? css.highlight2 : ""}`}
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
            setClassToAdd(null);
          }
        } else if (classSlot) {
          setSelectedClass(classSlot.classId, slotIndex);
        }
      }}
    >
      {classSlot ? <>{classSlot.classId}</> : "-"}
    </button>
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
        return <AddClassBtn key={i} slotIndex={slotIndex} />;
      })}
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

const YearlySchedule: React.FC = () => {
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
};

export default YearlySchedule;
