import Link from "next/link";
import type { ReactNode } from "react";
import type { ExhibitDefinition } from "@/content/exhibits";
import {
  canEnterExhibit,
  type ExhibitViewer,
} from "@/lib/auth/exhibit-access";
import styles from "./exhibit-access.module.css";

type ExhibitAccessBoundaryProps = {
  exhibit: ExhibitDefinition;
  viewer?: ExhibitViewer;
  signInPath?: string;
  children: ReactNode;
};

const SIGNED_OUT_VIEWER: ExhibitViewer = { signedIn: false };

export function getExhibitAccessRegionId(
  exhibit: Pick<ExhibitDefinition, "slug">,
) {
  return `${exhibit.slug}-member-content`;
}

export function ExhibitAccessBoundary({
  exhibit,
  viewer = SIGNED_OUT_VIEWER,
  signInPath = "/sign-in",
  children,
}: ExhibitAccessBoundaryProps) {
  if (exhibit.access.mode === "private") return null;

  const accessRegionId = getExhibitAccessRegionId(exhibit);

  if (canEnterExhibit(exhibit, viewer)) {
    return (
      <div className={`member-content ${styles.boundary}`} id={accessRegionId}>
        {children}
      </div>
    );
  }

  if (exhibit.access.mode !== "members") return null;

  const returnTo = encodeURIComponent(exhibit.route);

  return (
    <div
      className={`member-content ${styles.boundary} ${styles.gated}`}
      id={accessRegionId}
    >
      <section className={styles.gate} aria-labelledby={`${exhibit.slug}-access-title`}>
        <p className={styles.eyebrow}>Member access</p>
        <h2 id={`${exhibit.slug}-access-title`}>{exhibit.access.gateLabel}</h2>
        <p className={styles.description}>{exhibit.access.gateDescription}</p>
        <Link className={styles.signInLink} href={`${signInPath}?returnTo=${returnTo}`}>
          Sign in to enter
        </Link>
      </section>
    </div>
  );
}
