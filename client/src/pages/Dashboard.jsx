import { useState, useEffect } from "react";
import {
  FaUsers,
  FaPhoneAlt,
  FaCheckCircle,
  FaRupeeSign,
  FaFilePdf,
} from "react-icons/fa";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");

  const [kpis, setKpis] = useState(null);
  const [leadStatus, setLeadStatus] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const API = "http://localhost:5000/api/dashboard";

  const filteredLeads = leadStatus.filter((l) =>
    l.status.toLowerCase().includes(search.toLowerCase())
  );

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      let days = 7;

      switch (dateRange) {
        case "Today":
          days = 1;
          break;
        case "Yesterday":
          days = 1;
          break;
        case "Last 7 Days":
          days = 7;
          break;
        case "Last 30 Days":
          days = 30;
          break;
        case "This Month":
          days = 30;
          break;
        case "Last Month":
          days = 30;
          break;
        case "This Year":
          days = 365;
          break;
        case "Custom Range":
          days = 7;
          break;
        default:
          days = 7;
      }

      const [kpiRes, statusRes, trendRes] = await Promise.all([
        axios.get(`${API}/kpis`),
        axios.get(`${API}/lead-status`),
        axios.get(`${API}/sales-trend?days=${days}`),
      ]);

      setKpis(kpiRes.data);
      setLeadStatus(statusRes.data);
      setSalesTrend(trendRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  // 📄 Export PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Lead Status Summary", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Status", "Count"]],
      body: filteredLeads.map((l) => [l.status, l.count]),
    });

    doc.save("Lead_Status_Report.pdf");
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        active={active}
        setActive={setActive}
      />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
          <h1 className="text-2xl font-bold">{active}</h1>

          <div className="flex flex-col gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm bg-white"
            >
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
              <option>Custom Range</option>
            </select>

            {dateRange === "Custom Range" && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border px-3 py-2 rounded-lg"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border px-3 py-2 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        {kpis ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatCard
              title="Total Leads"
              value={kpis.totalLeads}
              icon={<FaUsers />}
              color="bg-blue-500"
            />
            <StatCard
              title="Contacted Leads"
              value={kpis.contactedLeads}
              icon={<FaPhoneAlt />}
              color="bg-yellow-500"
            />
            <StatCard
              title="Sales Closed"
              value={kpis.salesClosed}
              icon={<FaCheckCircle />}
              color="bg-green-500"
            />
            <StatCard
              title="Total Revenue"
              value={`₹${kpis.totalRevenue}`}
              icon={<FaRupeeSign />}
              color="bg-purple-500"
            />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            No KPI data available
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Sales Trend"
            loading={loading}
            data={salesTrend}
            type="trend"
          />
          <ChartCard
            title="Lead Status Distribution"
            loading={loading}
            data={leadStatus}
            type="status"
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-xl p-6 mt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
            <h2 className="text-lg font-semibold">Lead Status Summary</h2>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded-lg w-60"
              />

              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
              >
                <FaFilePdf /> Export PDF
              </button>
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No Data Found</p>
          ) : (
            <table className="w-full text-left rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr className="text-gray-600">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Count</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((l, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium">{l.status}</td>
                    <td className="py-3 px-4">{l.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
