import { ChevronLeft, ChevronRight } from "lucide-react";

type SidebarNavProps = {
  items: { key: string; label: string; icon?: React.ComponentType<{ className?: string }> }[];
  activeKey: string;
  onSelect?: (key: string) => void;
  open: boolean;
  onToggle: () => void;
  heading?: string;
};

/**
 * Dark navigation rail.
 * - Expanded: 224px; collapsed: 72px.
 * - Spring transition: 220ms cubic-bezier(0.34,1.56,0.64,1).
 * - Active item: white/10 background, white text.
 */
export function SidebarNav({ items, activeKey, onSelect, open, onToggle, heading = "EnergyOS" }: SidebarNavProps) {
  return (
    <aside
      className="relative flex shrink-0 flex-col overflow-hidden bg-[#0B0B0D] pt-5 pb-4"
      style={{
        width: open ? 224 : 72,
        transition: "width 220ms cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* Heading */}
      <div className="mb-4 flex items-center gap-2 overflow-hidden px-4">
        <span className="h-5 w-5 shrink-0 rounded bg-[#059669]" aria-hidden />
        {open && (
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
            {heading}
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-2">
        {items.map((item) => {
          const active = item.key === activeKey;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect?.(item.key)}
              title={!open ? item.label : undefined}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] font-medium",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]",
                active
                  ? "bg-white/10 text-white"
                  : "text-[#A1A1AA] hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {open && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={onToggle}
        title={open ? "Collapse sidebar" : "Expand sidebar"}
        className="absolute bottom-4 right-3 flex h-7 w-7 items-center justify-center rounded-md text-[#52525B] transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
      >
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </aside>
  );
}
