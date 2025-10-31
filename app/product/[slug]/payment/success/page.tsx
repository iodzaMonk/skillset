type SuccessPageProps = {
  searchParams: Promise<{
    amount?: string;
  }>;
};

export default async function PaymentSuccess({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const amount = params?.amount ?? "0.00";

  return (
    <main className="m-10 mx-auto max-w-6xl rounded-md border bg-linear-to-tr from-blue-500 to-purple-500 p-10 text-center text-white">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-extrabold">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="mt-5 rounded-md bg-white p-2 text-4xl font-bold text-purple-500">
          ${amount}
        </div>

        <button
          onClick={() => router.push("/browse")}
          className="mt-8 rounded-lg bg-white px-6 py-3 text-lg font-semibold text-purple-600 transition-all duration-200 hover:bg-gray-100 hover:shadow-lg"
        >
          Browse More Services
        </button>
      </div>
    </main>
  );
}
