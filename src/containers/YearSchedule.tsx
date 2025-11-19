import { useGlobalStore, classes } from "../state";
import css from "./../styles/DegreePlanner.module.css";

function AddClassBtn({ slotIndex }: { slotIndex: number }) {
  const classToAdd = useGlobalStore((s) => s.classToAdd);
  const setClassToAdd = useGlobalStore((s) => s.setClassToAdd);
  const classSlot = useGlobalStore((s) => s.classSlots[slotIndex]);
  const setClassSlot = useGlobalStore((s) => s.setClassSlot);

  const slotEmpty = classToAdd && classSlot == null;

  return (
    <button
      className={slotEmpty ? `btn ${css.highlight}` : ""}
      onClick={() => {
        // check if class to add
        if (classToAdd) {
          // check if slot is empty
          if (classSlot == null) {
            setClassSlot(slotIndex, {
              classId: classToAdd,
              auditSemester: null,
            });
            setClassToAdd(null);
          }
        }
      }}
    >
      {classSlot ? (
        <>
          {classSlot.classId} {classes[classSlot.classId].name}
        </>
      ) : (
        "+ Add Class"
      )}
    </button>
  );
}

function Semester({
  semester,
  startingSlot,
}: {
  semester: string;
  startingSlot: number;
}) {
  const CLASS_SLOTS_PER_SEMESTER = 6;
  const classSlots = Array.from(
    { length: CLASS_SLOTS_PER_SEMESTER },
    (_, i) => i,
  );

  return (
    <div className={css.semester}>
      <h2>
        <center>{semester}</center>
      </h2>
      {classSlots.map((classSlot, i) => {
        const slotIndex = startingSlot + classSlot;
        return <AddClassBtn key={i} slotIndex={slotIndex} />;
      })}
    </div>
  );
}

function Year({ year, startingSlot }: { year: number; startingSlot: number }) {
  return (
    <div className={css.year}>
      <div className={css.yearText}>
        <h2><center>{year}</center></h2>
      </div>
      <Semester semester={"Fall"} startingSlot={startingSlot} />
      <Semester semester={"Spring"} startingSlot={startingSlot + 6} />
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
        <Year key={i} year={year} startingSlot={i * 12} />
      ))}
    </div>
  );
};

export default YearlySchedule;
