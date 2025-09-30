import JobPostModal from "@/components/admin-view/JobPostModal";
// import RichTextEditor from "@/components/admin-view/RichTextEditor";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

import DOMPurify from "dompurify";

const JobApplicationHistory = () => {

  // const safeHtml = useMemo(() => DOMPurify.sanitize(content || ""), [content]);

  const handleSubmit = () => {
  };

  return (
    <div className="m-4 sm:space-y-4 space-y-3 flex-1">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Job Application History</h1>
        <JobPostModal>
          <Button>Add Job Circular</Button>
        </JobPostModal>
      </div>
      <hr />
      {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-mutedText">Editor</h2>
          <RichTextEditor
            label=""
            value={content}
            onChange={setContent}
            placeholder="Write something beautiful…"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-mutedText">Live Preview</h2>
            <span className="text-xs text-mutedText/80">
              {content.trim() ? "sanitized HTML" : "nothing to preview"}
            </span>
          </div>

          <div
            className="preview-content rounded-xl border ... min-h-[240px] p-4 overflow-auto"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </div>
      </div> */}
    </div>
  );
};

export default JobApplicationHistory;
