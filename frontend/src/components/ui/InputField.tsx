type InputFieldProps = {
  label: string;
  value: string;
};

export function InputField({ label, value }: InputFieldProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900">{value}</div>
    </label>
  );
}
