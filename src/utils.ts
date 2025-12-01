import {
  CLASS_SLOTS_PER_SEMESTER,
  CLASS_SLOTS_PER_YEAR,
  classes,
  type ClassSlot,
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

export function isDuplicateClass(
  classId: string,
  classSlots: (ClassSlot | null)[],
): boolean {
  let counter = 0;
  for (const slot of classSlots) {
    if (!slot) continue;
    if (slot.classId === classId) {
      if (counter === 1) return true;
      else counter += 1;
    }
  }

  return false;
}

export function slotIndexToSemester(slotIndex: number): "spring" | "fall" {
  if ((slotIndex % CLASS_SLOTS_PER_YEAR) / CLASS_SLOTS_PER_SEMESTER < 1) {
    return "fall";
  } else {
    return "spring";
  }
}

export function isClassOfferedInSemester(
  classId: string,
  slotIndex: number,
): boolean {
  const offered = classes[classId].offered;

  if (offered === "always") return true;
  else if (offered === "rarely" || offered === "unknown") return false;
  else return classes[classId].offered === slotIndexToSemester(slotIndex);
}
