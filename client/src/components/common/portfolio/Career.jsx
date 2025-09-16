import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const Career = () => {
  const jobOpenings = [
    {
      title: "Electrical Estimator",
      department: "Engineering",
      location: "Dhaka",
      type: "Full-time",
      description:
        "Provide accurate electrical estimates for various projects and clients.",
    },
  ];

  return (
    <section id="career" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're always looking for talented individuals to join our growing
            team. If you're passionate about technology and want to make a
            difference, we'd love to hear from you.
          </p>
        </div>

        <div
          className={`grid gap-8 mb-12 ${
            jobOpenings.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"
          }`}
        >
          {jobOpenings.length > 0 ? (
            jobOpenings.map((job, index) => (
              <Card key={index} className="h-full dark:bg-muted-foreground/10">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardDescription className="text-base mb-4">
                    {job.description}
                  </CardDescription>
                  <Link to="/job-description/electrical-estimator">
                    <Button className="w-full">
                      Apply Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="bg-gradient-to-br from-muted/40 to-muted/10 backdrop-blur-sm rounded-xl p-8 border border-muted/30 shadow-lg max-w-2xl mx-auto">
              <div className="flex flex-col items-center justify-center text-center py-8">
                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {/* Message */}
                <h3 className="text-2xl font-semibold mb-4 text-foreground">
                  No Current Openings
                </h3>
                <p className="text-muted-foreground max-w-md">
                  We don't have any job openings available at the moment. Please
                  check back later for future opportunities.
                </p>

                {/* Additional info */}
                <div className="pt-6 border-t border-muted/30">
                  <p className="text-sm text-muted-foreground">
                    Have questions? Contact us at{" "}
                    <a
                      href="mailto:hr@atpldhaka.com"
                      className="text-primary hover:underline"
                    >
                      hr@atpldhaka.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Career;
