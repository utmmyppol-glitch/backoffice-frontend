"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export default function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2"
      title={label}
    >
      <span
        className={`relative inline-block w-9 h-5 rounded-full transition-colors ${
          checked ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
      {label && <span className="text-xs text-gray-500">{label}</span>}
    </button>
  );
}
