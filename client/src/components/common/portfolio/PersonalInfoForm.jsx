import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import FormField from "./FormField";
import RadioField from "./RadioField";

const PersonalInfoForm = ({ data, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="personal"
      className="bg-white dark:bg-slate-800 sm:p-14 p-6 rounded-xl shadow border space-y-4"
    >
      <h2 className="text-xl font-semibold mb-8 text-center">
        Personal Information
      </h2>
      <FormField
        label="Full Name *"
        placeholder="Full Name"
        value={data.fullName}
        onChange={(val) => onChange("fullName", val)}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          type="email"
          label="Email *"
          placeholder="Email"
          value={data.email}
          onChange={(val) => onChange("email", val)}
        />
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">
            Date of Birth *
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
              >
                {data.dob ? data.dob.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={data.dob}
                captionLayout="dropdown"
                fromYear={1950}
                toYear={new Date().getFullYear()}
                onSelect={(date) => {
                  onChange("dob", date);
                  setOpen(false);
                }}
                classNames={{
                  caption_dropdowns:
                    "flex justify-center space-x-2 items-center",
                  dropdown:
                    "border rounded-md px-2 py-1 text-sm bg-background shadow-sm",
                  caption_label: "hidden",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <FormField
        type="textarea"
        label="Current Address *"
        placeholder="Ex: House #12, Road #7..."
        value={data.address}
        onChange={(val) => onChange("address", val)}
      />
      <FormField
        label="WhatsApp Number *"
        placeholder="WhatsApp Number"
        value={data.whatsapp}
        onChange={(val) => onChange("whatsapp", val)}
      />
      <RadioField
        label="What is your highest level of qualification?"
        value={data.qualification}
        onChange={(val) => onChange("qualification", val)}
        options={[
          { value: "bachelor", label: "Bachelor" },
          { value: "master", label: "Master" },
        ]}
      />
      <RadioField
        label="What is your level of proficiency in English?"
        value={data.proficiency}
        onChange={(val) => onChange("proficiency", val)}
        options={[
          { value: "moderate", label: "Moderate" },
          { value: "excellent", label: "Excellent" },
          { value: "not_good", label: "Not Good" },
        ]}
      />
      <RadioField
        label="How did you hear about this position?"
        value={data.hear}
        onChange={(val) => onChange("hear", val)}
        options={[
          { value: "bd_jobs", label: "BD Jobs" },
          { value: "atb_jobs", label: "AtB Jobs" },
          { value: "social_media", label: "Social Media" },
        ]}
      />
    </section>
  );
};

export default PersonalInfoForm;
