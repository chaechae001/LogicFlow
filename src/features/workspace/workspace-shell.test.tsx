// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  THINKING_STAGES,
  oliveyoungPracticeCase,
  type CaseStep,
  type ThinkingCase,
} from "../../domain";
import type { ThinkingCaseBundle } from "../../repositories";
import {
  AiCoachPanel,
  WorkspaceShell,
  WorkspaceShellRoute,
} from "./workspace-shell";

const mocks = vi.hoisted(() => ({
  getCase: vi.fn(),
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("../../repositories/browser-repository", () => ({
  createBrowserThinkingCaseRepository: () => ({
    createCase: vi.fn(),
    getCase: mocks.getCase,
    listCases: vi.fn(),
    saveResponseVersion: vi.fn(),
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

function createSteps(firstStatus: CaseStep["status"] = "writing"): CaseStep[] {
  return THINKING_STAGES.map((stage, index) => ({
    id: `step-${index + 1}`,
    caseId: thinkingCase.id,
    stage,
    status: index === 0 ? firstStatus : "not_started",
    startedAt: index === 0 ? thinkingCase.createdAt : null,
    completedAt: firstStatus === "completed" && index === 0 ? thinkingCase.updatedAt : null,
  }));
}

function createBundle(firstStatus: CaseStep["status"] = "writing"): ThinkingCaseBundle {
  return {
    thinkingCase,
    steps: createSteps(firstStatus),
    fieldResponses: [],
    responseVersions: [],
  };
}

afterEach(cleanup);

beforeEach(() => {
  mocks.getCase.mockReset();
  mocks.push.mockReset();
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
  it("미선택 상태에서 자유 작성과 구조화 입력 사이를 전환한다", async () => {
    render(<WorkspaceShell bundle={createBundle()} stage="context" />);
    const user = userEvent.setup();
    const freeformButton = screen.getByRole("button", { name: /자유 작성/ });
    const structuredButton = screen.getByRole("button", { name: /구조화 입력/ });

    expect(screen.getByText("작성 방식 미선택")).toBeInTheDocument();
    expect(freeformButton).toHaveAttribute("aria-pressed", "false");
    expect(structuredButton).toHaveAttribute("aria-pressed", "false");

    await user.click(freeformButton);
    expect(screen.getByText("자유 작성 선택됨")).toBeInTheDocument();
    expect(freeformButton).toHaveAttribute("aria-pressed", "true");

    await user.click(structuredButton);
    expect(screen.getByText("구조화 입력 선택됨")).toBeInTheDocument();
    expect(freeformButton).toHaveAttribute("aria-pressed", "false");
    expect(structuredButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/작성한 내용과 수정 이력은 삭제되지 않습니다/)).toBeInTheDocument();
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
