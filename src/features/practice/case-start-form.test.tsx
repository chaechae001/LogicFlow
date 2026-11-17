// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { oliveyoungPracticeCase, type ThinkingCase } from "../../domain";
import {
  InvalidStoredDataError,
  StorageAccessError,
  UnsupportedStorageVersionError,
} from "../../repositories";
import { CaseStartForm } from "./case-start-form";

const mocks = vi.hoisted(() => ({
  createCase: vi.fn(),
  push: vi.fn(),
  resetLocalData: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("../../repositories/browser-repository", () => ({
  createBrowserThinkingCaseRepository: () => ({
    createCase: mocks.createCase,
    getCase: vi.fn(),
    resetLocalData: mocks.resetLocalData,
    saveContextDraft: vi.fn(),
  }),
}));

const createdCase: ThinkingCase = {
  id: "created-case",
  userId: "local-user",
  practiceCaseId: oliveyoungPracticeCase.id,
  origin: "practice_library",
  title: oliveyoungPracticeCase.title,
  status: "in_progress",
  currentStage: "context",
  aiMode: "guide",
  finalTopMessage: "",
  createdAt: "2026-08-03T12:00:00.000Z",
  updatedAt: "2026-08-03T12:00:00.000Z",
  completedAt: null,
};

let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

afterEach(() => {
  cleanup();
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockRestore();
});

beforeEach(() => {
  mocks.createCase.mockReset();
  mocks.push.mockReset();
  mocks.resetLocalData.mockReset();
  consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
  consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

describe("CaseStartForm", () => {
  it("사전 작성 영역 없이 Case를 생성하고 context 단계로 이동한다", async () => {
    let resolveCase: (thinkingCase: ThinkingCase) => void = () => undefined;
    mocks.createCase.mockImplementation(
      () =>
        new Promise<ThinkingCase>((resolve) => {
          resolveCase = resolve;
        }),
    );
    render(<CaseStartForm practiceCase={oliveyoungPracticeCase} />);
    const user = userEvent.setup();

    expect(screen.queryByLabelText("내 첫 생각")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("이미 떠오른 해결안")).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("이 Case의 핵심 의사결정 질문"),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "이 문제로 시작하기" }));

    expect(screen.getByRole("button", { name: "Case를 만드는 중..." })).toBeDisabled();
    expect(mocks.createCase).toHaveBeenCalledWith({
      userId: "local-user",
      practiceCaseId: oliveyoungPracticeCase.id,
      origin: "practice_library",
      title: oliveyoungPracticeCase.title,
      aiMode: "guide",
    });

    await act(async () => {
      resolveCase(createdCase);
    });

    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalledWith(
        "/cases/created-case/workspace/context",
      );
    });
  });

  it("version 1 오류를 저장 공간 부족과 구분하고 명시적 초기화 후 재시작한다", async () => {
    mocks.createCase
      .mockRejectedValueOnce(new UnsupportedStorageVersionError(1))
      .mockResolvedValueOnce(createdCase);
    mocks.resetLocalData.mockResolvedValue(undefined);
    render(<CaseStartForm practiceCase={oliveyoungPracticeCase} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "이 문제로 시작하기" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "이전에 저장된 V2 데이터가 현재 버전과 호환되지 않습니다.",
    );
    expect(alert).not.toHaveTextContent("저장 공간");

    await user.click(
      screen.getByRole("button", { name: "V2 로컬 데이터 초기화" }),
    );

    expect(mocks.resetLocalData).toHaveBeenCalledOnce();
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Thinking Flow V2 로컬 데이터를 초기화했습니다.",
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "[Thinking Flow] Practice Case 시작 실패",
      expect.objectContaining({ kind: "unsupported_storage_version" }),
    );

    await user.click(screen.getByRole("button", { name: "이 문제로 시작하기" }));
    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalledWith(
        "/cases/created-case/workspace/context",
      );
    });
  });

  it("현재 version의 잘못된 저장 데이터에 초기화 UI를 제공하고 재시작한다", async () => {
    const invalidStoredData = new InvalidStoredDataError(
      "localStorage의 Thinking Flow 데이터 형태가 유효하지 않습니다.",
    );
    mocks.createCase
      .mockRejectedValueOnce(invalidStoredData)
      .mockResolvedValueOnce(createdCase);
    mocks.resetLocalData.mockResolvedValue(undefined);
    render(<CaseStartForm practiceCase={oliveyoungPracticeCase} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "이 문제로 시작하기" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "이전에 저장된 V2 데이터가 현재 구조와 호환되지 않습니다.",
    );
    expect(alert).toHaveTextContent(
      "이 브라우저의 Thinking Flow V2 데이터만 삭제됩니다.",
    );
    expect(
      screen.getByRole("button", { name: "V2 로컬 데이터 초기화" }),
    ).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "[Thinking Flow] Practice Case 시작 실패",
      expect.objectContaining({
        error: invalidStoredData,
        kind: "invalid_stored_data",
      }),
    );

    await user.click(
      screen.getByRole("button", { name: "V2 로컬 데이터 초기화" }),
    );
    expect(mocks.resetLocalData).toHaveBeenCalledOnce();
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Thinking Flow V2 로컬 데이터를 초기화했습니다.",
    );

    await user.click(screen.getByRole("button", { name: "이 문제로 시작하기" }));
    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalledWith(
        "/cases/created-case/workspace/context",
      );
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("브라우저 저장소 접근 실패를 별도 메시지로 안내한다", async () => {
    mocks.createCase.mockRejectedValue(
      new StorageAccessError("localStorage access denied"),
    );
    render(<CaseStartForm practiceCase={oliveyoungPracticeCase} />);

    await userEvent.setup().click(
      screen.getByRole("button", { name: "이 문제로 시작하기" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "브라우저 저장소에 접근할 수 없습니다.",
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("Zod 검증 실패를 Practice Case 정보 오류로 안내한다", async () => {
    const validationError = z.string().safeParse(42).error;
    mocks.createCase.mockRejectedValue(validationError);
    render(<CaseStartForm practiceCase={oliveyoungPracticeCase} />);

    await userEvent.setup().click(
      screen.getByRole("button", { name: "이 문제로 시작하기" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Practice Case 정보가 올바르지 않아 시작할 수 없습니다.",
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("알 수 없는 생성 실패를 일반 오류로 안내하고 실제 오류는 Console에 남긴다", async () => {
    const error = new Error("unexpected");
    mocks.createCase.mockRejectedValue(error);
    render(<CaseStartForm practiceCase={oliveyoungPracticeCase} />);

    await userEvent.setup().click(
      screen.getByRole("button", { name: "이 문제로 시작하기" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Case를 시작하지 못했습니다.",
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[Thinking Flow] Practice Case 시작 실패",
      error,
    );
  });
});
