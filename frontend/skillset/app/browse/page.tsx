import prisma from "@/lib/prisma";

export default async function Browse() {
  const posts = await prisma.post.findMany();
  return (
    <div className="mx-auto grid min-h-screen w-4/5 grid-cols-3 items-center justify-center gap-10">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border-accent bg-surface-2 rounded-md border p-10"
        >
          <h1 className="text-4xl">{post.title}</h1>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
