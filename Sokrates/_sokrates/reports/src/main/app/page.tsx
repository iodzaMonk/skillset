import { getCurrentUser } from "./lib/user";
import ProductCarousel from "./_components/ProductCarousel";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 p-6">
      {user ? (
        <h1 className="font-Faustina text-4xl font-bold">
          Welcome {user?.name}
        </h1>
      ) : (
        <h1 className="font-Faustina text-4xl font-bold">Discover Products</h1>
      )}

      <section className="flex flex-col gap-6">
        <header>
          <h2 className="text-text text-2xl font-semibold">
            Featured Products
          </h2>
        </header>
        <ProductCarousel />
      </section>
    </main>
  );
}
