import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#f5f10b", "#EF4444", "#A78BFA"];

export default function ChartCard({ title, loading, data, type = "trend" }) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            {type === "trend" ? (
              <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} dot={false} />
              </LineChart>
            ) : (
              <PieChart>
                <Pie data={data} dataKey={type === "status" ? "count" : "value"} nameKey={type === "status" ? "status" : "name"} outerRadius={80}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
