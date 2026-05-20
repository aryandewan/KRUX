import type { Route } from "./+types/home";
import App from "~/main/app";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KRUX - A NEW GEN CODING PLATFORM" },
    {
      name: "PRACTICE CODING LIKE NEVER BEFORE",
      content:
        "Practice coding like never before with our innovative platform.",
    },
  ];
}

export default function Home() {
  return <App />;
}
