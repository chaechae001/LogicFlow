interface RouteLoadingStateProps {
  label: string;
}

export function RouteLoadingState({ label }: RouteLoadingStateProps) {
  return (
    <main
      aria-busy="true"
      aria-label={label}
      className="min-h-screen px-6 py-8 sm:px-10 lg:px-16 lg:py-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="h-10 w-full animate-pulse rounded-full bg-[var(--line)]" />
        <div className="mt-16 h-4 w-36 animate-pulse rounded-full bg-[var(--line-strong)]" />
        <div className="mt-6 h-20 max-w-3xl animate-pulse rounded-3xl bg-[var(--line)]" />
        <div className="mt-12 h-80 animate-pulse rounded-[2rem] border border-[var(--line)] bg-[var(--surface)]" />
        <p className="sr-only">{label}</p>
      </div>
    </main>
  );
}
