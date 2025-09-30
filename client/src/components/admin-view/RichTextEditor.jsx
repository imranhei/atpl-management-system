import React, { useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

// --- Font size: use px so Quill writes inline styles (works in preview) ---
const Size = Quill.import("formats/size");
Size.whitelist = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];
Quill.register(Size, true);

// --- Custom toolbar so size options show readable labels ---
const Toolbar = () => (
  <div id="rte-toolbar" className="flex flex-wrap items-center gap-2 p-2 border-b">
    {/* Font size */}
    <select className="ql-size" defaultValue="16px">
      {Size.whitelist.map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>

    {/* (Optional) Headers — uncomment formats if you use this
    <select className="ql-header" defaultValue="">
      <option value="">Normal</option>
      <option value="1">H1</option>
      <option value="2">H2</option>
      <option value="3">H3</option>
    </select>
    */}

    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-strike" />
    <select className="ql-color" />
    <select className="ql-background" />
    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />
    <select className="ql-align" />
    <button className="ql-blockquote" />
    <button className="ql-code-block" />
    <button className="ql-link" />
    <button className="ql-image" />
    <button className="ql-clean" />
  </div>
);

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write something...",
  readOnly = false,
  className = "",
  label,
  error,
}) => {
  const modules = useMemo(
    () => ({
      toolbar: { container: "#rte-toolbar" }, // <-- use our custom toolbar
      clipboard: { matchVisual: false },
    }),
    []
  );

  const formats = [
    // "header", // <-- enable if you use the header picker above
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "link",
    "image",
    "color",
    "background",
    "align",
  ];

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-textColor dark:text-white/90">
          {label}
        </label>
      )}

      <div
        className={[
          "rounded-xl border border-borderColor dark:border-slate-700",
          "bg-white dark:bg-slate-900",
          "shadow-sm focus-within:ring-2 focus-within:ring-primary/40",
        ].join(" ")}
      >
        <Toolbar />

        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          className="min-h-[240px]"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-errorText dark:text-rose-400">{error}</p>
      )}
    </div>
  );
};

export default RichTextEditor;