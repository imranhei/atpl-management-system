import EmploymentInfoForm from "@/components/common/portfolio/EmploymentInfoForm";
import PersonalInfoForm from "@/components/common/portfolio/PersonalInfoForm";
import ResumeUploadForm from "@/components/common/portfolio/ResumeUploadForm";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export const steps = [
  { id: "personal", label: "Personal Info" },
  { id: "employment", label: "Employment" },
  { id: "resume", label: "Resume" },
];

export const initialFormData = {
  personal: {
    fullName: "",
    dob: null,
    address: "",
    email: "",
    whatsapp: "",
    qualification: "",
    proficiency: "",
    hear: "",
  },
  employment: {
    company: "",
    position: "",
    role: "",
    experience: "",
    currentSalary: "",
    expectedSalary: "",
    overseas: "",
    country: "",
    joining: "",
    aggrement: "",
  },
  resume: [],
};

const ApplyForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [activeStep, setActiveStep] = useState("personal");

  const updateSection = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      resume: Array.from(e.target.files),
    }));
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      resume: prev.resume.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -200; // 👈 extra space for navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onScroll = () => {
      let current = steps[0].id;
      for (const step of steps) {
        const el = document.getElementById(step.id);
        if (el && el.getBoundingClientRect().top <= 200) {
          current = step.id;
        }
      }
      setActiveStep(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="bg-gradient-to-br from-background dark:to-background to-muted/20">
      <div className="pt-10 mt-16 relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Progress Bar */}
        <div className="fixed dark:bg-slate-800 top-16 left-0 right-0 bg-gray-50 z-50 py-6 px-6 shadow-md border-b">
          <div className="relative max-w-4xl mx-auto flex flex-col items-center">
            <Progress
              className="absolute w-[calc(100%-3.5rem)] ml-5 top-1.5 h-1 rounded-full"
              value={
                (steps.findIndex((s) => s.id === activeStep) /
                  (steps.length - 1)) *
                100
              }
            />
            <div className="flex justify-between relative w-full">
              {steps.map((step, idx) => {
                const isActive = activeStep === step.id;
                const isCompleted =
                  steps.findIndex((s) => s.id === activeStep) > idx;
                return (
                  <button
                    key={step.id}
                    onClick={() => scrollTo(step.id)}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-500"
                          : isActive
                          ? "border-2 border-yellow-500 bg-white"
                          : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`mt-2 text-sm ${
                        isActive
                          ? "font-semibold text-gray-900 dark:text-white/90"
                          : "text-gray-600 dark:text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-20 max-w-4xl mx-auto py-20"
        >
          <PersonalInfoForm
            data={formData.personal}
            onChange={(field, value) => updateSection("personal", field, value)}
          />
          <EmploymentInfoForm
            data={formData.employment}
            onChange={(field, value) =>
              updateSection("employment", field, value)
            }
          />
          <ResumeUploadForm
            files={formData.resume}
            onUpload={handleFileChange}
            onRemove={handleRemoveFile}
          />
        </form>
      </div>
    </section>
  );
};

export default ApplyForm;
