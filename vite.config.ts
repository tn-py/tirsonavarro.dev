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
