import { useGlobalStore } from "../state";
import css from "../styles/Modal.module.css";

export default function Modal() {
  const modalContent = useGlobalStore((s) => s.modalContent);

  return modalContent ? (
    <div className={css.modalBackground}>
      <div className={css.modal}>{modalContent}</div>
    </div>
  ) : (
    <></>
  );
}
