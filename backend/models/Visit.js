import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    customerName: {
      type: String,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      trim: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    visitDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Cancelled', 'Rescheduled', 'Completed'],
      default: 'Pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;
