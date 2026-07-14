type SidebarNavProps = {
  items: string[];
  activeItem: string;
};

export function SidebarNav({ items, activeItem }: SidebarNavProps) {
  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:w-64">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Workspace</p>
      <nav className="grid gap-1">
        {items.map((item) => {
          const active = item === activeItem;
          return (
            <button
              key={item}
              type="button"
              className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                active ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
