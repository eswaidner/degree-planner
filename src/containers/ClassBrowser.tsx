import css from "./../styles/ClassBrowser.module.css";
import ClassSearch from "./ClassSearch";
import ClassFilters from "./ClassFilters";
import ClassDisplay from "./ClassDisplay";

export default function ClassBrowser() {
  return (
    <div className={css.root}>
      <div className={css.top}>
        <ClassSearch />
        <ClassFilters />
      </div>
      <ClassDisplay />
    </div>
  );
}
