import { useMemo } from "react";
import content from "../data/siteContent.json";

const useSiteContent = (section, fallback = null) => {
  const memoizedContent = useMemo(() => content, []);

  return useMemo(() => {
    if (!section) {
      return memoizedContent;
    }

    return memoizedContent?.[section] ?? fallback;
  }, [fallback, memoizedContent, section]);
};

export default useSiteContent;
