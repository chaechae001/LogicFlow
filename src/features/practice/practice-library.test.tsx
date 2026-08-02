// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { oliveyoungPracticeCase } from "../../domain";
import { PracticeLibrary } from "./practice-library";

afterEach(cleanup);

describe("PracticeLibrary", () => {
  it("올리브영 Practice Case의 핵심 메타데이터와 시작 링크를 표시한다", () => {
    render(<PracticeLibrary practiceCases={[oliveyoungPracticeCase]} />);

    expect(
      screen.getByRole("heading", { name: oliveyoungPracticeCase.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(oliveyoungPracticeCase.role)).toBeInTheDocument();
    expect(screen.getByText(/약 90분/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /이 Case 살펴보기/ })).toHaveAttribute(
      "href",
      `/cases/new?practiceCaseId=${oliveyoungPracticeCase.id}`,
    );
  });

  it("Case가 없을 때 다음 행동을 설명하는 빈 상태를 표시한다", () => {
    render(<PracticeLibrary practiceCases={[]} />);

    expect(
      screen.getByRole("heading", { name: "준비된 Practice Case가 없습니다." }),
    ).toBeInTheDocument();
    expect(screen.getByText(/준비되면 이곳에서 선택/)).toBeInTheDocument();
  });
});
