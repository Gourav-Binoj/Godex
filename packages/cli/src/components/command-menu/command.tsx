import type { Command } from "./types";
export const COMMANDS: Command[] = [
    {
        name: "new",
        description: "Start a new conversation",
        value: "/new",
    },
    {
        name: "session",
        description: "View past sessions",
        value: "/session",
    },
     {
        name: "agents",
        description: "Switch agents",
        value: "/agents",
    },
    {
        name: "models",
        description: "View available models",
        value: "/models",
    },
    {
        name: "theme",
        description: "Change the application theme",
        value: "/theme",
    },
    {
        name: "login",
        description: "sign in",
        value: "/login",
    },
    {
        name: "logout",
        description: "sign out",
        value: "/logout",
    },
    {
        name: "upgrade",
        description: "Buy more",
        value: "/upgrade",
    },
    {
        name: "usage",
        description: "Open billing portal in your browser",
        value: "/usage",
    },

    {
        name: "exit",
        description: "Exit the application",
        value: "/exit",
        action: (ctx) => {ctx.exit()}
    }
]