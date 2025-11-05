import { create } from "zustand";
import { persist } from "zustand/middleware";

import classesJson from "../data/classes.json";
export const classes = classesJson as Record<string, Class>;

import degreeJson from "../data/cs_bs_degree.json";
export const degree = degreeJson as Degree;

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
	classId: string // "CS 3300" 
	auditSemester: string | null // "FA24" 
}

/** Structure of the global state store */
export interface State {
  //TODO add fields and action functions
  // exampleField: string,
  // exampleAction: () => void,

  numYears: number, //how many years in degree plan, index of last year??
  startYear: number, //ex. 2024 

  classSlots: (ClassSlot | null)[],  

  hoveredClass: string | null;
  setHoveredClass: (cls: string | null) => void;
}

/** Hook that reads a field from the global store.
 * Creates a reactive dependency on the field. */
export const useGlobalStore = create<State>()(
  persist(
    (set, get) => ({
      //TODO define initial values for state fields and implementations for action functions
      // exampleField: "example",
      // exampleAction: () => {}
      
      numYears: 3, 
      startYear: 0,

      classSlots: Array(48).fill(null), 

      hoveredClass: null,
      setHoveredClass: (cls) => set(() => ({ hoveredClass: cls })),
    }),
    {
      name: "globalStore",
      version: 0, // increment this every state-breaking change (invalidates cache)

      partialize: (state) => ({
        // define persistent fields
        // exampleField: state.exampleField,
      }),
    },
  ),
);
