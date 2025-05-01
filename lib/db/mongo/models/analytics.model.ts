import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IPageView extends Document {
  path: string
  userId?: string
  sessionId: string
  referrer?: string
  duration?: number
  timestamp: Date
}

export interface IEvent extends Document {
  name: string
  userId?: string
  sessionId: string
  properties?: Record<string, any>
  timestamp: Date
}

const PageViewSchema = new Schema<IPageView>({
  path: { type: String, required: true },
  userId: { type: String },
  sessionId: { type: String, required: true },
  referrer: { type: String },
  duration: { type: Number },
  timestamp: { type: Date, default: Date.now },
})

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  userId: { type: String },
  sessionId: { type: String, required: true },
  properties: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
})

// Create indexes for better query performance
PageViewSchema.index({ path: 1 })
PageViewSchema.index({ userId: 1 })
PageViewSchema.index({ sessionId: 1 })
PageViewSchema.index({ timestamp: -1 })

EventSchema.index({ name: 1 })
EventSchema.index({ userId: 1 })
EventSchema.index({ sessionId: 1 })
EventSchema.index({ timestamp: -1 })

// Check if models exist before creating new ones (for Next.js hot reloading)
const PageView: Model<IPageView> = mongoose.models.PageView || mongoose.model<IPageView>("PageView", PageViewSchema)
const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)

export const Analytics = {
  PageView,
  Event,
}

export default Analytics
