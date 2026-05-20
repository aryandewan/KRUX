import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("api/generate", "routes/api/generate.tsx")] satisfies RouteConfig;
