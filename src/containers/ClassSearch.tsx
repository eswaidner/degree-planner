import { useEffect, useMemo, useState } from "react";
import { classes, useGlobalStore, type Class } from "../state";
import css from "./../styles/ClassBrowser.module.css";
import Fuse, { type FuseResult } from "fuse.js";

const MIN_SEARCH_LEN = 2;

export default function ClassSearch() {
  const [searchResults, setSearchResults] = useState<FuseResult<Class>[]>([]);
  const [searchString, setSeachString] = useState<string | null>(null);
  const setHoveredClass = useGlobalStore((s) => s.setHoveredClass);

  const searchEngine = useMemo(
    () =>
      new Fuse(Object.values(classes), {
        keys: [{ name: "number" }, { name: "name" }],
        ignoreLocation: true,
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.1,
      }),
    [],
  );

  useEffect(() => {
    if (!searchString) {
      setSearchResults([]);
      return;
    }

    if (searchString.length < 2) return;

    setSearchResults(searchEngine.search(searchString));
  }, [searchString, searchEngine, setSearchResults]);

  if (searchResults.length == 1) setHoveredClass(searchResults[0].item.number);

  return (
    <div className={css.search}>
      <input
        className={css.searchBar}
        type="text"
        placeholder="Search classes..."
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        onChange={(e) => {
          const len = e.target.value.length;
          if (len < MIN_SEARCH_LEN && len != 0) return;
          setSeachString(e.target.value);
        }}
      ></input>
      <div className={css.searchResults}>
        {searchResults.length > 0 || searchString
          ? searchResults.map((r) => <ClassThumbnail cls={r.item} />)
          : Object.values(classes).map((c) => <ClassThumbnail cls={c} />)}
      </div>
    </div>
  );
}

interface ClassThumbnailProps {
  cls: Class;
}

function ClassThumbnail({ cls }: ClassThumbnailProps) {
  const setHoveredClass = useGlobalStore((s) => s.setHoveredClass);

  return (
    <button
      className={css.classThumbnail}
      onPointerEnter={() => {
        setHoveredClass(cls.number);
      }}
    >
      {cls.number} - {cls.name}
    </button>
  );
}
