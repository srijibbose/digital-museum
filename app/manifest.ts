import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Loupe",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#070a0b",
    theme_color: "#070a0b",
  };
}
