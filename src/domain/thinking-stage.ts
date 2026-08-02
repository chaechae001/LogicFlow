import { z } from "zod";

export const THINKING_STAGES = [
  "fact_interpretation",
  "problem_definition",
  "customer_journey",
  "hypotheses",
  "validation",
  "alternatives",
  "action_plan",
  "conclusion_reflection",
] as const;

export const thinkingStageSchema = z.enum(THINKING_STAGES);

export type ThinkingStage = z.infer<typeof thinkingStageSchema>;
