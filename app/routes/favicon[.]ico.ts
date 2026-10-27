import { redirect } from "@remix-run/node";

// Browsers request /favicon.ico regardless of <link rel="icon">; point them at the SVG.
export const loader = () => redirect("/favicon.svg", 301);
