import express from "express";

import {
  getDeviceData,
  controlLight,
  controlAC,
  controlACTemp,
  controlPanasonicAC
} from "../controllers/deviceController.js";

const router = express.Router();

router.get("/", getDeviceData);

router.post("/light", controlLight);

router.post("/ac", controlAC);

router.post("/ac-temp", controlACTemp);

// Panasonic AC route
router.post(
"/panasonic-ac",
controlPanasonicAC
);

export default router;