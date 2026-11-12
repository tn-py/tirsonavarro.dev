import { lazy, Suspense, useEffect, useState } from "react";

// The WebGL pixel field is heavy, so only desktop visitors who allow motion get it.
// Everyone else keeps the static CSS pattern on .site-pixel-background (see global.css),
// and never downloads the PixelBlast bundle.
const PixelBlast = lazy(() => import("./PixelBlast"));

const QUERY = "(min-width: 769px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function supportsWebGL2(): boolean {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

export function SiteBackground() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const webgl = supportsWebGL2();
    const update = () => setAnimated(media.matches && webgl);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="site-pixel-background" data-animated={animated || undefined} aria-hidden="true">
      {animated && (
        <Suspense fallback={null}>
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
        </Suspense>
      )}
    </div>
  );
}
