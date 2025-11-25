import { CLASS_SLOTS_PER_SEMESTER, CLASS_SLOTS_PER_YEAR } from "./state";

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
