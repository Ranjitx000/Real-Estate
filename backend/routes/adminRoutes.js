import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  getAllProperties,
  updatePropertyStatus,
  deleteProperty,
  updatePropertyGeneral,
  getAnalytics,
  getAllInquiries,
  updateInquiry,
  getAllVisits,
  updateVisit,
  bulkImportProperties
} from "../controller/adminController.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, authorize("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/properties", getAllProperties);
router.patch("/properties/:id/status", updatePropertyStatus);
router.patch("/properties/:id", updatePropertyGeneral);
router.delete("/properties/:id", deleteProperty);
router.post("/properties/bulk", bulkImportProperties);

router.get("/inquiries", getAllInquiries);
router.patch("/inquiries/:id", updateInquiry);

router.get("/visits", getAllVisits);
router.patch("/visits/:id", updateVisit);

router.get("/analytics", getAnalytics);

export default router;
