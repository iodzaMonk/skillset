import { createClient } from "../utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("posts").select();
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-text mb-6 text-3xl font-bold">Products</h1>
      {products === null ? (
        <p className="text-text-muted">No products yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {products!.map((p) => (
            <li
              key={p.id}
              className="border-border bg-surface rounded-lg border p-4"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-text text-lg font-semibold">{p.name}</h2>
                <span className="text-accent font-semibold">
                  ${p.price.toFixed(2)}
                </span>
              </div>
              {p.description && (
                <p className="text-text-muted mt-2 text-sm">{p.description}</p>
              )}
              {p.owner?.full_name && (
                <p className="text-text-muted mt-3 text-xs">
                  by {p.owner.full_name}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
