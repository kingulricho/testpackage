"use client";

import { useAppStore } from "@/hooks/bears";
import Paypall from "./ui/paypall";

export default function Home() {
  const { bears, increase, reset } = useAppStore();
  return (
    <div className="flex flex-col gap-4">
      <div>{bears}</div>
      <button
        className="bg-blue-300"
        onClick={() => {
          increase(1);
        }}
      >
        increase
      </button>
      <button
        className="bg-red-300"
        onClick={() => {
          reset();
        }}
      >
        reset
      </button>

      <Paypall />
    </div>
  );
}
