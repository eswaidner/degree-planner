import { create } from "zustand";
import { persist } from "zustand/middleware";

import classesJson from "../data/classes.json";
export const classes = classesJson as Record<string, Class>;

import degreeJson from "../data/cs_bs_degree.json";
import type { ReactNode } from "react";
import { termToSlotIndex, termToYear } from "./utils";
export const degree = degreeJson as Degree;

const DEFAULT_NUM_YEARS = 4;
export const CLASS_SLOTS_PER_SEMESTER = 7;
export const CLASS_SLOTS_PER_YEAR = CLASS_SLOTS_PER_SEMESTER * 2;

/** Class listing */
export interface Class {
  number: string;
  name: string;
  description: string;
  credits: number;
  prereqs: string | null;
  coreqs: string | null;
  offered: "fall" | "spring" | "always" | "rarely" | "unknown";
}

/** Collection of degree requirements and metadata */
export interface Degree {
  name: string;
  type: DegreeType;
  minCredits: number;
  reqs: DegreeRequirement[];
}

export type DegreeType = "BS" | "BA" | "BI";

/** Collection of required classes and class ranges */
export interface DegreeRequirement {
  name: string;
  classes: (ClassSet | ClassScope)[];
}

/** ["CS 3300", "CS 4800"] encodes "CS 3300 or CS 4800" */
export type ClassSet = string[];

/** Range of classes based on prefixes and a minimum level */
export interface ClassScope {
  totalCredits: number;
  prefixes: string[]; // ["CS"]
  atOrAbove: number; // 3000
}

/** Where a class is located in degree plan */
export interface ClassSlot {
  classId: string; // "CS 3300"
  auditSemester: string | null; // "FA24"
}

/** Structure of the global state store */
export interface State {
  numYears: number;
  startYear: number; //ex. 2024

  /** Appends a year to the end of the degree plan */
  addYear: () => void;

  /** Removes a year from the end of the degree plan */
  removeYear: () => void;

  /** Class slot values by year and semester, index = (12 * yearIdx) + (6 * semesterIdx) */
  classSlots: (ClassSlot | null)[];
  setClassSlot: (slotIndex: number, value: ClassSlot | null) => void;

  degreeAuditUploaded: boolean;
  uploadDegreeAudit: (html: string) => void;

  /** The current selected class */
  selectedClass: string | null;
  setSelectedClass: (value: string | null) => void;

  /** The current class selected to add to the degree plan */
  classToAdd: string | null;
  setClassToAdd: (value: string | null) => void;

  /** Resets the degree plan, preserving degree audit imports if applicable */
  resetDegreePlan: () => void;

  modalKey?: string;
  modalContent: ReactNode;

  /** Sets modal content for a unique key. */
  setModalContent: (key: string, content: ReactNode) => void;
}

/** Hook that reads a field from the global store.
 * Creates a reactive dependency on the field. */
