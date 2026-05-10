"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TextShimmerProps = {
  children: ReactNode;
  className?: string;
};

export function TextShimmer({ children, className }: TextShimmerProps) {
  return (
    <motion.span
      className={cn(
        "inline-block bg-[linear-gradient(110deg,#d4ff00,45%,#fbffd7,55%,#d4ff00)] bg-[length:220%_100%] bg-clip-text text-transparent",
        className
      )}
      initial={{ backgroundPosition: "100% 50%" }}
      animate={{ backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}
