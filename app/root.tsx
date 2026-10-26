import React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";

import "./styles/global.css";
import { Layout } from "./components/Layout";
import { CommandPalette } from "./components/CommandPalette";
import PixelBlast from "./components/PixelBlast";

export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Agentic Architect // E-Commerce Ops" },
    { name: "description", content: "Portfolio of an Agentic Architect specializing in E-Commerce Operations and Autonomous Systems." },
  ];
};

export default function App() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="site-pixel-background" aria-hidden="true">
          <PixelBlast
            variant="square"
            pixelSize={3}
            color="#58a6ff"
            accentColor="#7ee787"
            patternScale={2}
            patternDensity={0.85}
            softness={0.6}
            glow={0.25}
            twinkle={0.15}
            drift={0.12}
            hoverEffect="reveal"
            enableRipples
            edgeFade={0.18}
            dpr={1.5}
          />
        </div>
        <Layout>
          <Outlet />
        </Layout>
        <CommandPalette open={open} setOpen={setOpen} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
