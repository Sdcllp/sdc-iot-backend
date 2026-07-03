import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["light", "fan", "ac", "door", "sensor", "other"],
      default: "other",
    },
    label: {
      type: String,
      default: "",
      trim: true,
    },
    room: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      default: "OFF",
      enum: ["ON", "OFF", "OPEN", "CLOSED"],
    },
    mqttTopic: {
      type: String,
      default: "",
      trim: true,
    },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 },
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;