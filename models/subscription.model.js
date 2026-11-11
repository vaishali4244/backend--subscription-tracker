import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, " Subscription price is required"],
      min: [0, "Subscription price must be a positive number"],
      max: [1000, "Subscription price must be less than or equal to 1000"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "INR"],
      default: "INR",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "education",
        "technology",
        "health",
        "lifestyle",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => {
          value <= new Date();
        },
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => {
          value > new Date();
        },
        message: "Start date must be in the past",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Pre-save middleware to calculate renewal date and update status
subscriptionSchema.pre("save", function () {
  //auto calculate renewal date if missing
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency],
    );
  }

  // Update status to 'expired' if renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }
  next();
}); // function to run before saving a subscription document

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
