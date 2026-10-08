export function InfoPage({ title, items }: { title: string; items: Array<[string, string]> }) {
  return <div className="mx-auto max-w-3xl px-4 py-14"><p className="text-xs font-bold text-accent">FLOUKAA</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h1><div className="mt-10 divide-y divide-border border-y border-border">{items.map(([q, a]) => <div key={q} className="py-6"><h2 className="font-black">{q}</h2><p className="mt-2 text-muted-foreground">{a}</p></div>)}</div></div>;
}
