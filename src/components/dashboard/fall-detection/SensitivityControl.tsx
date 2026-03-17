
interface SensitivityControlProps {
  sensitivity: number;
  isActive: boolean;
  onChange: (value: number) => void;
}

export const SensitivityControl = ({ sensitivity, isActive, onChange }: SensitivityControlProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Sensitivity Level: {sensitivity}</label>
      <input
        type="range"
        min="1"
        max="5"
        value={sensitivity}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        disabled={!isActive}
      />
      <div className="flex justify-between text-xs text-trueshield-muted">
        <span>Less Sensitive</span>
        <span>More Sensitive</span>
      </div>
    </div>
  );
};
