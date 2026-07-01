/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as education from "../education.js";
import type * as experience from "../experience.js";
import type * as files from "../files.js";
import type * as flowingMenu from "../flowingMenu.js";
import type * as header from "../header.js";
import type * as projects from "../projects.js";
import type * as recognitions from "../recognitions.js";
import type * as seed from "../seed.js";
import type * as services from "../services.js";
import type * as socials from "../socials.js";
import type * as techStack from "../techStack.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  education: typeof education;
  experience: typeof experience;
  files: typeof files;
  flowingMenu: typeof flowingMenu;
  header: typeof header;
  projects: typeof projects;
  recognitions: typeof recognitions;
  seed: typeof seed;
  services: typeof services;
  socials: typeof socials;
  techStack: typeof techStack;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
