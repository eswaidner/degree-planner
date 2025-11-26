import {
  CLASS_SLOTS_PER_SEMESTER,
  CLASS_SLOTS_PER_YEAR,
  type DegreeRequirement,
} from "./state";

/** Converts a term code ex. 'FA25' to the first class slot index in that term */
export function termToStartSlotIndex(term: string, startYear: number): number {
  const sem = term.slice(0, 2);
  const year = termToYear(term);

  let semIndex = 0;
  if (sem === "FA") semIndex = 0;
  else if (sem === "SP") semIndex = 1;

  return (
    (year - startYear) * CLASS_SLOTS_PER_YEAR +
    semIndex * CLASS_SLOTS_PER_SEMESTER -
    semIndex * CLASS_SLOTS_PER_YEAR
  );
}

/** Converts a term code ex. 'FA25' to a numeric year ex. 2025 */
export function termToYear(term: string): number {
  return Number(term.slice(2)) + 2000;
}

export function classInRequirement(
  classId: string,
  req: DegreeRequirement,
): boolean {
  for (const cls of req.classes) {
    if (Array.isArray(cls)) {
      if (cls.find((c) => classId === c)) return true;
    } else {
      const matchesPrefix =
        cls.prefixes.length === 0 ||
        cls.prefixes.find((p) => classId.startsWith(p));

      if (!matchesPrefix) continue;

      const classNumber = Number(classId.slice(classId.length - 4));
      if (classNumber >= cls.atOrAbove) return true;
    }
  }

  return false;
}
