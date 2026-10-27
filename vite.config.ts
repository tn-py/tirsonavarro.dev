import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

export default defineConfig({
  server: {
    allowedHosts: [".tunnelmole.net"],
  },
  ssr: {
    // gsap ships CommonJS plugin files whose named exports Node's ESM loader can't detect
    // on Vercel ("does not provide an export named 'ScrollTrigger'"), so bundle it instead.
    noExternal: ["gsap", "@gsap/react"],
  },
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        // v3_relativeRoutingHtmlAttribute: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
});
