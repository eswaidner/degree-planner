import bb_css from "./../styles/DegreePlanner.module.css";
import m_css from "./../styles/Modal.module.css";
import { useGlobalStore } from "../state";

export default function ResetButton() {
  const setModalContent = useGlobalStore((s) => s.setModalContent);
  const resetDegreePlan = useGlobalStore((s) => s.resetDegreePlan);

  const handleClick = () => {
    setModalContent(
      "resetModalKey",
      <div>
        <h2>Confirm Reset</h2>
        <div className={`${m_css.modalRow}`}>
          <button
            className={`btn ${m_css.modalBtn}`}
            onClick={() => {
              setModalContent("resetModalKey", null);
              resetDegreePlan();
            }}
          >
            Reset
          </button>
          <button
            className={`btn ${m_css.modalBtn}`}
            onClick={() => {
              setModalContent("resetModalKey", null);
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
    );
  };

  return (
    <button onClick={handleClick} className={`btn ${bb_css.btnBarButtons}`}>
      Reset
    </button>
  );
}
