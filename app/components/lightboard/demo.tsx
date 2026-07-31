"use client"

import { useState } from "react"

import { LightBoard, PatternCell } from "@/components/ui/lightboard"

export default function LightBoardDemo() {
  const [controlledDrawState, setControlledDrawState] =
    useState<PatternCell>("2")
  const [controlledHoverState, setControlledHoverState] = useState(false)

  const cycleDrawState = () => {
    setControlledDrawState((prev) => {
      switch (prev) {
        case "0":
          return "1"
        case "1":
          return "2"
        case "2":
          return "3"
        case "3":
          return "0"
        default:
          return "0"
      }
    })
  }

  return (
    <div className="space-y-2 lg:space-y-4 p-2 lg:p-8  ">
 
      {/* Basic example */}
      <div className="max-w-md w-full bg-black mt-20">
        <LightBoard
          text="Hello World"
          rows={7}
          gap={1}
          lightSize={4}
          font="default"
          updateInterval={150}
          colors={{
            background: "#1a1a1a",
            textDim: "#3a3a3a",
            drawLine: "#7a7a7a",
            textBright: "#ffffff",
          }}
        />
      </div>

      {/* Red Alert */}
      <div className="max-w-lg w-full bg-black">
        <LightBoard
          text="DANGER ZONE"
          rows={10}
          gap={1}
          lightSize={5}
          font="default"
          updateInterval={100}
          colors={{
            background: "#1a0000",
            textDim: "#4a0000",
            drawLine: "#8a0000",
            textBright: "#ff0000",
          }}
        />
      </div>



    </div>
  )
}