import "./index.css";
import css from "./styles/App.module.css";
import m_css from "./styles/Modal.module.css";
import { useGlobalStore } from "./state";

import DegreePlanner from "./containers/DegreePlanner";
import ClassBrowser from "./containers/ClassBrowser";
import Modal from "./containers/Modal";
import { useEffect } from "react";

// This is the root component of our app
export default function App() {
  // We can import and call the useGlobalStore hook to get global fields/actions
  // const exampleField = useGlobalStore((state) => state.exampleField);
  // const exampleAction = useGlobalStore((state) => state.exampleAction);
  // exampleAction();

  // The useState hook is how we can use reactive local state
  // const [localState, setLocalState] = useState<string>("");
  //       |value      |update fn                |type   |default value

  // The useRef hook is how we can use local state that does NOT trigger reactive updates
  // const ref = useRef<string>("");
  //      |value       |type   |default value

  // Components return 'tsx', which is an HTML templating language
  // The syntax is very similar to HTML
  // TypeScript expressions can be embedded within {} scopes, like 'title' below

  const isNewUser = useGlobalStore((s) => s.isNewUser);
  const markNewUser = useGlobalStore((s) => s.markNewUser);
  const setModalContent = useGlobalStore((s) => s.setModalContent);

  // Use effect runs once on mount
  useEffect(() => {
    if (isNewUser) {
      setModalContent(
        "disclaimerModalKey",
        <div>
          <h2>Disclaimer:</h2>
          <p className={css.disclaimerModalBody}>
            This program counts courses once. Refer to your academic advisor
            about counting courses towards multiple requirements.
          </p>
          <div className={m_css.modalRow}>
            <button
              className={`btn ${m_css.modalBtn}`}
              onClick={() => {
                setModalContent("disclaimerModalKey", null);
              }}
            >
              Close
            </button>
          </div>
        </div>,
      );
      markNewUser();
    }
  }, [isNewUser, markNewUser, setModalContent]);

  return (
    // This is how you apply a style from a css module to an element
    <div className={css.app}>
      <DegreePlanner />
      <ClassBrowser />
      <Modal />
    </div>
  );
}
