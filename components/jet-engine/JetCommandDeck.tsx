"use client";

import { memo } from "react";
import { jetEngine } from "@/content/jet-engine";
import type { JetCycleResult } from "@/lib/jet-engine/jet-engine-model";
import type { JetProfileId, JetViewId } from "@/lib/jet-engine/jet-engine-schema";
import styles from "./jet-engine.module.css";

export const JetCommandDeck = memo(function JetCommandDeck({
  profileId,
  viewId,
  cycle,
  onProfileChange,
  onViewChange,
}: {
  profileId: JetProfileId;
  viewId: JetViewId;
  cycle: JetCycleResult;
  onProfileChange: (id: JetProfileId) => void;
  onViewChange: (id: JetViewId) => void;
}) {
  return (
    <div className={styles.commandDeck}>
      <div className={styles.modeGroup} aria-label="Scientific views">
        <span>Read the engine</span>
        <div>
          {jetEngine.views.map((view) => (
            <button
              type="button"
              key={view.id}
              aria-pressed={view.id === viewId}
              data-active={view.id === viewId || undefined}
              onClick={() => onViewChange(view.id)}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.profileGroup} aria-label="Operating profiles">
        <span>Operating condition</span>
        <div>
          {jetEngine.profiles.map((profile) => (
            <button
              type="button"
              key={profile.id}
              aria-pressed={profile.id === profileId}
              data-active={profile.id === profileId || undefined}
              onClick={() => onProfileChange(profile.id)}
            >
              <b>{profile.label}</b>
              <small>{profile.throttlePercent}% model power</small>
            </button>
          ))}
        </div>
      </div>

      <dl className={styles.cycleSummary} aria-label="Model outputs">
        <div>
          <dt>Specific net thrust</dt>
          <dd>{Math.round(cycle.output.specificThrustNsKg)} <small>N·s/kg inlet air</small></dd>
        </div>
        <div>
          <dt>Fan-stream share</dt>
          <dd>{Math.round(cycle.output.bypassContributionPercent)} <small>% model thrust</small></dd>
        </div>
        <div>
          <dt>Fuel / core air</dt>
          <dd>{cycle.output.fuelAirRatioGKg.toFixed(1)} <small>g/kg</small></dd>
        </div>
      </dl>
    </div>
  );
});
