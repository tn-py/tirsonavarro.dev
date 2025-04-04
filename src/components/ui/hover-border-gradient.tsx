"use client";
import React, { useState, useEffect } from "react";

import { motion } from "motion/react";
import { cn } from "../../../lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(40% 50% at 50% 0%, hsl(217, 94%, 70%) 0%, rgba(50, 117, 248, 0.3) 50%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(35% 50% at 0% 50%, hsl(217, 94%, 70%) 0%, rgba(50, 117, 248, 0.3) 50%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM: "radial-gradient(40% 50% at 50% 100%, hsl(217, 94%, 70%) 0%, rgba(50, 117, 248, 0.3) 50%, rgba(255, 255, 255, 0) 100%)",
    RIGHT: "radial-gradient(35% 50% at 100% 50%, hsl(217, 94%, 70%) 0%, rgba(50, 117, 248, 0.3) 50%, rgba(255, 255, 255, 0) 100%)",
  };

  const highlight =
    "radial-gradient(120% 250% at 50% 50%, #3275F8 0%, rgba(50, 117, 248, 0.6) 40%, rgba(50, 117, 248, 0.2) 70%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const rotateDirection = (currentDirection: Direction): Direction => {
        const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
        const currentIndex = directions.indexOf(currentDirection);
        const nextIndex = clockwise
          ? (currentIndex - 1 + directions.length) % directions.length
          : (currentIndex + 1) % directions.length;
        return directions[nextIndex];
      };

      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, clockwise]);
  return (
    <Tag
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-[1px] decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "w-auto text-white z-10 bg-black px-4 py-2 rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: hovered ? "blur(2px) brightness(1.3)" : "blur(1.5px)",
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: hovered ? 1 : 0.8,
          transition: "filter 0.3s ease-out, opacity 0.3s ease-out",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="bg-black absolute z-1 flex-none inset-[1px] rounded-[inherit]" />
    </Tag>
  );
}
