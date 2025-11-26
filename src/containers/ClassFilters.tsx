import { useState } from "react";
import {
  classes,
  degree,
  useGlobalStore,
  type DegreeRequirement,
} from "../state";
import css from "./../styles/ClassBrowser.module.css";

export default function ClassFilters() {
  const setClassSearchFilter = useGlobalStore((s) => s.setClassSearchFilter);
  const [radioSelectionModified, setRadioSelectionModified] = useState(false);

  const reqs = [
    {
      name: "All",
      classes: degree.reqs.flatMap((r) => r.classes),
    },
    ...degree.reqs,
  ];

  return (
    <div className={css.filters}>
      {reqs.map((req, i) => (
        <Filter
          key={i}
          req={req}
          checked={radioSelectionModified ? undefined : i === 0}
          onToggled={(checked) => {
            if (checked) setClassSearchFilter(i === 0 ? undefined : req);
            setRadioSelectionModified(true);
          }}
        />
      ))}
    </div>
  );
}

interface FilterProps {
  req: DegreeRequirement;
  checked?: boolean;
  onToggled: (value: boolean) => void;
}

function Filter({ req, checked, onToggled }: FilterProps) {
  const classSlots = useGlobalStore((s) => s.classSlots);

  let totalCredits = 0;
  for (const cls of req.classes) {
    if (Array.isArray(cls)) totalCredits += classes[cls[0]].credits;
    else totalCredits += cls.totalCredits;
  }

  const countedClasses = new Set<string>();
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
        if (cls.prefixes.length > 0 && !matchingPrefix) continue;

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
        <input
          type="radio"
          id={req.name}
          name={"class-filter"}
          checked={checked}
          onChange={(e) => onToggled(e.target.checked)}
        />
        <label htmlFor={req.name}>{req.name.replace("Requirement", "")}</label>
      </div>
      <div className={css.filterProgress}>
        {completedCredits}/{totalCredits} credits
      </div>
    </div>
  );
}
