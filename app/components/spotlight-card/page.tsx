import { componentPageMetadata } from "@/lib/seo";
import Demo from "./demo";

export const metadata = componentPageMetadata("/components/spotlight-card");

export default function Page() {
  return <Demo />;
}
