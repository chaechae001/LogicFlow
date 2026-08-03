import { z } from "zod";

import { thinkingStageSchema } from "./thinking-stage";

const identifierSchema = z.string().trim().min(1);
const nonEmptyTextSchema = z.string().trim().min(1);
const nullableIdentifierSchema = identifierSchema.nullable();
const nullableTextSchema = nonEmptyTextSchema.nullable();
const isoDateTimeSchema = z.iso.datetime({ offset: true });
const nullableIsoDateTimeSchema = isoDateTimeSchema.nullable();

export const aiCoachModeSchema = z.enum([
  "guide",
  "coach",
  "challenge",
  "independent",
]);

export const practiceCaseDifficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export const thinkingCaseOriginSchema = z.enum([
  "practice_library",
  "user_problem",
  "ai_generated",
]);

export const thinkingCaseStatusSchema = z.enum([
  "draft",
  "in_progress",
  "needs_review",
  "completed",
  "reported",
  "published",
  "archived",
]);

export const caseStepStatusSchema = z.enum([
  "not_started",
  "writing",
  "review_requested",
  "revising",
  "completed",
]);

export const responseAuthorTypeSchema = z.enum([
  "user",
  "ai_suggestion",
  "user_revised_ai",
]);

export const hypothesisStatusSchema = z.enum([
  "active",
  "weakened",
  "rejected",
  "supported",
  "unknown",
]);

export const thinkingNodeTypeSchema = z.enum([
  "fact",
  "interpretation",
  "problem",
  "journey_friction",
  "hypothesis",
  "evidence",
  "validation",
  "alternative",
  "decision",
  "action",
  "reflection",
]);

export const thinkingEdgeRelationTypeSchema = z.enum([
  "causes",
  "supports",
  "opposes",
  "validates",
  "addresses",
  "derived_from",
  "selected_over",
]);

export const userSchema = z
  .object({
    id: identifierSchema,
    email: z.email(),
    displayName: nonEmptyTextSchema,
    targetRole: nonEmptyTextSchema,
    defaultAiMode: aiCoachModeSchema,
    createdAt: isoDateTimeSchema,
  })
  .strict();

export const practiceCaseSchema = z
  .object({
    id: identifierSchema,
    title: nonEmptyTextSchema,
    companyContext: nonEmptyTextSchema,
    role: nonEmptyTextSchema,
    domain: nonEmptyTextSchema,
    problemPattern: nonEmptyTextSchema,
    difficulty: practiceCaseDifficultySchema,
    expectedMinutes: z.number().int().positive(),
    businessContext: nonEmptyTextSchema,
    knownFacts: z.array(nonEmptyTextSchema).min(1),
    unknowns: z.array(nonEmptyTextSchema).min(1),
    taskRequest: nonEmptyTextSchema,
    primaryFramework: nonEmptyTextSchema,
    supportingFrameworks: z.array(nonEmptyTextSchema).min(1),
    sourceNote: nonEmptyTextSchema,
  })
  .strict();

export const thinkingCaseSchema = z
  .object({
    id: identifierSchema,
    userId: identifierSchema,
    practiceCaseId: nullableIdentifierSchema,
    origin: thinkingCaseOriginSchema,
    title: nonEmptyTextSchema,
    status: thinkingCaseStatusSchema,
    currentStage: thinkingStageSchema,
    aiMode: aiCoachModeSchema,
    finalTopMessage: z.string(),
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
    completedAt: nullableIsoDateTimeSchema,
  })
  .strict();

export const caseStepSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    stage: thinkingStageSchema,
    status: caseStepStatusSchema,
    startedAt: nullableIsoDateTimeSchema,
    completedAt: nullableIsoDateTimeSchema,
  })
  .strict();

export const fieldResponseSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    stage: thinkingStageSchema,
    fieldKey: identifierSchema,
    currentVersionId: identifierSchema,
  })
  .strict();

export const responseVersionSchema = z
  .object({
    id: identifierSchema,
    fieldResponseId: identifierSchema,
    version: z.number().int().positive(),
    contentJson: z.json(),
    authorType: responseAuthorTypeSchema,
    previousVersionId: nullableIdentifierSchema,
    createdAt: isoDateTimeSchema,
  })
  .strict();

export const journeyStageSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    order: z.number().int().nonnegative(),
    title: nonEmptyTextSchema,
    behavior: z.string(),
    goal: z.string(),
    touchpoint: z.string(),
    neededInformation: z.string(),
    emotion: z.string(),
    friction: z.string(),
    dataNeeded: z.string(),
    severity: z.string(),
    evidenceLevel: z.string(),
  })
  .strict();

export const hypothesisSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    statement: nonEmptyTextSchema,
    journeyStageId: nullableIdentifierSchema,
    category: z.string(),
    reason: z.string(),
    expectedIfTrue: z.string(),
    expectedIfFalse: z.string(),
    requiredData: z.string(),
    metric: z.string(),
    falsificationCondition: z.string(),
    confidence: z.string(),
    isAlternative: z.boolean(),
    status: hypothesisStatusSchema,
  })
  .strict();

