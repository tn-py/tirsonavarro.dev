import type { CSSProperties } from "react";

export interface ShuffleProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  shuffleDirection?: "left" | "right" | "up" | "down";
  duration?: number;
  maxDelay?: number;
  ease?: string | ((t: number) => number);
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: CSSProperties["textAlign"];
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: "evenodd" | "sequence" | "center" | "random";
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
  effect?: "slide" | "flip" | "blur";
  hoverRadius?: number;
  motionBlur?: boolean;
  color?: string;
  accentColor?: string;
}

declare const Shuffle: (props: ShuffleProps) => JSX.Element;
export default Shuffle;
