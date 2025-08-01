import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  CircleCheckBig,
  CircleX,
  Home,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";

const ApplicationReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");

  const { user, isLoading, isAuthenticated, role } = useSelector(
    (state) => state.auth
  );

  const [status, setStatus] = useState(null); // "approved", "rejected", or null
  const [loadingApproval, setLoadingApproval] = useState(false);

  // Handle API approval/rejection if admin
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (
      !isAuthenticated ||
      isLoading ||
      !user ||
      role !== "admin" ||
      !token ||
      !id
    ) {
      return;
    }

    const approveOrReject = async () => {
      try {
        setLoadingApproval(true);

        const res = await axios.post(
          `https://djangoattendance.atpldhaka.com/api/leave/decision/${id}/`,
          { action },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (action === "approve") {
          setStatus("approved");
          toast.success("Application Approved");
        } else if (action === "reject") {
          setStatus("rejected");
          toast.error("Application Rejected");
        } else {
          setStatus("error");
          toast.error("Unknown Action", {
            description: `Unsupported action: ${action}`,
          });
        }
      } catch (err) {
        console.log(err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.response?.data?.error ||
          err.message ||
          "Something went wrong.";

        if (
          err?.response?.status === 400 &&
          errorMessage.toLowerCase().includes("already approved")
        ) {
          setStatus("already-approved");
          toast.warning("Already Approved", {
            description: errorMessage,
          });
        } else if (
          err?.response?.status === 400 &&
          errorMessage.toLowerCase().includes("already rejected")
        ) {
          setStatus("already-rejected");
          toast.warning("Already Rejected", {
            description: errorMessage,
          });
        } else if (
          err?.response?.status === 400 ||
          errorMessage.toLowerCase().includes("Invalid action.")
        ) {
          setStatus("invalid-action");
          toast.error("Action is required", {
            description: errorMessage,
          });
        } else if (
          err?.response?.status === 400 ||
          err?.response?.status === 403
        ) {
          setStatus("rejected");
          toast.warning("Application Rejected", {
            description: errorMessage,
          });
        } else {
          setStatus("error");
          toast.error("Failed to process application", {
            description: errorMessage,
          });
        }
      } finally {
        setLoadingApproval(false);
      }
    };

    approveOrReject();
  }, [isAuthenticated, user, id, action]);

  const handleClick = () => {
    if (role === "employee") navigate("/employee/dashboard");
    else navigate("/auth/login");
  };

  if (isLoading || loadingApproval) {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen">
        <LoaderCircle size={48} className="animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen text-amber-500">
        <div className="flex flex-col items-center gap-6 border p-6 rounded-lg bg-black/10 shadow-md">
          <TriangleAlert size={60} />
          <h1 className="text-2xl font-bold">Unauthorized Access</h1>
          <p className="text-center">Please login to view this page</p>
          <Button
            onClick={() => {
              // Store current path before navigating to login
              const currentPath =
                window.location.pathname + window.location.search;
              sessionStorage.setItem("last_path", currentPath);
              localStorage.setItem("last_path_fallback", currentPath);
              navigate("/auth/login", {
                state: { from: currentPath }, // Also pass via navigation state
              });
            }}
            className="mt-2"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen text-red-500">
        <div className="flex flex-col items-center gap-6 border p-6 rounded-lg bg-black/10 shadow-md">
          <TriangleAlert size={60} />
          <h1 className="text-2xl font-bold">Forbidden Access</h1>
          <p className="text-center">
            You don't have permission to view this page
          </p>
          <Button
            onClick={() => navigate("/employee/dashboard")}
            className="mt-2"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Result view
  return (
    <div className="flex items-center justify-center min-w-screen min-h-screen relative">
      <Link
        to={role === "admin" ? "/admin/dashboard" : "/employee/dashboard"}
        className="absolute flex gap-2 items-center top-4 left-4"
      >
        <Home size={16} /> Home
      </Link>

      {status === "approved" || status === "already-approved" ? (
        <div className="flex flex-col items-center gap-6 border p-12 rounded-lg bg-green-900/10 shadow-md">
          <div className="flex bg-green-600/10 p-6 rounded-full">
            <CircleCheckBig size={60} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-green-500">
            {status === "already-approved"
              ? "Already Approved"
              : "Application Approved"}
          </h1>
        </div>
      ) : status === "rejected" || status === "already-rejected" ? (
        <div className="flex flex-col items-center gap-6 border p-12 rounded-lg bg-red-900/10 shadow-md">
          <div className="flex bg-red-600/10 p-6 rounded-full">
            <CircleX size={60} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-500">
            {status === "already-rejected"
              ? "Already Rejected"
              : "Application Rejected!"}
          </h1>
        </div>
      ) : status === "error" ? (
        <div className="flex flex-col items-center gap-6 border p-12 rounded-lg bg-yellow-900/10 shadow-md">
          <div className="flex bg-yellow-600/10 p-6 rounded-full">
            <TriangleAlert size={60} className="text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-yellow-500">
            Failed to Process Application!
          </h1>
          <Button onClick={handleClick}>Try Again or Go Back</Button>
        </div>
      ) : status === "invalid-action" ? (
        <div className="flex flex-col items-center gap-6 border p-12 rounded-lg bg-yellow-900/10 shadow-md">
          <div className="flex bg-yellow-600/10 p-6 rounded-full">
            <TriangleAlert size={60} className="text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-yellow-500">
            Invalid Action!
          </h1>
        </div>
      ) : (
        <div className="text-muted-foreground">Processing your request...</div>
      )}
    </div>
  );
};

export default ApplicationReview;
