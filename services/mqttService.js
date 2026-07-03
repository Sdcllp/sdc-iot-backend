// mqttService.js
import mqtt from "mqtt";
import { io } from "../server.js";

const MQTT_BROKER = "mqtt://broker.hivemq.com";

export const TOPICS = {
  TEMP: "esp32/temp",
  HUM: "esp32/hum",
  MOTION: "esp32/motion",
  DISTANCE: "esp32/distance",
  LDR: "esp32/ldr",
  IR: "esp32/ir",
  TOUCH: "esp32/touch",
  RFID: "esp32/rfid",

  // Mitsubishi / Old AC
  AC_STATUS: "esp32/ac/status",
  AC_SET: "esp32/ac/power",
  AC_TEMP_SET: "esp32/ac/temp",
  AC_TEMP_STATUS: "esp32/ac/temp/status",

  // Panasonic / Second AC
  PANASONIC_AC_STATUS: "esp32/panasonic/ac/status",
  PANASONIC_AC_SET: "esp32/panasonic/ac/power",
  PANASONIC_AC_TEMP_SET: "esp32/panasonic/ac/temp",
  PANASONIC_AC_TEMP_STATUS: "esp32/panasonic/ac/temp/status",

  LIGHT_STATUS: "room/light/status",
  LIGHT_SET: "room/light/set",
};

export const sensorData = {
  temperature: "--",
  humidity: "--",
  motion: "--",
  distance: "--",
  ldr: "--",
  ir: "--",
  touch: "--",
  rfid: "--",

  // Mitsubishi / Old AC
  ac: "OFF",
  acTemp: 24,

  // Panasonic / Second AC
  panasonicAc: "OFF",
  panasonicAcTemp: 24,

  light: "OFF",
  updatedAt: null,
};

let mqttClient = null;

const subscribeTopics = [
  TOPICS.TEMP,
  TOPICS.HUM,
  TOPICS.MOTION,
  TOPICS.DISTANCE,
  TOPICS.LDR,
  TOPICS.IR,
  TOPICS.TOUCH,
  TOPICS.RFID,

  TOPICS.AC_STATUS,
  TOPICS.AC_TEMP_STATUS,

  TOPICS.PANASONIC_AC_STATUS,
  TOPICS.PANASONIC_AC_TEMP_STATUS,

  TOPICS.LIGHT_STATUS,
];

export const connectMQTT = () => {
  if (mqttClient) return mqttClient;

  mqttClient = mqtt.connect(MQTT_BROKER, {
    reconnectPeriod: 2000,
    clean: true,
    connectTimeout: 30000,
  });

  mqttClient.on("connect", () => {
    console.log("✅ MQTT Connected");

    mqttClient.subscribe(subscribeTopics, (err) => {
      if (err) {
        console.log("❌ Subscribe Error:", err.message);
      } else {
        console.log("📡 Subscribed:", subscribeTopics);
      }
    });
  });

  mqttClient.on("message", (topic, message) => {
    const value = message.toString().trim();

    console.log(`📩 MQTT Message [${topic}]: ${value}`);

    switch (topic) {
      case TOPICS.TEMP:
        sensorData.temperature = value;
        break;

      case TOPICS.HUM:
        sensorData.humidity = value;
        break;

      case TOPICS.MOTION:
        sensorData.motion = value === "1" ? "Detected" : "No Motion";
        break;

      case TOPICS.DISTANCE:
        sensorData.distance = value;
        break;

      case TOPICS.LDR:
        sensorData.ldr = value === "1" ? "Light" : "Dark";
        break;

      case TOPICS.IR:
        sensorData.ir = value === "1" ? "Clear" : "Object Detected";
        break;

      case TOPICS.TOUCH:
        sensorData.touch = value === "0" ? "Touched" : "Not Touched";
        break;

      case TOPICS.RFID:
        sensorData.rfid = value;
        break;

      case TOPICS.AC_STATUS:
        sensorData.ac = value.toUpperCase() === "ON" ? "ON" : "OFF";
        break;

      case TOPICS.AC_TEMP_STATUS:
        sensorData.acTemp = Number(value) || 24;
        break;

      case TOPICS.PANASONIC_AC_STATUS:
        sensorData.panasonicAc =
          value.toUpperCase() === "ON" ? "ON" : "OFF";
        break;

      case TOPICS.PANASONIC_AC_TEMP_STATUS:
        sensorData.panasonicAcTemp = Number(value) || 24;
        break;

      case TOPICS.LIGHT_STATUS:
        sensorData.light = value.toUpperCase() === "ON" ? "ON" : "OFF";
        break;

      default:
        break;
    }

    sensorData.updatedAt = new Date().toISOString();

    io.emit("deviceData", sensorData);

    console.log("🔥 Latest Sensor Data:", sensorData);
  });

  mqttClient.on("error", (err) => {
    console.log("❌ MQTT Error:", err.message);
  });

  return mqttClient;
};

export const publishCommand = (topic, value) => {
  return new Promise((resolve, reject) => {
    if (!mqttClient || !mqttClient.connected) {
      return reject(new Error("MQTT not connected"));
    }

    mqttClient.publish(topic, String(value), { qos: 0 }, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`📤 Published [${topic}]: ${value}`);
        resolve(true);
      }
    });
  });
};

// Mitsubishi / Old AC
export const publishACPower = (status) => {
  const value = status === "ON" ? "ON" : "OFF";
  sensorData.ac = value;
  return publishCommand(TOPICS.AC_SET, value);
};

export const publishACTemp = (temp) => {
  const value = Number(temp);

  if (value < 16 || value > 30) {
    throw new Error("AC temperature must be between 16 and 30");
  }

  sensorData.acTemp = value;
  return publishCommand(TOPICS.AC_TEMP_SET, value);
};

// Panasonic / Second AC
export const publishPanasonicACPower = (status) => {
  const value = status === "ON" ? "ON" : "OFF";
  sensorData.panasonicAc = value;
  return publishCommand(TOPICS.PANASONIC_AC_SET, value);
};

export const publishPanasonicACTemp = (temp) => {
  const value = Number(temp);

  if (value < 16 || value > 30) {
    throw new Error("Panasonic AC temperature must be between 16 and 30");
  }

  sensorData.panasonicAcTemp = value;
  return publishCommand(TOPICS.PANASONIC_AC_TEMP_SET, value);
};

export const publishLight = (status) => {
  return publishCommand(TOPICS.LIGHT_SET, status === "ON" ? "ON" : "OFF");
};