import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo/json-ld";
import styles from "./breadcrumbs.module.css";

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav className={styles.navigation} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const current = index === items.length - 1;

          return (
            <li className={styles.item} key={item.pathname}>
              <Link
                aria-current={current ? "page" : undefined}
                className={current ? styles.current : styles.link}
                href={item.pathname}
                prefetch={false}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
