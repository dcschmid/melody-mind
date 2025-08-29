// Generic module declarations for untyped JS imports used in the project
declare module "*.cjs";
declare module "*.mjs";
declare module "*.js";

// Allow importing JSON without explicit types
declare module "*.json" {
  const value: unknown;
  export default value;
}
