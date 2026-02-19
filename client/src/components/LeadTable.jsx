import React from "react";

export default function LeadTable({ data = [] }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">Lead Status Summary</h2>

      {data.length === 0 ? (
        <p className="text-gray-400">No Data Found</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-2">Status</th>
              <th className="py-2">Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((l, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{l.status}</td>
                <td className="py-2">{l.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
