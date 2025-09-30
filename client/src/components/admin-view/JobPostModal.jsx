import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import RichTextEditor from "./RichTextEditor";

// --- Constants / Config -------------------------------------------------
const JOB_TYPE = {
  full_time: "Full Time",
  part_time: "Part Time",
  internship: "Internship",
};

const INITIAL_FORM = {
  title: "",
  type: "full_time",
  location: "",
  description: "",
  deadline: "",
  age: "",
  experience: "",
  salary: "",
  overview: "", // HTML from RichTextEditor
  vacancy: "",
};

// Field config: add/reorder fields here (no UI rewrite needed)
const jobFields = [
  {
    name: "title",
    label: "Job Title",
    type: "text",
    required: true,
    placeholder: "Job Title",
  },
  {
    name: "type",
    label: "Job Type",
    type: "select",
    required: true,
    options: JOB_TYPE,
  },
  {
    name: "location",
    label: "Job Location",
    type: "text",
    required: true,
    placeholder: "Job Location",
  },
  {
    name: "description",
    label: "Job Description",
    type: "textarea",
    required: true,
    placeholder: "Job Description",
  },
  { name: "deadline", label: "Job Deadline", type: "date", required: true },
  {
    name: "age",
    label: "Age Limit",
    type: "text",
    required: true,
    placeholder: "ex: 18-25",
  },
  {
    name: "experience",
    label: "Experience",
    type: "text",
    required: true,
    placeholder: "ex: 1-2 years",
  },
  {
    name: "vacancy",
    label: "Vacancy",
    type: "number",
    required: true,
    placeholder: "Vacancy",
  },
  {
    name: "salary",
    label: "Salary",
    type: "text",
    required: true,
    placeholder: "ex: 10000-20000",
  },
  {
    name: "overview",
    label: "Job Overview",
    type: "richtext",
    required: false,
    placeholder: "Write Job Overview here...",
  },
];

// --- Field Renderer -----------------------------------------------------
function FieldRenderer({ field, value, onChange }) {
  const { name, label, type, placeholder, required, options } = field;

  if (type === "textarea") {
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Textarea
          id={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="flex-1"
        />
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Select
          value={value ?? undefined}
          onValueChange={(val) => onChange(name, val)}
        >
          <SelectTrigger
            id={name}
            className="w-full bg-sidebarBg text-sidebarText"
          >
            <SelectValue placeholder={`Select ${label}`} />
          </SelectTrigger>
          <SelectContent className="max-h-52 overflow-y-auto">
            {Object.entries(options || {}).map(([val, text]) => (
              <SelectItem key={val} value={val}>
                {text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (type === "richtext") {
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <RichTextEditor
          value={value || ""}
          onChange={(html) => onChange(name, html)}
          placeholder={placeholder}
        />
      </div>
    );
  }

  // input, date, number, text
  const inputType =
    type === "date" ? "date" : type === "number" ? "number" : "text";
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={inputType}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="flex-1"
      />
    </div>
  );
}

// --- Main Component -----------------------------------------------------
const JobPostModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);

  // reset when modal opens
  useEffect(() => {
    if (open) setFormData(INITIAL_FORM);
  }, [open]);

  const handleChange = (name, val) => {
    setFormData((p) => ({ ...p, [name]: val }));
  };

  const isValid = useMemo(() => {
    // simple required check based on config
    return jobFields.every((f) => {
      if (!f.required) return true;
      const v = formData[f.name];
      return v !== "" && v !== null && v !== undefined;
    });
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    try {
      setIsLoading(true);

      // TODO: send to API
      // Example payload:
      const payload = { ...formData }; // overview is HTML (sanitize on server)
      console.log("Submitting job post:", payload);

      // on success
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(INITIAL_FORM);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[90vw] sm:max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            Create/Update Job Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {jobFields.map((f) => (
            <FieldRenderer
              key={f.name}
              field={f}
              value={formData[f.name]}
              onChange={handleChange}
            />
          ))}

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              onClick={handleClear}
              variant="outline"
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isValid}
              className="flex-1"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobPostModal;
