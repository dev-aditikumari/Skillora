export const inputClass = "w-full";
export const primaryButton =
  "btn-primary w-full";

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="flex flex-1 items-center justify-center px-4 py-10">
    <div className="card w-full max-w-sm p-6 flex flex-col gap-4">
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