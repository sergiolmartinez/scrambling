type ProgressChecklistItem = {
  label: string;
  complete: boolean;
};

type ProgressChecklistProps = {
  items: ProgressChecklistItem[];
};

export function ProgressChecklist({ items }: ProgressChecklistProps): JSX.Element {
  return (
    <ul className='flex flex-wrap gap-2' aria-label='Round setup progress'>
      {items.map((item) => (
        <li
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            item.complete
              ? 'border-emerald-300/40 bg-emerald-400/10 text-emerald-200'
              : 'border-slate-600/60 bg-slate-900/60 text-slate-300'
          }`}
          key={item.label}
        >
          {item.complete ? 'Done:' : 'Pending:'} {item.label}
        </li>
      ))}
    </ul>
  );
}
