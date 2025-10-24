export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  return (
    <main className="m-10 mx-auto max-w-6xl rounded-md border bg-gradient-to-tr from-blue-500 to-purple-500 p-10 text-center text-white">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-extrabold">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="mt-5 rounded-md bg-white p-2 text-4xl font-bold text-purple-500">
          ${amount}
        </div>
      </div>
    </main>
  );
}
