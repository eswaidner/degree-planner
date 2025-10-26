import { create } from "zustand";
import { persist } from "zustand/middleware";

// data structures go here
export interface Class {
  number: string;
  name: string;
  description: string;
  credits: number;
  prereqs: string[][]; // [[a OR b OR c] AND [d OR e]]
  coreqs: string[][];
  offered: "fall" | "spring" | "always" | "rarely" | "unknown";
}

/** Structure of the global state store */
export interface State {
  //TODO add fields and action functions
  // exampleField: string,
  // exampleAction: () => void,
}

/** Hook that reads a field from the global store.
 * Creates a reactive dependency on the field. */
export const useGlobalStore = create<State>()(
  persist(
    (set, get) => ({
      //TODO define initial values for state fields and implementations for action functions
      // exampleField: "example",
      // exampleAction: () => {}
    }),
    {
      name: "globalStore",
      version: 0, // increment this every state-breaking change (invalidates cache)

      partialize: (state) => ({
        // define persistent fields
        // exampleField: state.exampleField,
      }),
    }
  )
);
