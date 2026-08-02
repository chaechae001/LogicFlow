import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-[var(--line)] px-1 pb-5">
      <Link
        className="text-sm font-bold tracking-[-0.02em] text-[var(--ink)]"
        href="/"
      >
        Thinking Flow
      </Link>
      <nav aria-label="주요 메뉴">
        <Link
          className="rounded-full border border-[var(--line-strong)] px-4 py-2 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href="/practice"
        >
          실무 문제로 연습하기
        </Link>
      </nav>
    </header>
  );
}
