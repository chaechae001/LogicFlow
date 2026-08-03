import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("사용자 선작성 원칙과 10단계 흐름을 안내한다", () => {
    const markup = renderToStaticMarkup(<Home />);

    expect(markup).toContain("먼저 쓰고, 그다음 점검합니다.");
    expect(markup).toContain("AI가 답을 대신 만드는 곳이 아닙니다.");
    expect(markup.match(/<li/g)).toHaveLength(10);
  });
});
