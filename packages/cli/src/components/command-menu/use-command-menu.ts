import {
  useRef,
  useState,
  useMemo,
  type RefObject,
} from "react";

import type { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";

import { getFilteredCommands } from "./filter-command";
import type { Command } from "./types";

type UseCommandMenuReturn = {
  showCommandMenu: boolean;
  commandQuery: string;
  selectedIndex: number;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
  handleContentChange: (text: string) => void;
  resolveCommand: (index: number) => Command | undefined;
  setSelectedIndex: (index: number) => void;
};

export function useCommandMenu(): UseCommandMenuReturn {
  const [textValue, setTextValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCommandMenu, setShowCommandMenu] = useState(false);

  const scrollRef = useRef<ScrollBoxRenderable>(null);

  /**
   * Text after the "/" character.
   *
   * Example:
   *
   * "/hel" -> "hel"
   * "/"    -> ""
   * "hello" -> ""
   */
  const commandQuery =
    showCommandMenu && textValue.startsWith("/")
      ? textValue.slice(1)
      : "";

  /**
   * Filter commands based on the current query.
   */
  const filteredCommands = useMemo(
    () => getFilteredCommands(commandQuery),
    [commandQuery],
  );

  /**
   * Handle changes to the textarea.
   */
  const handleContentChange = (text: string) => {
    setTextValue(text);
    setSelectedIndex(0);

    const scrollbox = scrollRef.current;

    if (scrollbox) {
      scrollbox.scrollTo(0);
    }

    /**
     * Show command menu when the input starts with "/".
     */
    if (text.startsWith("/")) {
      setShowCommandMenu(true);
    } else {
      setShowCommandMenu(false);
    }
  };

  /**
   * Resolve the selected command.
   */
  const resolveCommand = (
    index: number,
  ): Command | undefined => {
    const command = filteredCommands[index];

    if (command) {
      setShowCommandMenu(false);
    }

    return command;
  };

  /**
   * Keyboard navigation for the command menu.
   */
  useKeyboard((key) => {
    if (!showCommandMenu) {
      return;
    }

    /**
     * Escape
     */
    if (key.name === "escape") {
      key.preventDefault();
      setShowCommandMenu(false);
      return;
    }

    /**
     * Arrow Up
     */
    if (key.name === "up") {
      key.preventDefault();

      setSelectedIndex((currentIndex) => {
        const newIndex = Math.max(0, currentIndex - 1);

        const scrollbox = scrollRef.current;

        if (scrollbox && newIndex < scrollbox.scrollTop) {
          scrollbox.scrollTo(newIndex);
        }

        return newIndex;
      });

      return;
    }

    /**
     * Arrow Down
     */
    if (key.name === "down") {
      key.preventDefault();

      setSelectedIndex((currentIndex) => {
        if (filteredCommands.length === 0) {
          return 0;
        }

        const newIndex = Math.min(
          filteredCommands.length - 1,
          currentIndex + 1,
        );

        const scrollbox = scrollRef.current;

        if (scrollbox) {
          const viewportHeight = scrollbox.viewport.height;

          const visibleEnd =
            scrollbox.scrollTop + viewportHeight - 1;

          if (newIndex > visibleEnd) {
            scrollbox.scrollTo(
              newIndex - viewportHeight + 1,
            );
          }
        }

        return newIndex;
      });

      return;
    }
  });

  return {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  };
}