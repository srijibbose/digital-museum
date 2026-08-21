import { permanentRedirect } from "next/navigation";

export default function MoonPage() {
  permanentRedirect("/exhibits/atlas-of-worlds?world=moon");
}
