import { permanentRedirect } from "next/navigation";

export default function EarthPage() {
  permanentRedirect("/exhibits/atlas-of-worlds?world=earth");
}
