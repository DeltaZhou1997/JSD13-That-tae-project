import mongoose, { disconnect, mongo } from "mongoose";

let isConnected = false;


export async function connectDB() {

  if (isConnected) return;

  const uri = process.env.MONGODB_URI
  if (!uri) { throw new error("not found ENV or MONGODB_URI, Please Check Variable") }

  // ใส่ไว้สำหรับ ให้ตัว Mongoose มันมีความยืดหยุ่น ไม่ต้องเป๊ะตา่ม schema
  mongoose.set("strictQuery", false);

  mongoose.connect(uri, {
    dbName: "thattae"
  });

  isConnected = true;
  console.log("MongoDB Connected at :", mongoose.connection.host)
}

export async function disconnectDB() {
  if (!isConnected) return; //เช็คว่าต่อไหม ถ้าต่ออยู่

  await mongoose.disconnect();
  isConnected = false;
  console.log("MongoDB Disconnected")
}

export function getDBStatus() {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  }

  return {
    state: states[mongoose.connection.readyState] || "unknown",
    host: mongoose.connection.host || "none",
    name: mongoose.connection.name || "none",
  }
}