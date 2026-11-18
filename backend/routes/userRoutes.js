import express from "express";
import {
  Addproperty,
  deleteproperty,
  getsingleproperty,
  listallproperty,
  updateproperty,
  getFilteredproperty,
  createInquiry,
  createVisit,
  toggleFavorite,
} from "../controller/usercontroller.js";
import upload from "../middleware/upload.js";
import { authorize, protect, optionalAuth } from "../middleware/auth.js";

const propertyRoutes = express.Router();

// Property CRUD
propertyRoutes.post(
  "/create-property",
  protect,
  authorize("admin", "agent", "owner"),
  upload.array("images", 5),
  Addproperty
);
propertyRoutes.get("/listall-properties", listallproperty);
propertyRoutes.get("/getuserbyid/:id", getsingleproperty);
propertyRoutes.delete(
  "/delete-property/:id",
  protect,
  authorize("admin", "agent", "owner"),
  deleteproperty
);
propertyRoutes.put(
  "/update-property/:id",
  protect,
  authorize("admin", "agent", "owner"),
  updateproperty
);
propertyRoutes.get("/filter-property", getFilteredproperty);

// Lead capture & Engagement (Inquiries, Visits, Favorites)
propertyRoutes.post("/inquiry", optionalAuth, createInquiry);
propertyRoutes.post("/visit", optionalAuth, createVisit);
propertyRoutes.post("/property/:id/favorite", optionalAuth, toggleFavorite);

export default propertyRoutes;