export const validationPlanSchema = z
  .object({
    id: identifierSchema,
    hypothesisId: identifierSchema,
    validationQuestion: nonEmptyTextSchema,
    dataType: z.string(),
    source: z.string(),
    collectionMethod: z.string(),
    primaryMetric: z.string(),
    supportCriterion: z.string(),
    falsificationCriterion: z.string(),
    limitations: z.string(),
    accessibility: z.string(),
  })
  .strict();

export const alternativeSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    title: nonEmptyTextSchema,
    linkedHypothesisIds: z.array(identifierSchema),
    userValue: z.string(),
    description: z.string(),
    expectedImpact: z.string(),
    resources: z.string(),
    implementationDifficulty: z.string(),
    validationDifficulty: z.string(),
    risks: z.string(),
    privacyOperationsNotes: z.string(),
  })
  .strict();

export const decisionCriterionSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    name: nonEmptyTextSchema,
    description: z.string(),
    weight: z.number().finite().nonnegative(),
  })
  .strict();

export const alternativeScoreSchema = z
  .object({
    id: identifierSchema,
    alternativeId: identifierSchema,
    criterionId: identifierSchema,
    score: z.number().finite(),
    rationale: z.string(),
  })
  .strict();

export const actionPlanSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    linkedHypothesisId: identifierSchema,
    action: nonEmptyTextSchema,
    targetUsers: z.string(),
    scope: z.string(),
    prototype: z.string(),
    comparison: z.string(),
    metrics: z.array(nonEmptyTextSchema),
    successCriteria: z.string(),
    revisionCriteria: z.string(),
    stopCriteria: z.string(),
    nextDecision: z.string(),
  })
  .strict();

export const thinkingNodeSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    type: thinkingNodeTypeSchema,
    entityId: nullableIdentifierSchema,
    content: nonEmptyTextSchema,
    x: z.number().finite(),
    y: z.number().finite(),
    createdAt: isoDateTimeSchema,
  })
  .strict();

export const thinkingEdgeSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    sourceNodeId: identifierSchema,
    targetNodeId: identifierSchema,
    relationType: thinkingEdgeRelationTypeSchema,
  })
  .strict();

export const aiInteractionSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    stage: thinkingStageSchema,
    mode: aiCoachModeSchema,
    requestSnapshot: z.json(),
    response: z.json(),
    accepted: z.boolean(),
    userRevisionVersionId: nullableIdentifierSchema,
    createdAt: isoDateTimeSchema,
  })
  .strict();

export const reportSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    generatedSnapshot: z.json(),
    generatedAt: isoDateTimeSchema,
  })
  .strict();

export const portfolioSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    title: nonEmptyTextSchema,
    targetRole: nonEmptyTextSchema,
    selectedSections: z.array(identifierSchema),
    visibility: nonEmptyTextSchema,
    publicSlug: nullableTextSchema,
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
  })
  .strict();

export type AiCoachMode = z.infer<typeof aiCoachModeSchema>;
export type PracticeCaseDifficulty = z.infer<
  typeof practiceCaseDifficultySchema
>;
export type ThinkingCaseOrigin = z.infer<typeof thinkingCaseOriginSchema>;
export type ThinkingCaseStatus = z.infer<typeof thinkingCaseStatusSchema>;
export type CaseStepStatus = z.infer<typeof caseStepStatusSchema>;
export type ResponseAuthorType = z.infer<typeof responseAuthorTypeSchema>;
export type HypothesisStatus = z.infer<typeof hypothesisStatusSchema>;
export type ThinkingNodeType = z.infer<typeof thinkingNodeTypeSchema>;
export type ThinkingEdgeRelationType = z.infer<
  typeof thinkingEdgeRelationTypeSchema
>;
export type User = z.infer<typeof userSchema>;
export type PracticeCase = z.infer<typeof practiceCaseSchema>;
export type ThinkingCase = z.infer<typeof thinkingCaseSchema>;
export type CaseStep = z.infer<typeof caseStepSchema>;
export type FieldResponse = z.infer<typeof fieldResponseSchema>;
export type ResponseVersion = z.infer<typeof responseVersionSchema>;
export type JourneyStage = z.infer<typeof journeyStageSchema>;
export type Hypothesis = z.infer<typeof hypothesisSchema>;
export type ValidationPlan = z.infer<typeof validationPlanSchema>;
export type Alternative = z.infer<typeof alternativeSchema>;
export type DecisionCriterion = z.infer<typeof decisionCriterionSchema>;
export type AlternativeScore = z.infer<typeof alternativeScoreSchema>;
export type ActionPlan = z.infer<typeof actionPlanSchema>;
export type ThinkingNode = z.infer<typeof thinkingNodeSchema>;
export type ThinkingEdge = z.infer<typeof thinkingEdgeSchema>;
export type AiInteraction = z.infer<typeof aiInteractionSchema>;
export type Report = z.infer<typeof reportSchema>;
export type Portfolio = z.infer<typeof portfolioSchema>;
