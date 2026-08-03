// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  THINKING_STAGES,
  oliveyoungPracticeCase,
  type ThinkingCase,
  type V2CaseStep,
} from "../../domain";
import type { V2ThinkingCaseBundle } from "../../repositories";
import { InvalidStoredDataError } from "../../repositories";
import {
  AiCoachPanel,
  WorkspaceShell,
  WorkspaceShellRoute,
} from "./workspace-shell";

const mocks = vi.hoisted(() => ({
  getCase: vi.fn(),
  push: vi.fn(),
  resetLocalData: vi.fn(),
  saveContextDraft: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("../../repositories/browser-repository", () => ({
  createBrowserThinkingCaseRepository: () => ({
    createCase: vi.fn(),
    getCase: mocks.getCase,
    resetLocalData: mocks.resetLocalData,
    saveContextDraft: mocks.saveContextDraft,
  }),
}));

const thinkingCase: ThinkingCase = {
  id: "case-04",
  userId: "local-user",
  practiceCaseId: "practice-oliveyoung-o2o-001",
  origin: "practice_library",
  title: "오프라인 상품 체험을 앱 구매 여정으로 연결하는 올리브영 O2O 서비스 개선",
  status: "in_progress",
  currentStage: "context",
  aiMode: "guide",
  finalTopMessage: "",
  createdAt: "2026-08-02T12:00:00.000Z",
  updatedAt: "2026-08-02T12:05:00.000Z",
  completedAt: null,
};

function createSteps(
  firstStatus: V2CaseStep["status"] = "writing",
): V2CaseStep[] {
  return THINKING_STAGES.map((stage, index) => ({
    id: `step-${index + 1}`,
    caseId: thinkingCase.id,
    stage,
    status: index === 0 ? firstStatus : "not_started",
    writingMode: null,
    startedAt: index === 0 ? thinkingCase.createdAt : null,
    completedAt: firstStatus === "completed" && index === 0 ? thinkingCase.updatedAt : null,
  }));
}

function createBundle(
  firstStatus: V2CaseStep["status"] = "writing",
): V2ThinkingCaseBundle {
  return {
    thinkingCase,
    steps: createSteps(firstStatus),
    fieldResponses: [],
    responseVersions: [],
  };
}

function createPersistedBundle(): V2ThinkingCaseBundle {
  const bundle = createBundle();
  bundle.steps[0] = {
    ...bundle.steps[0]!,
    writingMode: "structured",
  };
  bundle.fieldResponses = [
    {
      id: "response-freeform",
      caseId: thinkingCase.id,
      stage: "context",
      fieldKey: "context.freeform",
      currentVersionId: "version-freeform",
    },
    {
      id: "response-goal",
      caseId: thinkingCase.id,
      stage: "context",
      fieldKey: "context.goal",
      currentVersionId: "version-goal",
    },
  ];
  bundle.responseVersions = [
    {
      id: "version-freeform",
      fieldResponseId: "response-freeform",
      version: 1,
      contentJson: { type: "text", value: "저장된 자유 작성" },
      authorType: "user",
      saveReason: "explicit_draft",
      previousVersionId: null,
      createdAt: thinkingCase.updatedAt,
    },
    {
      id: "version-goal",
      fieldResponseId: "response-goal",
      version: 1,
      contentJson: { type: "text", value: "저장된 목적" },
      authorType: "user",
      saveReason: "explicit_draft",
      previousVersionId: null,
      createdAt: thinkingCase.updatedAt,
    },
  ];
  return bundle;
}

afterEach(cleanup);

beforeEach(() => {
  mocks.getCase.mockReset();
  mocks.push.mockReset();
  mocks.resetLocalData.mockReset();
  mocks.saveContextDraft.mockReset();
});

describe("WorkspaceShellRoute", () => {
  it("Repository로 Case를 조회하고 3열 Workspace 상태를 표시한다", async () => {
    mocks.getCase.mockResolvedValue(createBundle());

    render(
      <WorkspaceShellRoute
        caseId={thinkingCase.id}
        stage="context"
      />,
    );

    expect(
      screen.getByLabelText("Thinking Case를 불러오는 중"),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "목적·맥락 이해" }),
    ).toBeInTheDocument();

    expect(mocks.getCase).toHaveBeenCalledWith(thinkingCase.id);
    const navigation = screen.getByRole("navigation", { name: "사고 단계" });
    expect(within(navigation).getAllByRole("button")).toHaveLength(10);
    expect(screen.getByText("1 / 10")).toBeInTheDocument();
    expect(
      screen.getByText(
        /이번 Case에서 무엇을 이해하고 결정하려는지/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "생각을 먼저 남겨주세요." })).toBeInTheDocument();
    expect(screen.getByText("Practice 문제 다시 보기")).toBeInTheDocument();
    expect(screen.getByText(oliveyoungPracticeCase.taskRequest)).toBeInTheDocument();
    expect(screen.getByLabelText(/저장 상태:/)).toBeInTheDocument();
  });

  it("존재하지 않는 Case를 Practice Library 복구 동선으로 안내한다", async () => {
    mocks.getCase.mockResolvedValue(null);

    render(
      <WorkspaceShellRoute
        caseId="missing-case"
        stage="context"
      />,
    );

    expect(
      await screen.findByRole("heading", {
        name: "저장된 Thinking Case가 없습니다.",
      }),
    ).toBeInTheDocument();

    await userEvent.setup().click(
      screen.getByRole("button", { name: "Practice Library로 이동" }),
    );
    expect(mocks.push).toHaveBeenCalledWith("/practice");
  });

  it("손상된 V2 데이터는 console.error 없이 V2 전용 초기화 UI로 복구한다", async () => {
    const invalidData = new InvalidStoredDataError("invalid V2 data");
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);
    mocks.getCase
      .mockRejectedValueOnce(invalidData)
      .mockResolvedValueOnce(null);
    mocks.resetLocalData.mockResolvedValue(undefined);

    render(<WorkspaceShellRoute caseId="broken-case" stage="context" />);

    expect(
      await screen.findByRole("heading", {
        name: "저장된 V2 데이터가 현재 구조와 호환되지 않습니다.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "V1 데이터는 삭제되지 않으며",
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "[Thinking Flow V2] V2 Thinking Case 조회 실패",
      invalidData,
    );

    await userEvent.setup().click(
      screen.getByRole("button", { name: "V2 로컬 데이터 초기화" }),
    );

    expect(mocks.resetLocalData).toHaveBeenCalledOnce();
    expect(
      await screen.findByRole("heading", {
        name: "저장된 Thinking Case가 없습니다.",
      }),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it("알 수 없는 조회 오류만 console.error로 기록한다", async () => {
    const unknownError = new Error("unknown");
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.getCase.mockRejectedValue(unknownError);

    render(<WorkspaceShellRoute caseId="broken-case" stage="context" />);

    expect(
      await screen.findByRole("heading", {
        name: "Workspace를 불러오지 못했습니다.",
      }),
    ).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[Thinking Flow V2] V2 Thinking Case 조회 실패",
      unknownError,
    );

    consoleErrorSpy.mockRestore();
  });
});

describe("WorkspaceShell Soft Gate", () => {
  it("미완료 단계에서 앞으로 이동할 때 경고 후 사용자가 계속 이동할 수 있다", async () => {
    render(<WorkspaceShell bundle={createBundle()} stage="context" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "다음 단계" }));

    const dialog = screen.getByRole("dialog", { name: "이동할 수 있지만, 먼저 확인해보세요." });
    expect(dialog).toHaveTextContent("목적·맥락 이해 단계는 아직 완료되지 않았습니다.");
    expect(mocks.push).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "그래도 이동하기" }));

    expect(mocks.push).toHaveBeenCalledWith(
      "/cases/case-04/workspace/observation",
    );
  });

  it("완료된 단계에서는 경고 없이 다음 단계로 이동한다", async () => {
    render(
      <WorkspaceShell
        bundle={createBundle("completed")}
        stage="context"
      />,
    );

    await userEvent.setup().click(
      screen.getByRole("button", { name: "다음 단계" }),
    );

    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalledWith(
        "/cases/case-04/workspace/observation",
      );
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("이전 단계 이동은 Soft Gate 없이 새 10단계 경로를 사용한다", async () => {
    render(<WorkspaceShell bundle={createBundle()} stage="observation" />);

    await userEvent.setup().click(
      screen.getByRole("button", { name: "이전 단계" }),
    );

    expect(mocks.push).toHaveBeenCalledWith("/cases/case-04/workspace/context");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("WorkspaceShell 작성 방식", () => {
  it("미선택 상태에서 두 작성 방식 사이를 전환해도 화면 입력을 유지한다", async () => {
    render(<WorkspaceShell bundle={createBundle()} stage="context" />);
    const user = userEvent.setup();
    const freeformButton = screen.getByRole("button", { name: /자유 작성/ });
    const structuredButton = screen.getByRole("button", { name: /구조화 입력/ });

    expect(screen.getByText("작성 방식 미선택")).toBeInTheDocument();
    expect(freeformButton).toHaveAttribute("aria-pressed", "false");
    expect(structuredButton).toHaveAttribute("aria-pressed", "false");

    await user.click(freeformButton);
    expect(freeformButton).toHaveAttribute("aria-pressed", "true");
    const freeform = screen.getByLabelText("목적과 맥락에 대한 내 첫 생각");
    await user.type(freeform, "자유롭게 적은 첫 생각");

    await user.click(structuredButton);
    expect(freeformButton).toHaveAttribute("aria-pressed", "false");
    expect(structuredButton).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByText(
        "이 Case에서 달성하려는 목적은 무엇인가?",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("필수 후보")).toHaveLength(2);
    await user.type(
      screen.getByLabelText("이 Case에서 달성하려는 목적은 무엇인가?"),
      "구조화된 목적",
    );

    await user.click(freeformButton);
    expect(
      screen.getByLabelText("목적과 맥락에 대한 내 첫 생각"),
    ).toHaveValue("자유롭게 적은 첫 생각");
    expect(
      screen.getByText(/작성 방식을 바꿔도 이전에 작성한 내용은 유지됩니다/),
    ).toBeInTheDocument();
  });

  it("학습 예시를 기본으로 접고 네 구조화 질문을 config에서 렌더링한다", async () => {
    render(<WorkspaceShell bundle={createBundle()} stage="context" />);

    const goodExampleSummary = screen.getByText("좋은 예시");
    expect(goodExampleSummary.closest("details")).not.toHaveAttribute("open");

    await userEvent.setup().click(
      screen.getByRole("button", { name: /구조화 입력/ }),
    );

    expect(
      screen.getByLabelText("이 Case에서 달성하려는 목적은 무엇인가?"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        "현재 상황과 이 문제를 지금 다루는 이유는 무엇인가?",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("주요 이해관계자는 누구인가?"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        "확인해야 할 제약, 범위, 성공 기준은 무엇인가?",
      ),
    ).toBeInTheDocument();
  });

  it("저장된 mode와 자유·구조화 응답을 reload 상태에서 복원한다", async () => {
    render(
      <WorkspaceShell bundle={createPersistedBundle()} stage="context" />,
    );

    expect(
      screen.getByRole("button", { name: /구조화 입력/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByLabelText("이 Case에서 달성하려는 목적은 무엇인가?"),
    ).toHaveValue("저장된 목적");

    await userEvent.setup().click(
      screen.getByRole("button", { name: /자유 작성/ }),
    );
    expect(
      screen.getByLabelText("목적과 맥락에 대한 내 첫 생각"),
    ).toHaveValue("저장된 자유 작성");
  });
});

describe("WorkspaceShell Context 초안 저장", () => {
  it("양쪽 mode의 모든 dirty field와 현재 mode를 한 번에 저장한다", async () => {
    const savedBundle = createPersistedBundle();
    savedBundle.steps[0] = {
      ...savedBundle.steps[0]!,
      writingMode: "freeform",
    };
    mocks.saveContextDraft.mockResolvedValue({
      appendedVersions: savedBundle.responseVersions,
      bundle: savedBundle,
    });
    render(<WorkspaceShell bundle={createBundle()} stage="context" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /자유 작성/ }));
    await user.type(
      screen.getByLabelText("목적과 맥락에 대한 내 첫 생각"),
      "저장할 자유 작성",
    );
    await user.click(screen.getByRole("button", { name: /구조화 입력/ }));
    await user.type(
      screen.getByLabelText("이 Case에서 달성하려는 목적은 무엇인가?"),
      "저장할 구조화 목적",
    );
    await user.click(screen.getByRole("button", { name: /자유 작성/ }));

    expect(screen.getByText("저장 전 변경사항 있음")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "초안 저장" }));

    await waitFor(() => {
      expect(mocks.saveContextDraft).toHaveBeenCalledWith({
        caseId: thinkingCase.id,
        writingMode: "freeform",
        fields: [
          {
            fieldKey: "context.freeform",
            contentJson: { type: "text", value: "저장할 자유 작성" },
          },
          {
            fieldKey: "context.goal",
            contentJson: { type: "text", value: "저장할 구조화 목적" },
          },
        ],
      });
    });
    expect(screen.getByText("저장됨")).toBeInTheDocument();
  });

  it("저장 중 중복 클릭을 막고 실패 후 입력을 유지해 재시도한다", async () => {
    let resolveSave:
      | ((value: {
          appendedVersions: V2ThinkingCaseBundle["responseVersions"];
          bundle: V2ThinkingCaseBundle;
        }) => void)
      | undefined;
    mocks.saveContextDraft
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSave = resolve;
          }),
      )
      .mockRejectedValueOnce(new Error("unexpected"))
      .mockResolvedValueOnce({
        appendedVersions: [],
        bundle: createBundle(),
      });
    render(<WorkspaceShell bundle={createBundle()} stage="context" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /자유 작성/ }));
    const textarea = screen.getByLabelText(
      "목적과 맥락에 대한 내 첫 생각",
    );
    await user.type(textarea, "실패해도 남을 입력");
    await user.click(screen.getByRole("button", { name: "초안 저장" }));

    expect(screen.getByRole("button", { name: "저장 중..." })).toBeDisabled();
    resolveSave?.({
      appendedVersions: [],
      bundle: createBundle(),
    });
    await screen.findByText("저장됨");

    await user.type(textarea, " 수정");
    await user.click(screen.getByRole("button", { name: "초안 저장" }));
    expect(await screen.findByText("저장 실패")).toBeInTheDocument();
    expect(textarea).toHaveValue("실패해도 남을 입력 수정");
    expect(screen.getByRole("button", { name: "초안 저장" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "초안 저장" }));
    expect(await screen.findByText("저장됨")).toBeInTheDocument();
  });
});

describe("AiCoachPanel", () => {
  it("locked 상태에서는 사용자 작성 전 점검을 비활성화한다", () => {
    render(<AiCoachPanel state="locked" />);

    expect(screen.getByRole("heading", { name: "생각을 먼저 남겨주세요." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "AI 점검은 작성 후 활성화됩니다" })).toBeDisabled();
  });

  it("ready 상태에서는 점검 요청 상태와 동작을 제공한다", async () => {
    const onRequestReview = vi.fn();
    render(
      <AiCoachPanel onRequestReview={onRequestReview} state="ready" />,
    );

    const requestButton = screen.getByRole("button", { name: "AI 점검 요청" });
    expect(screen.getByRole("heading", { name: "내 생각을 점검할 준비가 됐습니다." })).toBeInTheDocument();
    expect(requestButton).toBeEnabled();

    await userEvent.setup().click(requestButton);
    expect(onRequestReview).toHaveBeenCalledOnce();
  });
});
