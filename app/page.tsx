import { getCurrentUser } from "./lib/helper";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-Faustina mb-8 text-4xl font-bold">
        Welcome {user?.name}
      </h1>
    </div>
  );
}
