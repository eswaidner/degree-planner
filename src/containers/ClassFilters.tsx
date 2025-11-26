import {
  classes,
  degree,
  useGlobalStore,
  type DegreeRequirement,
} from "../state";
import css from "./../styles/ClassBrowser.module.css";

export default function ClassFilters() {
  return (
    <div className={css.filters}>
      {degree.reqs.map((req, i) => (
        <Filter key={i} req={req} />
      ))}
    </div>
  );
}

interface FilterProps {
  req: DegreeRequirement;
}

function Filter({ req }: FilterProps) {
  const classSlots = useGlobalStore((s) => s.classSlots);

  let totalCredits = 0;
  for (const cls of req.classes) {
    if (Array.isArray(cls)) totalCredits += classes[cls[0]].credits;
    else totalCredits += cls.totalCredits;
  }

  const countedClasses: Set<string> = new Set();
  let completedCredits = 0;
  for (const cls of req.classes) {
    if (completedCredits >= totalCredits) break;

    // if class set, apply classes that match a class in the class set
    if (Array.isArray(cls)) {
      const completedClassId = cls.find((c) =>
        classSlots.find(
          (slot) => slot?.classId === c && !countedClasses.has(slot.classId),
        ),
      );

      if (completedClassId) {
        completedCredits += classes[completedClassId].credits;
        countedClasses.add(completedClassId);
      }
    } else {
      // apply classes that match the class scope
      for (const slot of classSlots) {
        if (completedCredits >= totalCredits) break;
        if (!slot || countedClasses.has(slot.classId)) continue;

        const matchingPrefix = cls.prefixes.find((p) =>
          slot.classId.startsWith(p),
        );
        if (!matchingPrefix) continue;

        const classNumber = Number(slot.classId.slice(slot.classId.length - 4));
        if (classNumber >= cls.atOrAbove) {
          completedCredits += classes[slot.classId].credits;
          countedClasses.add(slot.classId);
        }
      }
    }
  }

  return (
    <div className={css.filter}>
      <div className={css.filterToggle}>
        <input type="checkbox" id={req.name} name={req.name} />
        <label htmlFor={req.name}>{req.name.replace("Requirement", "")}</label>
      </div>
      <div className={css.filterProgress}>
        {completedCredits}/{totalCredits} credits
      </div>
    </div>
  );
}
