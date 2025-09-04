import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FilePlus2, X } from "lucide-react";

const ResumeUploadForm = ({ files, onUpload, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // convert FileList -> Array for consistency
      const droppedFiles = Array.from(e.dataTransfer.files);
      const fakeEvent = { target: { files: droppedFiles } };
      onUpload(fakeEvent);
      e.dataTransfer.clearData();
    }
  };

  return (
    <section
      id="resume"
      className="bg-white dark:bg-slate-800 sm:p-14 p-6 rounded-xl shadow border space-y-4"
    >
      <h2 className="text-xl font-semibold mb-8 text-center">Upload Resume</h2>

      {/* Upload / Drop Zone */}
      <label
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer h-40 transition-colors
          ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-slate-700" : "border-amber-400 hover:border-blue-500"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <FilePlus2 className="size-6 text-gray-500" />
          <span className="text-gray-500 text-sm font-semibold">
            Drag & drop files here, or click to upload
          </span>
        </div>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={onUpload}
        />
      </label>

      {/* File type tags */}
      <div className="flex space-x-2 py-2">
        {["PDF", "DOCX", "TXT", "> 10 MB"].map((tag, idx) => (
          <Badge
            key={tag}
            className={`text-xs rounded-lg px-2 py-1 border border-gray-200 dark:border-slate-600 text-muted-foreground shadow-none ${
              idx === 3
                ? "bg-white dark:bg-slate-800"
                : "bg-gray-100 dark:bg-slate-700"
            }`}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* File list with remove button */}
      {files.map((file, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 mb-3 bg-blue-50 dark:bg-background rounded-lg"
        >
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-muted-foreground">
              {file.name}
            </p>
            <p className="text-xs text-blue-600">Upload complete</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <Button
              variant="ghost"
              type="button"
              onClick={() => onRemove(i)}
              className="text-muted-foreground hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ))}

      <Button type="submit" className="w-full h-10">
        Submit Application
      </Button>
    </section>
  );
};

export default ResumeUploadForm;
