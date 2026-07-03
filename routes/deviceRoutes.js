import express from "express";

import {
  getDeviceData,
  controlLight,
  controlAC,
  controlACTemp,
  controlPanasonicAC,
} from "../controllers/deviceController.js";

const router = express.Router();

/* Test route */
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Device routes working",
  });
});

/* Get latest device data */
router.get("/", getDeviceData);

/* Light control */
router.post("/light", controlLight);

/* Mitsubishi AC control */
router.post("/ac", controlAC);

/* Mitsubishi AC temperature control */
router.post("/ac-temp", controlACTemp);

/* Panasonic AC control */
router.post("/panasonic-ac", controlPanasonicAC);

export default router;