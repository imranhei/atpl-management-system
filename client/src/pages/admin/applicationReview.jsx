import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { checkAuth } from "@/store/auth-slice";
import axios from "axios";
import {
  CircleCheckBig,
  CircleX,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";

const ApplicationReview = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [authorized, setAuthorized] = useState(false);
  const [loadingApproval, setLoadingApproval] = useState(false);
  const [approved, setApproved] = useState(false);

  const action = searchParams.get("action");

  // console.log(id, action);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // If user not available yet, try to fetch it
    if (!user && token) {
      dispatch(checkAuth(token)).then((res) => {
        if (res.payload?.success) {
          if (res.payload.user.username === "frahman") {
            setAuthorized(true);
          }
        }
      });
    }

    // ✅ If user already exists, set authorized directly
    if (user?.username === "frahman") {
      setAuthorized(true);
    }
  }, [user, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token || !user || user.username !== "frahman") return; // don't run if not ready

    const postDecision = async () => {
      try {
        setLoadingApproval(true);
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/decision/${id}`,
          { action },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setApproved(true);
        toast({ title: "Decision Approved" });
      } catch (err) {
        setApproved(false);
        toast({ title: "Decision Rejected", variant: "destructive" });
      } finally {
        setLoadingApproval(false);
      }
    };

    postDecision();
  }, [user?.id, id, action]); // ✅ run only when user is confirmed

  if (isLoading || (!user && authorized) || loadingApproval) {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen">
        <LoaderCircle size={48} className="animate-spin" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen text-red-500 !bg-transparent">
        <div className="flex flex-col items-center gap-6 border p-6 rounded-lg bg-black/20 shadow-md">
          <TriangleAlert size={60} />
          <h1 className="text-2xl font-bold">Unauthorized Access!</h1>
          <Link to="/auth/login">
            <Button className="btn btn-primary">Go to Login Page</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-w-screen min-h-screen">
      {approved ? (
        <div className="flex flex-col items-center gap-6 border p-12 rounded-lg bg-green-900/10 shadow-md">
          <div className="flex bg-green-600/10 p-6 rounded-full">
            <CircleCheckBig size={60} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-green-500">
            Application Approved
          </h1>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 border p-12 rounded-lg bg-red-900/10 shadow-md">
          <div className="flex bg-red-600/10 p-6 rounded-full">
            <CircleX size={60} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-500">
            Application Rejected!
          </h1>
        </div>
      )}
    </div>
  );
};

export default ApplicationReview;
