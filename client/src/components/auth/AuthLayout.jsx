export const inputClass = "border p-2 rounded w-full";
export const primaryButton =
  "bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50";

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-[calc(100vh-57px)] flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-sm border rounded-lg p-6 shadow-sm flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
      {footer && <div className="text-sm text-gray-500 text-center">{footer}</div>}
    </div>
  </div>
);

export default AuthLayout;