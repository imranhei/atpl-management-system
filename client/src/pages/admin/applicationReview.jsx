import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  CircleCheckBig,
  CircleX,
  Home,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

const ApplicationReview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
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
      // !action ||
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
          toast({ title: "Application Approved" });
        } else if (action === "reject") {
          setStatus("rejected");
          toast({ title: "Application Rejected", variant: "destructive" });
        } else {
          setStatus("error");
          toast({
            title: "Unknown Action",
            description: `Unsupported action: ${action}`,
            variant: "destructive",
          });
        }
      } catch (err) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err.message ||
          "Something went wrong.";

        if (
          err?.response?.status === 400 &&
          errorMessage.toLowerCase().includes("already approved")
        ) {
          setStatus("already-approved");
          toast({
            title: "Already Approved",
            description: errorMessage,
            variant: "default",
          });
        } else if (
          err?.response?.status === 400 &&
          errorMessage.toLowerCase().includes("already rejected")
        ) {
          setStatus("already-rejected");
          toast({
            title: "Already Rejected",
            description: errorMessage,
            variant: "destructive",
          });
        } else if (
          err?.response?.status === 400 ||
          err?.response?.status === 403
        ) {
          setStatus("rejected");
          toast({
            title: "Application Rejected",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          setStatus("error");
          toast({
            title: "Failed to process application",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } finally {
        setLoadingApproval(false);
      }
    };

    approveOrReject();
  }, [isAuthenticated, user, id, action]);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(role === "admin" ? "/admin/dashboard" : "/");
    }
  };

  if (isLoading || loadingApproval) {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen">
        <LoaderCircle size={48} className="animate-spin" />
      </div>
    );
  }

  // Unauthorized view
  if (!isAuthenticated || role !== "admin") {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen text-red-500">
        <div className="flex flex-col items-center gap-6 border p-6 rounded-lg bg-black/10 shadow-md">
          <TriangleAlert size={60} />
          <h1 className="text-2xl font-bold">Unauthorized Access!</h1>
          <Button onClick={handleBack} className="mt-2">
            Go Back
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
          <Button onClick={handleBack}>Try Again or Go Back</Button>
        </div>
      ) : (
        <div className="text-muted-foreground">Processing your request...</div>
      )}
    </div>
  );
};

export default ApplicationReview;
