"use client";

interface RouteErrorStateProps {
  description: string;
  reset: () => void;
  title: string;
}

export function RouteErrorState({
  description,
  reset,
  title,
}: RouteErrorStateProps) {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <section className="w-full max-w-xl rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-[0_24px_80px_rgba(23,42,58,0.08)] sm:p-12">
        <p className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
          다시 시도할 수 있습니다
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
          {title}
        </h1>
        <p className="mt-5 leading-7 text-[var(--muted)]">{description}</p>
        <button
          className="mt-8 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--accent)]"
          onClick={reset}
          type="button"
        >
          다시 불러오기
        </button>
      </section>
    </main>
  );
}
