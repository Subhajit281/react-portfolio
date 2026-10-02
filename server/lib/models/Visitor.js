// api/lib/models/Visitor.js
import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    firstSeenAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    totalVisits: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalViews: {
      type: Number,
      default: 1,
      min: 1,
    },
    lastIp: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "visitors",
  }
);

// Prevent re-compilation of model in hot-reloading / serverless environments
export default mongoose.models.Visitor ||
  mongoose.model("Visitor", VisitorSchema);

