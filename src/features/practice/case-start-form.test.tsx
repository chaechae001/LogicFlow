// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import {
  act,
  cleanup,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { oliveyoungPracticeCase, type ThinkingCase } from "../../domain";
import { CaseStartForm } from "./case-start-form";

const mocks = vi.hoisted(() => ({
  createCase: vi.fn(),
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("../../repositories/browser-repository", () => ({
  createBrowserThinkingCaseRepository: () => ({
    createCase: mocks.createCase,
    getCase: vi.fn(),
    listCases: vi.fn(),
    saveResponseVersion: vi.fn(),
  }),
}));

const createdCase: ThinkingCase = {
  id: "created-case",
  userId: "local-user",
  practiceCaseId: oliveyoungPracticeCase.id,
  origin: "practice_library",
  title: oliveyoungPracticeCase.title,
  status: "in_progress",
  currentStage: "fact_interpretation",
  aiMode: "guide",
  initialImpression: "첫 생각",
  initialSolutionIdea: "해결안",
  decisionQuestion: "의사결정 질문",
  finalTopMessage: "",
  createdAt: "2026-08-02T12:00:00.000Z",
  updatedAt: "2026-08-02T12:00:00.000Z",
  completedAt: null,
};

afterEach(cleanup);

beforeEach(() => {
  mocks.createCase.mockReset();
  mocks.push.mockReset();
});

async function fillCaseStartForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("내 첫 생각"), "첫 생각");
  await user.type(screen.getByLabelText("이미 떠오른 해결안"), "해결안");
  await user.type(
    screen.getByLabelText("이 Case의 핵심 의사결정 질문"),
    "의사결정 질문",
  );

  return user;
}

describe("CaseStartForm", () => {
  it("저장 중 상태를 표시하고 생성된 Case의 첫 단계로 이동한다", async () => {
    let resolveCase: (thinkingCase: ThinkingCase) => void = () => undefined;
    mocks.createCase.mockImplementation(
      () =>
        new Promise<ThinkingCase>((resolve) => {
          resolveCase = resolve;
        }),
    );
    render(<CaseStartForm practiceCase={oliveyoungPracticeCase} />);
    const user = await fillCaseStartForm();

    await user.click(
      screen.getByRole("button", { name: "내 생각으로 Case 시작하기" }),
    );

    expect(
      screen.getByRole("button", { name: "Case를 저장하는 중..." }),
    ).toBeDisabled();
    expect(mocks.createCase).toHaveBeenCalledWith(
      expect.objectContaining({
        practiceCaseId: oliveyoungPracticeCase.id,
        initialImpression: "첫 생각",
        initialSolutionIdea: "해결안",
        decisionQuestion: "의사결정 질문",
      }),
    );

    await act(async () => {
      resolveCase(createdCase);
    });

    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalledWith(
        "/cases/created-case/workspace/fact_interpretation",
      );
    });
  });

  it("Repository 저장 실패를 안내하고 다시 제출할 수 있게 한다", async () => {
    mocks.createCase.mockRejectedValue(new Error("storage unavailable"));
    render(<CaseStartForm practiceCase={oliveyoungPracticeCase} />);
    const user = await fillCaseStartForm();

    await user.click(
      screen.getByRole("button", { name: "내 생각으로 Case 시작하기" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Case를 저장하지 못했습니다.",
    );
    expect(
      screen.getByRole("button", { name: "내 생각으로 Case 시작하기" }),
    ).toBeEnabled();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("빈 최초 입력을 Repository로 보내지 않고 필드별로 안내한다", async () => {
    render(<CaseStartForm practiceCase={oliveyoungPracticeCase} />);
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: "내 생각으로 Case 시작하기" }),
    );

    expect(screen.getByText("내 첫 생각을 작성해주세요.")).toBeInTheDocument();
    expect(
      screen.getByText("이미 떠오른 해결안을 작성해주세요."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("핵심 의사결정 질문을 작성해주세요."),
    ).toBeInTheDocument();
    expect(mocks.createCase).not.toHaveBeenCalled();
  });
});
