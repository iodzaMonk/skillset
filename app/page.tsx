import { createClient } from "./utils/supabase/server";

type User = {
  id: string;
  full_name: string | null;
};

export default async function Home() {
  const supabase = await createClient();
  const { data: users, error } = await supabase.from("users").select();
  if (error) {
    console.error(error.message);
    return <p className="text-red-500">Error loading users</p>;
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-Faustina mb-8 text-4xl font-bold">Users</h1>
      <ol className="text-text list-inside list-decimal text-2xl">
        {!users || users.length === 0 ? (
          <p>No users found!</p>
        ) : (
          users.map((user) => <li key={user.id}>{user.full_name}</li>)
        )}
      </ol>
    </div>
  );
}
