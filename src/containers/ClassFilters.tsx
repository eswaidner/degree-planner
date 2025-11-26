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
          reqIndex={i - 1}
          all={i === 0}
          checked={radioSelectionModified ? undefined : i === 0}
          onToggled={(checked) => {
            if (checked) setClassSearchFilter(i === 0 ? undefined : i - 1);
            setRadioSelectionModified(true);
          }}
        />
      ))}
    </div>
  );
}

interface FilterProps {
  req: DegreeRequirement;
  reqIndex: number;
  all: boolean;
  checked?: boolean;
  onToggled: (value: boolean) => void;
}

function Filter({ req, reqIndex, all, checked, onToggled }: FilterProps) {
  const classSlots = useGlobalStore((s) => s.classSlots);

  let totalCredits = 0;
  for (const cls of req.classes) {
    if (Array.isArray(cls)) totalCredits += classes[cls[0]].credits;
    else totalCredits += cls.totalCredits;
  }

  let completedCredits = 0;
  for (const slot of classSlots) {
    if (!slot) continue;
    if (all || slot.countsTowardsReqIndex === reqIndex) {
      completedCredits += classes[slot.classId].credits;
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
