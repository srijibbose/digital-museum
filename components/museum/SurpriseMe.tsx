"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { pickSurpriseExhibit } from "@/content/exhibit-discovery";
import styles from "./discovery.module.css";

type SurpriseExhibit = {
  id: string;
  route: string;
  enabled: boolean;
};

export function SurpriseMe({
  exhibits,
  random = Math.random,
}: {
  exhibits: SurpriseExhibit[];
  random?: () => number;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={styles.surpriseButton}
      onClick={() => {
        const exhibit = pickSurpriseExhibit(exhibits, random);
        if (exhibit) router.push(exhibit.route);
      }}
    >
      <Sparkles size={17} strokeWidth={1.6} aria-hidden="true" />
      <span>Surprise me</span>
    </button>
  );
}
