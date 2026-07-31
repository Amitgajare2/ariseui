import { componentPageMetadata } from "@/lib/seo";
import Demo from "./demo";

export const metadata = componentPageMetadata("/components/github-calendar");

export default function Page() {
  return <Demo />;
}

