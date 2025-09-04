import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const RadioField = ({ label, options, value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-col gap-3">
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center space-x-2 text-muted-foreground">
            <RadioGroupItem value={opt.value} id={opt.value} />
            <Label htmlFor={opt.value}>{opt.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RadioField;
