import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import axios from "axios";
import MainNavbar from "@/components/main-navbar/MainNavbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialState = {
  applications: [],
  shelters: [],
  reports: [],
};

const statusClasses = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  seen: "bg-emerald-100 text-emerald-800",
};

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function MainAdminPanel() {
  const [dashboardData, setDashboardData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [applicationsResponse, sheltersResponse, reportsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/shelterAdmin/applications", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/shelterAdmin/shelters", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/shelterAdmin/reports", {
            withCredentials: true,
          }).catch(e => ({ data: { reports: [] } }))
        ]);

        setDashboardData({
          applications: applicationsResponse.data?.applications || [],
          shelters: sheltersResponse.data?.shelters || [],
          reports: reportsResponse.data?.reports || [],
        });
        setError(null);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || fetchError.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleApplicationAction = async (applicationId, nextStatus) => {
    setActionLoadingId(applicationId);

    try {
      const endpoint =
        nextStatus === "approved"
          ? `http://localhost:5000/api/shelterAdmin/applications/${applicationId}`
          : `http://localhost:5000/api/shelterAdmin/applications/reject/${applicationId}`;

      const targetApplication = dashboardData.applications.find((application) => application._id === applicationId);
      const payload =
        nextStatus === "approved"
          ? { shelterId: targetApplication?.assignedShelterId || targetApplication?.shelterDetails?._id || "" }
          : {};

      if (nextStatus === "approved" && !payload.shelterId) {
        alert("Select a shelter before approving this application.");
        return;
      }

      const response = await axios.put(endpoint, payload, { withCredentials: true });
      const updatedApplication = response.data?.application;

      setDashboardData((current) => ({
        ...current,
        applications: current.applications.map((application) =>
          application._id === applicationId ? updatedApplication : application
        ),
      }));
    } catch (actionError) {
      alert(actionError.response?.data?.message || "Unable to update application.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReportAction = async (reportId) => {
    setActionLoadingId(reportId);

    try {
      const endpoint = `http://localhost:5000/api/shelterAdmin/reports/${reportId}`;

      const targetReport = dashboardData.reports.find((report) => report._id === reportId);
      const payload = { shelterId: targetReport?.assignedShelterId || targetReport?.shelterDetails?._id || "" };

      const response = await axios.put(endpoint, payload, { withCredentials: true });
      const updatedReport = response.data?.report;

      setDashboardData((current) => ({
        ...current,
        reports: current.reports.map((report) =>
          report._id === reportId ? updatedReport : report
        ),
      }));
    } catch (actionError) {
      alert(actionError.response?.data?.message || "Unable to update report.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const { applications, shelters, reports } = dashboardData;

  return (
    <div className="min-h-screen bg-slate-50">
      <MainNavbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Shelter Admin</p>
          <h1 className="mt-3 text-3xl font-bold">Manage Admin Data</h1>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Applications</p>
              <p className="mt-2 text-3xl font-semibold">{applications.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Reported Strays</p>
              <p className="mt-2 text-3xl font-semibold">{reports.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Shelters</p>
              <p className="mt-2 text-3xl font-semibold">{shelters.length}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading dashboard...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700 shadow-sm">
            {error}
          </div>
        ) : (
          <div className="mt-8">
            <Tabs defaultValue="applications" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6 border bg-transparent">
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="reports">Reported Strays</TabsTrigger>
              </TabsList>
              
              <TabsContent value="applications">
                <div className="grid gap-5 lg:grid-cols-2">
                  {applications.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm col-span-2">
                      No adoption requests found.
                    </div>
                  ) : (
                    applications.map((application) => (
                      <div key={application._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Application #{application._id}
                            </p>
                            <h2 className="mt-2 text-xl font-semibold text-slate-900">
                              {application.adoptionDetails?.petName || application.petDetails?.name || "Pet adoption"}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                              Submitted {formatDate(application.submissionDate)}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              statusClasses[application.status] || "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {application.status}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                          <div>
                            <p className="text-slate-400">Applicant</p>
                            <p className="mt-1 font-medium text-slate-900">
                              {application.personalInfo?.fullName || application.user?.userName || "Not available"}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400">Email</p>
                            <p className="mt-1 font-medium text-slate-900">
                              {application.personalInfo?.email || application.user?.email || "Not available"}
                            </p>
                          </div>
                        </div>

                        {application.shelterDetails ? (
                          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                            <p className="font-medium text-slate-900">Shelter center</p>
                            <p className="mt-2">{application.shelterDetails.name}</p>
                            <p className="mt-1">{application.shelterDetails.address || application.shelterDetails.city}</p>
                            <p className="mt-1">Contact: {application.shelterDetails.contact || "Not available"}</p>
                          </div>
                        ) : null}

                        <div className="mt-5 flex gap-3">
                          <div className="flex-1">
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                              Allot Shelter
                            </p>
                            <Select
                              value={application.assignedShelterId || application.shelterDetails?._id || ""}
                              onValueChange={(value) =>
                                setDashboardData((current) => ({
                                  ...current,
                                  applications: current.applications.map((currentApplication) =>
                                    currentApplication._id === application._id
                                      ? { ...currentApplication, assignedShelterId: value }
                                      : currentApplication
                                  ),
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select shelter" />
                              </SelectTrigger>
                              <SelectContent>
                                {shelters.map((shelter) => (
                                  <SelectItem key={shelter._id} value={shelter._id}>
                                    {shelter.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                          <button
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={actionLoadingId === application._id || application.status === "approved"}
                            onClick={() => handleApplicationAction(application._id, "approved")}
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={actionLoadingId === application._id || application.status === "rejected"}
                            onClick={() => handleApplicationAction(application._id, "rejected")}
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reports">
                <div className="grid gap-5 lg:grid-cols-2">
                  {reports.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm col-span-2">
                      No reported strays found.
                    </div>
                  ) : (
                    reports.map((report) => (
                      <div key={report._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Report #{report._id}
                            </p>
                            <h2 className="mt-2 text-xl font-semibold text-slate-900">
                              {report.name || "Stray Animal"} ({report.type})
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                              Region: {report.region || "Not available"}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              statusClasses[report.reportStatus] || "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {report.reportStatus || "pending"}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                          <div>
                            <p className="text-slate-400">Reporter</p>
                            <p className="mt-1 font-medium text-slate-900">
                              {report.reporter?.userName || "Anonymous"}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400">Pickup Details</p>
                            <p className="mt-1 font-medium text-slate-900 flex items-center">
                              {report.pickupEligible ? (
                                <span className="text-emerald-600 font-semibold">Eligible for Pickup</span>
                              ) : (
                                <span className="text-rose-600 font-semibold">Drop-off required</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {report.shelterDetails ? (
                          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                            <p className="font-medium text-slate-900">Shelter center</p>
                            <p className="mt-2">{report.shelterDetails.name}</p>
                            <p className="mt-1">{report.shelterDetails.address || report.shelterDetails.city}</p>
                            <p className="mt-1">Contact: {report.shelterDetails.contact || "Not available"}</p>
                          </div>
                        ) : null}

                        <div className="mt-5 flex gap-3">
                          <div className="flex-1">
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                              Allot Shelter
                            </p>
                            <Select
                              value={report.assignedShelterId || report.shelterDetails?._id || ""}
                              onValueChange={(value) =>
                                setDashboardData((current) => ({
                                  ...current,
                                  reports: current.reports.map((currentReport) =>
                                    currentReport._id === report._id
                                      ? { ...currentReport, assignedShelterId: value }
                                      : currentReport
                                  ),
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select shelter" />
                              </SelectTrigger>
                              <SelectContent>
                                {shelters.map((shelter) => (
                                  <SelectItem key={shelter._id} value={shelter._id}>
                                    {shelter.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                          <button
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={actionLoadingId === report._id || report.reportStatus === "seen"}
                            onClick={() => handleReportAction(report._id)}
                          >
                            <Check className="h-4 w-4" />
                            Mark as Seen
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainAdminPanel;
