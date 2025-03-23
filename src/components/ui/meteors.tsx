"use client";
import { cn } from "../../../lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = new Array(number || 20).fill(true);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {meteors.map((el, idx) => {
        const meteorCount = number || 20;
        // Calculate position to evenly distribute meteors across container width
        const position = idx * (200 / meteorCount) - 100; // Spread across 200px range for smaller containers

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-blue-500/50 shadow-[0_0_0_1px_#3275F810]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[20px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#3275F8] before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: "-20px", // Start closer to the top for smaller containers
              left: position + "px",
              animationDelay: Math.random() * 3 + "s", // Shorter delay range
              animationDuration: Math.floor(Math.random() * (6 - 3) + 3) + "s", // Faster animation for smaller space
            }}
          ></span>
        );
      })}
    </motion.div>
  );
};
