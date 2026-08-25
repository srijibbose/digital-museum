"use client";

import { memo } from "react";
import type { AnatomyStructure } from "@/lib/anatomy/anatomy-schema";
import styles from "./anatomy.module.css";

export const StructureRail = memo(function StructureRail({
  structures,
  selectedId,
  onSelect,
}: {
  structures: AnatomyStructure[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className={styles.structureRail} aria-label="Named structures">
      <div className={styles.structureRailHeading}>
        <span>Structures</span>
        <small>{structures.length} addressable</small>
      </div>
      <div className={styles.structureList}>
        {structures.map((structure, index) => (
          <button
            type="button"
            key={structure.id}
            data-active={structure.id === selectedId || undefined}
            aria-pressed={structure.id === selectedId}
            onClick={() => onSelect(structure.id)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {structure.label}
          </button>
        ))}
      </div>
    </div>
  );
});
