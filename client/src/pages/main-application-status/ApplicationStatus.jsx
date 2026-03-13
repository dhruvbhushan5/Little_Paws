import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, MapPin, ShieldCheck } from "lucide-react";
import axios from "axios";
import MainNavbar from "@/components/main-navbar/MainNavbar";

const statusConfig = {
  pending: {
    icon: Clock3,
    badge: "bg-amber-100 text-amber-800",
    panel: "border-amber-200 bg-amber-50",
    title: "Pending Review",
    message: "Your application is under review.",
  },
  approved: {
    icon: CheckCircle2,
    badge: "bg-emerald-100 text-emerald-800",
    panel: "border-emerald-200 bg-emerald-50",
    title: "Approved",
    message: "Your application has been approved.",
  },
  rejected: {
    icon: AlertCircle,
    badge: "bg-rose-100 text-rose-800",
    panel: "border-rose-200 bg-rose-50",
    title: "Rejected",
    message: "Your application was not approved.",
  },
  seen: {
    icon: ShieldCheck,
    badge: "bg-sky-100 text-sky-800",
    panel: "border-sky-200 bg-sky-50",
    title: "Seen by Shelter",
    message: "The shelter has reviewed your stray animal report.",
  },
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

function ApplicationStatus() {
  const [applications, setApplications] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("adoption");

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const [applicationsResponse, reportsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/user/adoption-status", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/user/reported-strays", {
            withCredentials: true,
          }),
        ]);

        const fetchedApplications = applicationsResponse?.data?.applications || [];
        const fetchedReports = reportsResponse?.data?.reports || [];

        setApplications(
          [...fetchedApplications].sort(
            (a, b) => new Date(b.submissionDate || 0) - new Date(a.submissionDate || 0)
          )
        );
        setReports(
          [...fetchedReports].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        );
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  const latestApplication = applications[0];
  const latestStatus = latestApplication?.status || "pending";
  const latestConfig = statusConfig[latestStatus] || statusConfig.pending;
  const LatestIcon = latestConfig.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      <MainNavbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className={`mb-8 rounded-3xl border p-6 shadow-sm ${latestConfig.panel}`}>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
                <LatestIcon className="h-10 w-10" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                  Application Status
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">{latestConfig.title}</h1>
                <p className="mt-2 text-slate-700">{latestConfig.message}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white/80 px-5 py-4 shadow-sm">
              <p className="text-sm text-slate-500">Latest application</p>
              <p className="mt-1 font-semibold text-slate-900">
                {latestApplication?.adoptionDetails?.petName ||
                  latestApplication?.petDetails?.name ||
                  "No application yet"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Submitted {formatDate(latestApplication?.submissionDate)}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading status...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700 shadow-sm">
            {error}
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex flex-wrap gap-3">
              <button
                className={`rounded-full px-5 py-2 text-sm font-medium ${
                  activeSection === "adoption" ? "bg-slate-900 text-white" : "bg-white text-slate-700 shadow-sm"
                }`}
                onClick={() => setActiveSection("adoption")}
              >
                Adopt
              </button>
              <button
                className={`rounded-full px-5 py-2 text-sm font-medium ${
                  activeSection === "requests" ? "bg-slate-900 text-white" : "bg-white text-slate-700 shadow-sm"
                }`}
                onClick={() => setActiveSection("requests")}
              >
                Requests
              </button>
            </div>

            {activeSection === "adoption" ? (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Adoption Applications</h2>
                  <p className="text-sm text-slate-500">{applications.length} records</p>
                </div>
                {applications.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                    No adoption applications found.
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {applications.map((application) => {
                      const config = statusConfig[application.status] || statusConfig.pending;
                      const Icon = config.icon;

                      return (
                        <div
                          key={application._id}
                          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Application #{application._id}
                              </p>
                              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                                {application.adoptionDetails?.petName ||
                                  application.petDetails?.name ||
                                  "Pet adoption"}
                              </h3>
                            </div>
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${config.badge}`}
                            >
                              <Icon className="h-4 w-4" />
                              {config.title}
                            </span>
                          </div>

                          <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                            <div>
                              <p className="text-slate-400">Submitted</p>
                              <p className="mt-1 font-medium text-slate-900">
                                {formatDate(application.submissionDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-400">City</p>
                              <p className="mt-1 font-medium text-slate-900">
                                {application.city || "Not available"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm font-medium text-slate-900">Admin update</p>
                            <p className="mt-2 text-sm text-slate-600">{config.message}</p>
                          </div>

                          {application.status === "approved" && application.shelterDetails ? (
                            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                              <p className="text-sm font-semibold text-emerald-900">
                                Visit one shelter center
                              </p>
                              <p className="mt-2 text-sm text-emerald-900">
                                {application.shelterDetails.name}
                              </p>
                              <div className="mt-2 flex items-start gap-2 text-sm text-emerald-800">
                                <MapPin className="mt-0.5 h-4 w-4" />
                                <span>
                                  {application.shelterDetails.address || application.shelterDetails.city}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-emerald-800">
                                Contact: {application.shelterDetails.contact || "Not available"}
                              </p>
                            </div>
                          ) : application.status === "pending" ? (
                            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-sm font-medium text-slate-900">Shelter visit details</p>
                              <p className="mt-2 text-sm text-slate-600">
                                The shelter center address for {application.city || "your city"} will appear here after approval.
                              </p>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            ) : activeSection === "requests" ? (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Reported Stray Animals</h2>
                  <p className="text-sm text-slate-500">{reports.length} records</p>
                </div>
                {reports.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                    No stray reports found.
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {reports.map((report) => {
                      const reportConfig = statusConfig[report.reportStatus] || statusConfig.pending;
                      const Icon = reportConfig.icon;

                      return (
                        <div key={report._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Report #{report._id}
                              </p>
                              <h3 className="mt-2 text-xl font-semibold text-slate-900">{report.name}</h3>
                              <p className="mt-1 text-sm text-slate-500">
                                Reported {formatDate(report.createdAt)}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${reportConfig.badge}`}
                            >
                              <Icon className="h-4 w-4" />
                              {reportConfig.title}
                            </span>
                          </div>

                          <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                            <div>
                              <p className="text-slate-400">Type</p>
                              <p className="mt-1 font-medium text-slate-900">{report.type}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Breed</p>
                              <p className="mt-1 font-medium text-slate-900">{report.breed}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">City</p>
                              <p className="mt-1 font-medium text-slate-900">{report.region}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Seen date</p>
                              <p className="mt-1 font-medium text-slate-900">
                                {formatDate(report.reportSeenAt)}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-400">Distance from Chandigarh</p>
                              <p className="mt-1 font-medium text-slate-900">
                                {report.distanceFromChandigarhKm ?? "Not available"} km
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-400">Pickup support</p>
                              <p className="mt-1 font-medium text-slate-900">
                                {report.pickupEligible ? "Company pickup available" : "Self drop-off required"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm font-medium text-slate-900">Pickup guidance</p>
                            <p className="mt-2 text-sm text-slate-600">
                              {report.reportStatus === "seen"
                                ? report.pickupEligible
                                  ? "Our team will reach your location soon."
                                  : report.pickupMessage || "Please bring the animal to the allotted shelter center."
                                : report.pickupMessage || "Pickup instructions will be shown here."}
                            </p>
                          </div>

                          {report.reportStatus === "seen" && report.shelterDetails ? (
                            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                              <p className="text-sm font-medium text-slate-900">Assigned shelter center</p>
                              <p className="mt-2 text-sm text-slate-600">{report.shelterDetails.name}</p>
                              <p className="mt-1 text-sm text-slate-600">
                                {report.shelterDetails.address || report.shelterDetails.city}
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                Contact: {report.shelterDetails.contact || "Not available"}
                              </p>
                              <p className="mt-3 text-sm font-medium text-slate-900">
                                {report.pickupEligible
                                  ? "Our team will reach your location for pickup."
                                  : "Please send the animal to this shelter center."}
                              </p>
                            </div>
                          ) : (
                            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                              <p className="text-sm font-medium text-slate-900">Shelter center details</p>
                              <p className="mt-2 text-sm text-slate-600">
                                The assigned center address for {report.region || "this city"} will appear after the shelter marks your report as seen.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationStatus;
