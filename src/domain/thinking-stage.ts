import { z } from "zod";

export const THINKING_STAGES = [
  "context",
  "observation",
  "problem_definition",
  "problem_structuring",
  "hypothesis",
  "evidence_validation",
  "decision",
  "solution_execution",
  "result_evaluation",
  "conclusion_reflection",
] as const;

export const thinkingStageSchema = z.enum(THINKING_STAGES);

export type ThinkingStage = z.infer<typeof thinkingStageSchema>;

export const WRITING_MODES = ["freeform", "structured"] as const;

export const writingModeSchema = z.enum(WRITING_MODES);

export type WritingMode = z.infer<typeof writingModeSchema>;
