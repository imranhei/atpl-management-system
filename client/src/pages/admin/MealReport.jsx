import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  LoaderCircle,
  Wallet,
  Users,
  FileText,
  XCircle,
  Filter,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MealReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [absentees, setAbsentees] = useState({ opt_outs: [], on_leave: [] });
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [absentDialogOpen, setAbsentDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const startRef = useRef(null);
  const endRef = useRef(null);

  const token = localStorage.getItem("access_token");
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch daily summary
  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/mealreport/daily/`;
      if (startDate && endDate) url += `?start=${startDate}&end=${endDate}`;
      else if (startDate) url += `${startDate}/`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = Array.isArray(res.data) ? res.data : [res.data];

      // ✅ Always sort ascending (oldest → newest)
      data = data.sort((a, b) => new Date(a.date) - new Date(b.date));

      setReports(data);

      // ✅ Automatically set start and end dates from the data
      if (data.length > 0) {
        const firstDate = data[0].date;
        const lastDate = data[data.length - 1].date;

        if (!startDate) setStartDate(firstDate);
        // ✅ Always ensure endDate = last date
        setEndDate(lastDate);
      }
    } catch {
      toast.error("Failed to load meal reports");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch eaters list
  const fetchUsers = async (date) => {
    try {
      const res = await axios.get(`${API_URL}/api/mealreport/daily/${date}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data?.eaters || []);
    } catch {
      toast.error("Failed to fetch eaters list");
    }
  };

  // ✅ Fetch absentees
  const fetchAbsentees = async (date) => {
    try {
      const res = await axios.get(`${API_URL}/api/mealreport/daily/${date}/absentees/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAbsentees(res.data || { opt_outs: [], on_leave: [] });
    } catch {
      toast.error("Failed to fetch absentees");
    }
  };

  // ✅ Payment
  const handlePay = async (date, totalAmount) => {
    try {
      await axios.post(
        `${API_URL}/api/mealreport/payment/`,
        { date, amount: totalAmount, method: "bkash" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Payment successful for ${date}`);
      fetchReports();
    } catch {
      toast.error("Payment failed");
    }
  };

  const handleViewUsers = async (date) => {
    setSelectedDate(date);
    await fetchUsers(date);
    setUserDialogOpen(true);
  };

  const handleViewAbsentees = async (date) => {
    setSelectedDate(date);
    await fetchAbsentees(date);
    setAbsentDialogOpen(true);
  };

  // ✅ Clear filter but keep data in ascending order
  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchReports(); // refetch but will stay sorted ascending
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ===== Header ===== */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FileText className="text-amber-500" size={26} /> Daily Meal Reports
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage meal payments and participation.
            </p>
          </div>

          {/* ===== Date Filter ===== */}
          <div className="flex flex-wrap items-end gap-3">
            {/* Start Date */}
            <div className="flex flex-col">
              <label
                htmlFor="startDate"
                className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                Start Date
              </label>
              <input
                id="startDate"
                ref={startRef}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[160px] h-[40px] rounded-md bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <label
                htmlFor="endDate"
                className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                End Date
              </label>
              <input
                id="endDate"
                ref={endRef}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[160px] h-[40px] rounded-md bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Apply Button */}
            <Button
              onClick={fetchReports}
              disabled={!startDate && !endDate}
              className="h-[42px] px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold flex items-center gap-1 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Filter size={16} /> Apply
            </Button>

            {/* Clear Button */}
            <Button
              variant="outline"
              onClick={handleClearFilter}
              className="h-[42px] px-4 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 flex items-center gap-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <XCircle size={16} /> Clear
            </Button>
          </div>
        </div>

        {/* ===== Filter Display ===== */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <CalendarDays size={16} className="text-amber-500" />
          {startDate && endDate ? (
            <span>
              Showing results for: <b>{startDate}</b> → <b>{endDate}</b>
            </span>
          ) : startDate ? (
            <span>
              Showing results for: <b>{startDate}</b>
            </span>
          ) : (
            <span>No filter applied (showing latest week)</span>
          )}
        </div>

        {/* ===== Table ===== */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoaderCircle className="animate-spin text-amber-500" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 shadow-md">
            <table className="min-w-full text-sm text-gray-800 dark:text-gray-100">
              <thead className="bg-gray-200/60 dark:bg-gray-800/80 text-gray-800 dark:text-gray-300">
                <tr>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Meal</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Eaters</th>
                  <th className="py-3 px-4 text-left">Opt-Out</th>
                  <th className="py-3 px-4 text-left">On Leave</th>
                  <th className="py-3 px-4 text-left">Total</th>
                  <th className="py-3 px-4 text-left">Notes</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((r, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-300/50 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">{r.date}</td>
                    <td className="py-3 px-4">{r.item}</td>
                    <td className="py-3 px-4">{r.price}</td>
                    <td className="py-3 px-4 font-medium text-green-500">{r.eaters_count}</td>
                    <td className="py-3 px-4 text-orange-400">{r.opt_out_count}</td>
                    <td className="py-3 px-4 text-blue-400">{r.on_leave_count}</td>
                    <td className="py-3 px-4 font-semibold text-amber-600">{r.total_amount}</td>
                    <td className="py-3 px-4 italic text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                      {r.notes || "—"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {r.paid ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-600/20 text-green-400 border border-green-500/30">
                          PAID
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                          UNPAID
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleViewUsers(r.date)}
                          className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                          <Users size={16} /> Eaters
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleViewAbsentees(r.date)}
                          className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                          <XCircle size={16} /> Absentees
                        </Button>
                        <Button
                          onClick={() => handlePay(r.date, r.total_amount)}
                          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold"
                        >
                          <Wallet size={16} /> Pay
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== Eaters Dialog ===== */}
        <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
          <DialogContent className="w-[95vw] sm:max-w-3xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                👥 Eaters on {selectedDate}{" "}
                {users.length > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({users.length})
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="max-h-[70vh] overflow-y-auto rounded-md border border-gray-300 dark:border-gray-700">
              {users.length > 0 ? (
                <table className="w-full text-sm text-gray-700 dark:text-gray-200 min-w-[600px]">
                  <thead className="bg-gray-200/60 dark:bg-gray-800/80 text-gray-800 dark:text-gray-300 sticky top-0">
                    <tr>
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Email</th>
                      <th className="py-2 px-4 text-left">Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="border-t border-gray-300/50 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                      >
                        <td className="py-2 px-4">{`${u.first_name} ${u.last_name}`}</td>
                        <td className="py-2 px-4 break-all">{u.email}</td>
                        <td className="py-2 px-4">{u.username}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-5">
                  No eaters found for this date.
                </p>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => setUserDialogOpen(false)}
                className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 w-full sm:w-auto"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ===== Absentees Dialog ===== */}
        <Dialog open={absentDialogOpen} onOpenChange={setAbsentDialogOpen}>
          <DialogContent className="w-[95vw] sm:max-w-3xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                🚫 Absentees on {selectedDate}
              </DialogTitle>
            </DialogHeader>

            <div className="max-h-[70vh] overflow-y-auto space-y-6 p-4">
              {/* Opt-Outs */}
              <div className="border border-gray-300 dark:border-gray-700 rounded-md">
                <div className="bg-gray-200/60 dark:bg-gray-800/80 px-4 py-2 font-semibold text-gray-800 dark:text-gray-300">
                  Opt-Outs ({absentees.opt_outs?.length || 0})
                </div>
                {absentees.opt_outs?.length > 0 ? (
                  <table className="w-full text-sm text-gray-700 dark:text-gray-200">
                    <thead className="bg-gray-100 dark:bg-gray-800/70 text-gray-800 dark:text-gray-300">
                      <tr>
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {absentees.opt_outs.map((a) => (
                        <tr key={a.id} className="border-t border-gray-300/50 dark:border-gray-700">
                          <td className="py-2 px-4">{`${a.first_name} ${a.last_name}`}</td>
                          <td className="py-2 px-4 break-all">{a.email}</td>
                          <td className="py-2 px-4 italic text-gray-500">{a.reason || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No opt-outs found.
                  </p>
                )}
              </div>

              {/* On Leave */}
              <div className="border border-gray-300 dark:border-gray-700 rounded-md">
                <div className="bg-gray-200/60 dark:bg-gray-800/80 px-4 py-2 font-semibold text-gray-800 dark:text-gray-300">
                  On Leave ({absentees.on_leave?.length || 0})
                </div>
                {absentees.on_leave?.length > 0 ? (
                  <table className="w-full text-sm text-gray-700 dark:text-gray-200">
                    <thead className="bg-gray-100 dark:bg-gray-800/70 text-gray-800 dark:text-gray-300">
                      <tr>
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {absentees.on_leave.map((a) => (
                        <tr
                          key={a.id}
                          className="border-t border-gray-300/50 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        >
                          <td className="py-2 px-4">{`${a.first_name} ${a.last_name}`}</td>
                          <td className="py-2 px-4 break-all">{a.email}</td>
                          <td className="py-2 px-4 italic text-gray-500">{a.reason || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No leaves found.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => setAbsentDialogOpen(false)}
                className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 w-full sm:w-auto"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MealReport;
