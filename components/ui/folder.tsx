"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FolderProps
  extends Omit<
    React.ComponentProps<typeof motion.div>,
    "onDrag" | "onDragEnd" | "onDragEnter" | "onDragExit" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop"
  > {
  title?: string;
  fileCount?: number;
  color?: string;
  filesColor?: string;
  textColor?: string;
  subTextColor?: string;
}

export default function Folder({
  title = "Design Folder",
  fileCount = 45,
  color = "#ff9f1c",
  filesColor = "#ffffff",
  textColor = "text-white",
  subTextColor = "text-white/70",
  className,
  ...props
}: FolderProps) {
  return (
    <motion.div
      className={cn(
        "relative group cursor-pointer w-full max-w-70 h-45",
        className
      )}
      style={{ perspective: "1000px" }}
      initial="initial"
      whileHover="hover"
      animate="initial"
      {...props}
    >
      {/* Files inside the folder */}
      <div className="absolute inset-x-8 bottom-10 flex justify-center items-end">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={{
              initial: {
                y: 20,
                rotate: 0,
                scale: 0.9,
                opacity: 0,
              },
              hover: {
                y: -50 - i * 15,
                rotate: (i - 1) * 8,
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: i * 0.05,
                },
              },
            }}
            className="absolute w-[45%] h-[110%] rounded-md border border-gray-200 shadow-md p-3 flex flex-col gap-2 overflow-hidden"
            style={{ 
              backgroundColor: filesColor, 
              zIndex: 10 + i,
              transformOrigin: "bottom center"
            }}
          >
            {/* Paper content lines */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full" />
            <div className="w-5/6 h-1.5 bg-gray-100 rounded-full" />
            <div className="w-full h-1.5 bg-gray-100 rounded-full" />
            <div className="w-4/6 h-1.5 bg-gray-100 rounded-full" />
            <div className="w-full h-1.5 bg-gray-100 rounded-full" />
            <div className="w-3/6 h-1.5 bg-gray-100 rounded-full" />
          </motion.div>
        ))}
      </div>

      {/* Folder Back */}
      <div
        className="absolute inset-0 rounded-2xl shadow-lg"
        style={{
          backgroundColor: color,
          filter: "brightness(0.9)",
        }}
      >
        {/* Tab part */}
        <div
          className="absolute -top-3 left-0 w-28 h-8 rounded-t-xl"
          style={{
            backgroundColor: color,
            filter: "brightness(0.9)",
          }}
        />
      </div>

      {/* Folder Front Flap */}
      <motion.div
        className="absolute inset-0 rounded-2xl shadow-2xl flex flex-col justify-end p-6 overflow-hidden"
        style={{
          backgroundColor: color,
          zIndex: 20,
          transformOrigin: "bottom center",
        }}
        variants={{
          initial: {
            rotateX: 0,
          },
          hover: {
            rotateX: -25,
            transition: {
              type: "spring",
              stiffness: 200,
              damping: 15,
            },
          },
        }}
      >
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-tr from-black/10 via-transparent to-white/10 pointer-events-none" />
        
        <div className="relative z-10 space-y-0.5">
          <h3 className={cn("font-semibold text-lg tracking-tight", textColor)}>
            {title}
          </h3>
          <p className={cn("text-sm font-medium", subTextColor)}>
            {fileCount} files
          </p>
        </div>

        {/* Glossy reflection effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-white/20 to-transparent opacity-50" />
      </motion.div>
    </motion.div>
  );
}