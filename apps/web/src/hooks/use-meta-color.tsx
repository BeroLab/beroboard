"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { META_THEME_COLORS } from "~/lib/config";

export function useMetaColor() {
  const { resolvedTheme } = useTheme();

  const metaColor = React.useMemo(
    () =>
      resolvedTheme === "dark"
        ? META_THEME_COLORS.dark
        : META_THEME_COLORS.light,
    [resolvedTheme]
  );

  const setMetaColor = React.useCallback((color: string) => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color);
  }, []);

  return { metaColor, setMetaColor };
}
