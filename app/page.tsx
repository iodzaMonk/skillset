import { createClient } from "./utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: instruments, error } = await supabase.from("users").select();
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-Faustina mb-8 text-4xl font-bold">Users</h1>
      <ol className="text-text list-inside list-decimal text-2xl">
        {instruments?.length ? (
          instruments.map((i: { id: number; name: string }) => (
            <li key={i.id}>{i.name}</li>
          ))
        ) : (
          <li>No users found!</li>
        )}
      </ol>
    </div>
  );
}
