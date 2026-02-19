import Lead from "../models/Lead.js";

// KPI Summary
export const getKpis = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const contactedLeads = await Lead.countDocuments({ status: "Contacted" });
    const salesClosed = await Lead.countDocuments({ status: "Converted" });

    const revenueAgg = await Lead.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$revenue" } } },
    ]);

    res.json({
      totalLeads,
      contactedLeads,
      salesClosed,
      totalRevenue: revenueAgg[0]?.totalRevenue || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lead Status Summary
export const getLeadStatusSummary = async (req, res) => {
  try {
    const data = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json(data.map(d => ({ status: d._id, count: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Sales Trend (Last 7 or 30 days)
export const getSalesTrend = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const trend = await Lead.aggregate([
      { $match: { date: { $gte: fromDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          revenue: { $sum: "$revenue" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(trend.map(t => ({ date: t._id, revenue: t.revenue })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
