import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-4 px-6 text-center">
    <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
      404 - Page not found
    </p>
    <h1 className="text-3xl font-bold">We couldn't find that page</h1>
    <p className="max-w-md text-gray-600">
      The link may be incorrect, or the page may have moved.
    </p>
    <Link
      to="/"
      className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
    >
      Back to home
    </Link>
  </main>
);

export default NotFound;
