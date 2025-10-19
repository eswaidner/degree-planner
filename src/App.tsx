// import { useState, useRef } from "react";
// import { useGlobalStore } from "./state";
import css from "./App.module.css";

// This is the root component of our app
export default function App() {
  // We can import and call the useGlobalStore hook to get global fields/actions
  // const exampleField = useGlobalStore((state) => state.exampleField);
  // const exampleAction = useGlobalStore((state) => state.exampleAction);
  // exampleAction();

  const title = "Degree Planner";

  // The useState hook is how we can use reactive local state
  // const [localState, setLocalState] = useState<string>("");
  //       |value      |update fn                |type   |default value

  // The useRef hook is how we can use local state that does NOT trigger reactive updates
  // const ref = useRef<string>("");
  //      |value       |type   |default value

  // Components return 'tsx', which is an HTML templating language
  // The syntax is very similar to HTML
  // TypeScript expressions can be embedded within {} scopes, like 'title' below
  return (
    // This is how you apply a style from a css module to an element
    <div className={css.app}>
      <div>Title: {title}</div>
    </div>
  );
}
