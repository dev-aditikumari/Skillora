export const inputClass = "w-full";
export const primaryButton =
  "btn-primary w-full py-2.5";

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-indigo-50 to-slate-50 px-4 py-10">
    <div className="card w-full max-w-md p-8 shadow-lg flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children}
      {footer && <div className="text-sm text-slate-500 text-center">{footer}</div>}
    </div>
  </div>
);

export default AuthLayout;