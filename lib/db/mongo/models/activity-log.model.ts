import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IActivityLog extends Document {
  userId: string;
  sessionId?: string;
  action: string;
  target: string;
  targetId?: string;
  metadata?: any;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  userId: { type: String, required: true, index: true },
  sessionId: { type: String, index: true },
  action: { type: String, required: true, index: true },
  target: { type: String, required: true, index: true },
  targetId: { type: String, index: true },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, index: true },
  ip: { type: String },
  userAgent: { type: String },
});

ActivityLogSchema.index({ userId: 1, timestamp: -1 });
ActivityLogSchema.index({ action: 1, timestamp: -1 });
ActivityLogSchema.index({ target: 1, targetId: 1 });

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

export default ActivityLog;
