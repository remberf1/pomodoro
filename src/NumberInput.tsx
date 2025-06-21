import React from "react";

type NumberInputProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function NumberInput({
  id,
  label,
  value,
  onChange,
  min = 1,
  max = 59,
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      onChange(0); // let parent handle empty case if needed
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      // clamp value within min and max
      onChange(Math.min(max, Math.max(min, num)));
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="number"
        id={id}
        value={value === 0 ? "" : value}
        onChange={handleChange}
        min={min}
        max={max}
        className="mt-1 w-[50%] border border-gray-300 rounded px-3 py-2"
      />
    </div>
  );
}
