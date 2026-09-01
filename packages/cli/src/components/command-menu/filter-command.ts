import type { Command } from "./types";
import { COMMANDS } from "./command";

export function getFilteredCommands(input: string): Command[] {
  if (input.length === 0) {
    return COMMANDS;
  }

  return COMMANDS.filter((cmd) =>
    cmd.name.toLowerCase().startsWith(input.toLowerCase())
  );
}