import FormField from "./FormField";
import RadioField from "./RadioField";

const EmploymentInfoForm = ({ data, onChange }) => {
  return (
    <section
      id="employment"
      className="bg-white dark:bg-slate-800 sm:p-14 p-6 rounded-xl shadow border space-y-4"
    >
      <h2 className="text-xl font-semibold mb-8 text-center">
        Employment History
      </h2>

      <FormField
        label="Current Company Name *"
        placeholder="Company Name"
        value={data.company}
        onChange={(val) => onChange("company", val)}
      />
      <FormField
        label="Current Position *"
        placeholder="Position"
        value={data.position}
        onChange={(val) => onChange("position", val)}
      />
      <FormField
        type="textarea"
        label="Describe your current role, responsibilities, and key contributions.  *"
        placeholder="Please do not exceed 200 words."
        value={data.role}
        onChange={(val) => onChange("role", val)}
      />
      <FormField
        label="Relevant Job Experience: *"
        placeholder="Years of Experience"
        value={data.experience}
        onChange={(val) => onChange("experience", val)}
      />
      <FormField
        label="Current Salary *"
        placeholder="Current Salary"
        value={data.currentSalary}
        onChange={(val) => onChange("currentSalary", val)}
      />
      <FormField
        label="Expected Salary *"
        placeholder="Expected Salary"
        value={data.expectedSalary}
        onChange={(val) => onChange("expectedSalary", val)}
      />
      <RadioField
        label="Did you ever work overseas or remotely with an overseas company?"
        value={data.overseas}
        onChange={(val) => onChange("overseas", val)}
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
      />
      <FormField
        label="Please mention the country name: *"
        placeholder="Country Name"
        value={data.country}
        onChange={(val) => onChange("country", val)}
      />
      <RadioField
        label="After confirmation, how fast can you join?"
        value={data.joining}
        onChange={(val) => onChange("joining", val)}
        options={[
          { value: "immediately_available", label: "Immediately Available" },
          { value: "1_week", label: "1 week" },
          { value: "2_weeks", label: "2 weeks" },
          { value: "1_month", label: "1 month" },
        ]}
      />
      <RadioField
        label="Monday to Friday, I can manage to be available at the office by 6:30 AM"
        value={data.aggrement}
        onChange={(val) => onChange("aggrement", val)}
        options={[
          { value: "yes", label: "Okay for me" },
          { value: "no", label: "Not okay for me" },
        ]}
      />
    </section>
  );
};

export default EmploymentInfoForm;
