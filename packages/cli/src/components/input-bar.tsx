import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";

import type {
  KeyBinding,
  ScrollBoxRenderable,
  TextareaRenderable,
} from "@opentui/core";

import { useRenderer } from "@opentui/react";

import { StatusBar } from "./status-bar";
import { EmptyBorder } from "./border";
import { CommandMenu } from "./command-menu";
import type { Command } from "./command-menu/types";
import { useCommandMenu } from "./command-menu/use-command-menu";

type Props = {
  onSubmit: (input: string) => void;
  disabled?: boolean;
};

export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
  {
    name: "return",
    action: "submit",
  },
  {
    name: "enter",
    action: "submit",
  },
  {
    name: "return",
    shift: true,
    action: "newline",
  },
  {
    name: "enter",
    shift: true,
    action: "newline",
  },
];

export function InputBar({
  onSubmit,
  disabled = false,
}: Props) {
  const renderer = useRenderer();

  const textareaRef = useRef<TextareaRenderable>(null);

  const onSubmitRef = useRef<() => void>(() => {});

  const {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  } = useCommandMenu();

  /**
   * Execute a command selected from the command menu.
   */
  const handleCommand = useCallback(
    (command: Command | undefined) => {
      const textarea = textareaRef.current;

      if (!textarea || !command) {
        return;
      }

      textarea.setText("");

      if (command.action) {
        command.action({
          exit: () => renderer.destroy(),
        });
      } else {
        textarea.insertText(`${command.value} `);
      }
    },
    [renderer],
  );

  /**
   * Execute a command by index.
   */
  const handleCommandExecute = useCallback(
    (index: number) => {
      const command = resolveCommand(index);

      handleCommand(command);
    },
    [resolveCommand, handleCommand],
  );

  /**
   * Handle textarea content changes.
   */
  const handleTextareaContentChange = useCallback(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    handleContentChange(textarea.plainText);
  }, [handleContentChange]);

  /**
   * Submit normal user input.
   */
  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const text = textarea.plainText.trim();

    if (text.length === 0) {
      return;
    }

    onSubmit(text);

    textarea.setText("");
  }, [disabled, onSubmit]);

  /**
   * Connect textarea submit event.
   */
  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.onSubmit = () => {
      onSubmitRef.current();
    };
  }, []);

  /**
   * Decide what Enter should do.
   */
  onSubmitRef.current = () => {
    if (disabled) {
      return;
    }

    if (showCommandMenu) {
      const command = resolveCommand(selectedIndex);

      handleCommand(command);

      return;
    }

    handleSubmit();
  };

  return (
    <box
      width="100%"
      flexDirection="column"
    >
      {/* =========================================
          COMMAND MENU
          Appears ABOVE the input
         ========================================= */}

      {showCommandMenu && (
        <box
          width="100%"
          flexDirection="column"
          marginBottom={1}
          backgroundColor="#1A1A24"
        >
          <CommandMenu
            query={commandQuery}
            selectedIndex={selectedIndex}
            scrollRef={
              scrollRef as RefObject<ScrollBoxRenderable>
            }
            onSelect={setSelectedIndex}
            onExecute={handleCommandExecute}
          />
        </box>
      )}

      {/* =========================================
          INPUT AREA
         ========================================= */}

      <box
        width="100%"
        alignItems="center"
      >
        <box
          border={["left"]}
          borderColor="cyan"
          customBorderChars={{
            ...EmptyBorder,
            vertical: "┃",
            bottomLeft: "┗",
          }}
          width="100%"
        >
          <box
            justifyContent="center"
            paddingX={2}
            paddingY={1}
            backgroundColor="#1A1A24"
            width="100%"
            gap={1}
          >
            <textarea
              ref={textareaRef}
              focused={!disabled}
              keyBindings={TEXTAREA_KEY_BINDINGS}
              placeholder="Type your input here..."
              onContentChange={
                handleTextareaContentChange
              }
            />

            <StatusBar />
          </box>
        </box>
      </box>
    </box>
  );
}