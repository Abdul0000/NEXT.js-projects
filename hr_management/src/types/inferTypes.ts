import type { AppRouter } from "@/trpc/routers/_app";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;
export type CreateEmployeeOutput = RouterOutput['createNewEmployee']['createEmployee'];
export type CreateEmployeeInput = RouterInput['createNewEmployee']['createEmployee'];
