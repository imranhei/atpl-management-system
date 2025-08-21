import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-4xl w-full">
        {/* Main Content */}
        <div className="text-center mb-12">
          {/* Error Code */}
          <h1 className="sm:text-8xl text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            404
          </h1>

          {/* Title */}
          <h2 className="sm:text-3xl text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button
              onClick={handleBack}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium  bg-secondary text-secondary-foreground hover:bg-muted px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3"
              onClick={() => {
                navigate(`/${role}/dashboard`);
              }}
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Still can't find what you're looking for?
            <a
              href="mailto:system@atpldhaka.com"
              className="text-blue-600 hover:text-blue-700 font-medium ml-1"
            >
              system@atpldhaka.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
