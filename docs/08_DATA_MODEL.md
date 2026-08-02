# 08. MVP Data Model

## Stage enum

```ts
export type ThinkingStage =
  | "fact_interpretation"
  | "problem_definition"
  | "customer_journey"
  | "hypotheses"
  | "validation"
  | "alternatives"
  | "action_plan"
  | "conclusion_reflection";
```

## Core entities

### User
- id
- email
- displayName
- targetRole
- defaultAiMode
- createdAt

### PracticeCase
- id
- title
- companyContext
- role
- domain
- problemPattern
- difficulty
- expectedMinutes
- businessContext
- knownFacts
- unknowns
- taskRequest
- primaryFramework
- supportingFrameworks
- sourceNote

### ThinkingCase
- id
- userId
- practiceCaseId nullable
- origin: practice_library | user_problem | ai_generated
- title
- status: draft | in_progress | needs_review | completed | reported | published | archived
- currentStage
- aiMode
- initialImpression
- initialSolutionIdea
- decisionQuestion
- finalTopMessage
- createdAt
- updatedAt
- completedAt

### CaseStep
- id
- caseId
- stage
- status: not_started | writing | review_requested | revising | completed
- startedAt
- completedAt

### FieldResponse
논리적 필드의 현재 포인터.
- id
- caseId
- stage
- fieldKey
- currentVersionId

### ResponseVersion
- id
- fieldResponseId
- version
- contentJson
- authorType: user | ai_suggestion | user_revised_ai
- previousVersionId nullable
- createdAt

### JourneyStage
- id
- caseId
- order
- title
- behavior
- goal
- touchpoint
- neededInformation
- emotion
- friction
- dataNeeded
- severity
- evidenceLevel

### Hypothesis
- id
- caseId
- statement
- journeyStageId nullable
- category
- reason
- expectedIfTrue
- expectedIfFalse
- requiredData
- metric
- falsificationCondition
- confidence
- isAlternative
- status: active | weakened | rejected | supported | unknown

### ValidationPlan
- id
- hypothesisId
- validationQuestion
- dataType
- source
- collectionMethod
- primaryMetric
- supportCriterion
- falsificationCriterion
- limitations
- accessibility

### Alternative
- id
- caseId
- title
- linkedHypothesisIds
- userValue
- description
- expectedImpact
- resources
- implementationDifficulty
- validationDifficulty
- risks
- privacyOperationsNotes

### DecisionCriterion
- id
- caseId
- name
- description
- weight

### AlternativeScore
- id
- alternativeId
- criterionId
- score
- rationale

### ActionPlan
- id
- caseId
- linkedHypothesisId
- action
- targetUsers
- scope
- prototype
- comparison
- metrics
- successCriteria
- revisionCriteria
- stopCriteria
- nextDecision

### ThinkingNode
- id
- caseId
- type
- entityId nullable
- content
- x
- y
- createdAt

### ThinkingEdge
- id
- caseId
- sourceNodeId
- targetNodeId
- relationType

### AiInteraction
- id
- caseId
- stage
- mode
- requestSnapshot
- response
- accepted
- userRevisionVersionId nullable
- createdAt

### Report
- id
- caseId
- generatedSnapshot
- generatedAt

### Portfolio
- id
- caseId
- title
- targetRole
- selectedSections
- visibility
- publicSlug nullable
- createdAt
- updatedAt

## Persistence architecture

```ts
export interface ThinkingCaseRepository {
  createCase(input: CreateCaseInput): Promise<ThinkingCase>;
  getCase(caseId: string): Promise<ThinkingCaseBundle | null>;
  listCases(): Promise<ThinkingCaseSummary[]>;
  saveResponseVersion(input: SaveResponseVersionInput): Promise<ResponseVersion>;
  updateStepStatus(input: UpdateStepStatusInput): Promise<void>;
  saveJourneyStages(input: SaveJourneyStagesInput): Promise<void>;
  saveHypotheses(input: SaveHypothesesInput): Promise<void>;
  saveValidationPlans(input: SaveValidationPlansInput): Promise<void>;
  saveAlternatives(input: SaveAlternativesInput): Promise<void>;
  saveActionPlan(input: SaveActionPlanInput): Promise<void>;
}
```

처음에는 LocalStorageRepository를 구현하고 이후 SupabaseRepository로 교체한다.
