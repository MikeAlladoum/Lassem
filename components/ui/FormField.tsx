import { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
}

export function FormField({ label, required, error, ...props }: FormFieldProps) {
  return (
    <div>
      <label className="block text-neutral-300 text-sm mb-2 font-medium">
        {label} {required && "*"}
      </label>
      <input
        {...props}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

interface FormTextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
  rows?: number;
}

export function FormTextarea({ label, required, error, rows = 4, ...props }: FormTextareaProps) {
  return (
    <div>
      <label className="block text-neutral-300 text-sm mb-2 font-medium">
        {label} {required && "*"}
      </label>
      <textarea
        rows={rows}
        {...(props as any)}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

interface FormSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  options: { id: number | string; name: string }[];
}

export function FormSelect({ label, required, options, ...props }: FormSelectProps) {
  return (
    <div>
      <label className="block text-neutral-300 text-sm mb-2 font-medium">
        {label} {required && "*"}
      </label>
      <select
        {...(props as any)}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
      >
        <option value="">Choisir...</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
