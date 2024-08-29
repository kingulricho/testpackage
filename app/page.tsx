"use client";

import { useAppStore } from "@/hooks/bears";

export default function Home() {
  const { bears, increase } = useAppStore();
  return (
    <div>
      <div>{bears}</div>
      <button
        onClick={() => {
          increase(1);
        }}
      >
        increase
      </button>
    </div>
  );
}
