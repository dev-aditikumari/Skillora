export const DEMO_ACCOUNTS = [
  { role: "Student", email: "demo.student@skillora.dev", password: "Skillora@2026" },
];

const DemoCredentials = ({ onUse }) => (
  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-gray-700">
    <p className="font-semibold text-blue-700">Just looking around? Use a demo login</p>
    {DEMO_ACCOUNTS.map((a) => (
      <div key={a.role} className="mt-2 flex flex-col gap-1">
        <div>
          <span className="font-medium">{a.role}</span>
          <div className="break-all">Email: <code>{a.email}</code></div>
          <div>Password: <code>{a.password}</code></div>
        </div>
        <button
          type="button"
          onClick={() => onUse(a)}
          className="self-start text-blue-700 font-medium hover:underline"
        >
          Fill in this login
        </button>
      </div>
    ))}
  </div>
);

export default DemoCredentials;
