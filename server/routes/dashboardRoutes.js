import express from "express";
import {
  getKpis,
  getLeadStatusSummary,
  getSalesTrend,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/kpis", getKpis);
router.get("/lead-status", getLeadStatusSummary);
router.get("/sales-trend", getSalesTrend);

export default router;
