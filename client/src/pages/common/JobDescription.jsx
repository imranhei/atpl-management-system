import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import hiring_banner from "../../assets/hiring_banner.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const JobDescription = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const JD = {
    title: "Graphics Designer",
    deadline: "26 Aug 2025",
    type: "Full Time",
    age: "18-25",
    exp: "2-5",
    description: `At ATPL DHAKA , we are a global team of innovators committed to delivering cutting-edge technology and solutions to our customers. Our diverse backgrounds and expertise empower us to shape the future of technology and create meaningful impact.
            
    We are looking for an Experience Graphic Designer for our Group of Company ATPL DHAKA. Who will be managing all design projects from concept to delivery efficiently and effectively. Excellent Conceptual Skill, Creative Skill, Communication Skill and a sense of urgency are extremely useful to succeed in this task.`,
    responsibilities: [
      "Coming up with creative concepts that are in line with a client`s demands.",
      "Developing rough drafts of concepts and presenting these to clients.",
      "Keeping a client up-to-date with regard to project progress and applying client recommendations.",
      "Collaborating with other creatives in a design team to ensure a common vision and consistent branding.",
      "Ensuring that a design project remains within scope, time and budget.",
      "Keeping up-to-date with design and multimedia trends and the latest developments in software tools",
      "Liaising with external parties, such as printers to ensure that a project runs smoothly and a client`s expectations are met",
    ],
    qualifications: [
      {
        title: "Education",
        qualification: [
          "Bachelor's degree in Business, Computer Science, or a related field. An MBA is a plus.",
        ],
      },
      {
        title: "Experience",
        qualification: [
          "2-5 years of experience in a graphic design role.",
          "Proven success in launching and managing products with measurable results.",
        ],
      },
      {
        title: "Skills",
        qualification: [
          "Strong understanding of product management frameworks and methodologies.",
          "Excellent problem-solving skills and ability to think strategically.",
          "Exceptional communication and interpersonal skills, with the ability to influence stakeholders at all levels.",
          "Proficiency in product management tools such as Jira, Trello, or similar platforms.",
          "Knowledge of agile development and design thinking principles.",
          "Data-driven mindset with the ability to analyze and act on key metrics.",
        ],
      },
    ],
  };

  return (
    <section className="bg-gradient-to-br from-background dark:to-background to-muted/20">
      <div className="min-h-screen flex items-center justify-center relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${hiring_banner})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="space-y-8">
            <Badge className="px-4 py-2 bg-yellow text-blue-900 font-bold">
              Career
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              We Are Hiring!
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto">
              We offer exciting opportunities in a collaborative atmosphere and
              environment. Our global team is here to support you. We provide
              advancement and challenging career paths to ensure your success at
              ATPL Dhaka
            </p>
          </div>
        </div>
      </div>
      <div className="py-20 relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <h1 className="sm:text-4xl text-2xl font-bold">{JD.title}</h1>
        <p className="text-muted-foreground py-4">
          Application Deadline:{" "}
          <span className="text-rose-500 font-semibold">{JD.deadline}</span>
          <span className="mx-4">•</span>
          Jashimuddin Ave, Dhaka-1230
        </p>

        <div className="flex flex-wrap items-center py-4 gap-2">
          <div className="flex gap-2">
            <Badge variant="outline">{JD.type}</Badge>
            <Badge variant="outline">{JD.age} years</Badge>
            <Badge variant="outline">{JD.exp} Years</Badge>
          </div>
          <Link to="apply" className="ml-auto"><Button className="px-10">Apply Now</Button></Link>
          <Button className="bg-black/80 text-white">
            <Share2 className="text-yellow" />
            Share
          </Button>
        </div>
        <hr />

        <div className="py-4 text-justify">
          <h3 className="sm:text-2xl text-xl font-bold mb-4">Job Overview</h3>
          <p className="text-muted-foreground whitespace-pre-line">
            {JD.description}
          </p>
        </div>

        <div className="py-4 text-justify">
          <h3 className="sm:text-2xl text-xl font-bold mb-4">
            Job Responsibilities
          </h3>
          <ul className="list-disc pl-4 text-muted-foreground leading-7">
            {JD.responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="py-4 text-justify">
          <h3 className="sm:text-2xl text-xl font-bold mb-4">Qualifications</h3>
          <ul className="list-none pl-4 text-muted-foreground leading-7">
            {JD.qualifications.map((item, index) => (
              <li key={index}>
                <strong>{item.title}:</strong>
                <ul className="list-disc pl-4">
                  {item.qualification.map((qual, index) => (
                    <li key={index}>{qual}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div className="py-4 text-justify">
          <h3 className="sm:text-2xl text-xl font-bold mb-4">Compensation</h3>
          <ul className="list-disc pl-4 text-muted-foreground leading-7">
            <li>Lunch Facilities: Full Subsidize</li>
            <li>Salary Review: Yearly</li>
          </ul>
        </div>

        <div className="py-4 text-justify">
          <h3 className="sm:text-2xl text-xl font-bold mb-4">Workplace</h3>
          <p className="text-muted-foreground">Work at office</p>
        </div>

        <div className="border border-rose-400 bg-rose-50 p-4 rounded-lg mt-8">
          <h2 className="font-bold text-rose-500 mb-2">
            গুরুত্বপূর্ণ নির্দেশনা - ATPL DHAKA
          </h2>
          <p className="text-gray-700 mb-2">
            ATPL DHAKA বা সংশ্লিষ্ট কোনো ব্যক্তি/প্রতিষ্ঠান যদি নিয়োগ
            প্রক্রিয়ার সময় আপনার কাছ থেকে অর্থ দাবি করে বা
            ব্যক্তিগত/আর্থিকভাবে হয়রানি করে, অনুগ্রহ করে তাৎক্ষণিকভাবে আমাদেরকে
            জানান।
          </p>
          <p className="text-gray-700 mb-4">
            কোন প্রকার অর্থ লেনদেন বা নিয়োগদাতা কর্তৃক হয়রানির দায়িত্ব ATPL
            DHAKA বহন করবে না।
          </p>
          <div className="text-gray-700">
            <p>ফোন: +880 1714245681</p>
            <p>ইমেল: hr@atpldhaka.com</p>
          </div>
        </div>

        <div className="w-full mt-6">
            <Link to="apply"><Button className="px-20">Apply Now</Button></Link>
        </div>
      </div>
    </section>
  );
};

export default JobDescription;
