"use client";

import type { ComparableListing } from "@/lib/types";

interface Props {
  title: string;
  hint: string;
  items: ComparableListing[];
  onChange: (items: ComparableListing[]) => void;
  showDays: boolean;
}

const emptyItem: ComparableListing = {
  description: "",
  surface: null,
  prix: null,
  joursEnLigne: null,
};

export default function ComparablesEditor({ title, hint, items, onChange, showDays }: Props) {
  const update = (index: number, patch: Partial<ComparableListing>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500">{hint}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...items, { ...emptyItem }])}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          + Ajouter
        </button>
      </div>
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-400">
          Aucun bien renseigné
        </p>
      )}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 p-2">
            <input
              type="text"
              placeholder="Description (ex : T3 rue Victor Hugo, 2e étage)"
              value={item.description}
              onChange={(e) => update(i, { description: e.target.value })}
              className="min-w-40 flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
            <input
              type="number"
              placeholder="m²"
              value={item.surface ?? ""}
              onChange={(e) => update(i, { surface: e.target.value ? +e.target.value : null })}
              className="w-20 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
            <input
              type="number"
              placeholder="Prix €"
              value={item.prix ?? ""}
              onChange={(e) => update(i, { prix: e.target.value ? +e.target.value : null })}
              className="w-28 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
            {showDays && (
              <input
                type="number"
                placeholder="Jours en ligne"
                value={item.joursEnLigne ?? ""}
                onChange={(e) =>
                  update(i, { joursEnLigne: e.target.value ? +e.target.value : null })
                }
                className="w-28 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              />
            )}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-50"
              aria-label="Supprimer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