export const useGlobalStore = create<State>()(
  persist(
    (set, get) => ({
      numYears: 4, //DEFAULT_NUM_YEARS,
      startYear: new Date().getFullYear(),

      addYear: () => {
        return set((s) => {
          const newClassSlots = [
            ...s.classSlots,
            ...Array<ClassSlot | null>(CLASS_SLOTS_PER_YEAR).fill(null),
          ];
          return { numYears: s.numYears + 1, classSlots: newClassSlots };
        });
      },

      removeYear: () => {
        return set((s) => {
          if (s.numYears <= 1) return s;

          const newClassSlots = [...s.classSlots];
          newClassSlots.splice(s.classSlots.length - CLASS_SLOTS_PER_YEAR);
          return { numYears: s.numYears - 1, classSlots: newClassSlots };
        });
      },

      classSlots: Array<ClassSlot | null>(
        CLASS_SLOTS_PER_YEAR * DEFAULT_NUM_YEARS,
      ).fill(null),

      setClassSlot: (slotIndex, value) => {
        return set((s) => {
          const newClassSlots = [...s.classSlots];
          newClassSlots[slotIndex] = value;
          return { classSlots: newClassSlots };
        });
      },

      degreeAuditUploaded: false,
      uploadDegreeAudit: (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        let startYear: number = new Date().getFullYear();
        let endYear: number = startYear + DEFAULT_NUM_YEARS;
        const classIds: Record<string, string> = {}; // class id, audit semester
        Array.from(doc.querySelectorAll(".takenCourse")).forEach((c) => {
          const course = c.querySelector(".course");
          if (!course) return;

          // transform class id into standard 'PREFIX ####' format
          let id = course.textContent.replace(/\s/g, "");
          const num = id.slice(id.length - 4);
          const prefix = id.slice(0, id.length - num.length);
          id = `${prefix} ${num}`;

          // dedup and validate class id exists in class db
          if (id in classIds || !(id in classes)) return;

          const term = c.querySelector(".term")?.textContent.trim();
          if (!term) return;

          const year = termToYear(term);
          startYear = Math.min(startYear, year);
          endYear = Math.max(endYear, year);
          classIds[id] = term;
        });

        return set(() => {
          // reset years and class slots
          const numYears = Math.max(1, endYear - startYear);
          const newClassSlots = Array<ClassSlot | null>(
            numYears * CLASS_SLOTS_PER_YEAR,
          ).fill(null);

          // set class slots
          for (const entry of Object.entries(classIds)) {
            // find open class slot
            let open = false;
            let slotIdx = termToSlotIndex(entry[1], startYear);
            for (let i = 0; i < CLASS_SLOTS_PER_SEMESTER; i++) {
              if (newClassSlots[slotIdx]) {
                slotIdx++;
              } else {
                open = true;
                break;
              }
            }

            // discard class if semester if already full
            if (!open) {
              console.log(
                `Warning: semester ${entry[1]} is full, discarding class ${entry[0]}`,
              );
              continue;
            }

            newClassSlots[slotIdx] = {
              classId: entry[0],
              auditSemester: entry[1],
            };
          }

          return {
            startYear: startYear,
            numYears: numYears,
            degreeAuditUploaded: true,
            classSlots: newClassSlots,
          };
        });
      },

      selectedClass: null,
      setSelectedClass: (value) => {
        get().setClassToAdd(null);
        return set(() => ({ selectedClass: value }));
      },

      classToAdd: null,
      setClassToAdd: (value) => set(() => ({ classToAdd: value })),

      resetDegreePlan: () => {
        return set((s) => {
          const newClassSlots = [...s.classSlots];

          // reset years, adding/removing class slots
          //TODO if degree audit uploaded, reset num years to what degree audit
          const yearsRemoved = s.numYears - DEFAULT_NUM_YEARS;
          if (yearsRemoved > 0) {
            newClassSlots.splice(
              newClassSlots.length - CLASS_SLOTS_PER_YEAR * yearsRemoved,
            );
          } else if (yearsRemoved < 0) {
            newClassSlots.push(
              ...Array<ClassSlot | null>(
                CLASS_SLOTS_PER_YEAR * Math.abs(yearsRemoved),
              ).fill(null),
            );
          }

          // reset class slots that are not imported from a degree audit
          for (let i = 0; i < newClassSlots.length; i++) {
            if (!newClassSlots[i]?.auditSemester) {
              newClassSlots[i] = null;
            }
          }

          return { numYears: DEFAULT_NUM_YEARS, classSlots: newClassSlots };
        });
      },

      modalKey: undefined,
      modalContent: undefined,

      setModalContent: (key, content) => {
        // do not close modal if key doesn't match
        if (!content && key !== get().modalKey) return;

        return set(() => ({
          modalKey: key,
          modalContent: content,
        }));
      },
    }),

    {
      name: "globalStore",
      version: 1, // increment this every state-breaking change (invalidates cache)

      partialize: (state) => ({
        // define persistent fields
        numYears: state.numYears,
        startYear: state.startYear,
        classSlots: state.classSlots,
        degreeAuditUploaded: state.degreeAuditUploaded,
      }),
    },
  ),
);
