import { createClient } from "redis"; 
import dotenv from "dotenv";

dotenv.config();

let url = process.env.REDIS_URL;
let isRedisReady = false;
let client = null;

if (url) {
  // Ensure protocol is present
  if (!url.startsWith("redis://") && !url.startsWith("rediss://")) {
    url = `redis://${url}`;
  }

  client = createClient({
    url,
    pingInterval: 15000, // Send PING every 15s to keep connection alive and prevent ECONNRESET
    socket: {
      keepAlive: 5000,
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
    },
  });

  client.on("error", (error) => {
    // Filter out common harmless idle socket resets which Redis auto-reconnects
    if (error.code === "ECONNRESET" || error.message.includes("ECONNRESET")) {
      return;
    }
    if (!error.message.includes("NOAUTH")) {
      console.error("❌ Redis Client Error:", error.message);
    }
  });

  client.on("reconnecting", () => {
    console.log("🔄 Redis Client Reconnecting...");
  });

  try {
    await client.connect();
    await client.ping();
    console.log("⚡ Redis Client Connected & Authenticated");
    isRedisReady = true;
  } catch (error) {
    if (error.message.includes("NOAUTH")) {
      console.warn(
        "⚠️ Redis Authentication Required: Your Redis Cloud instance requires a password.\n" +
        "   Add your password to REDIS_URL in backend/.env:\n" +
        "   REDIS_URL=redis://default:<PASSWORD>@redis-17076.crce286.ap-south-1-1.ec2.cloud.redislabs.com:17076\n" +
        "   (Redis caching is disabled until configured; requests will fall back to MongoDB.)"
      );
    } else {
      console.warn("⚠️ Redis Connection Failed:", error.message, "- running without Redis cache.");
    }
    try {
      await client.disconnect();
    } catch (_) {}
    client = null;
    isRedisReady = false;
  }
} else {
  console.log("ℹ️ No REDIS_URL provided. Running without Redis cache.");
}

// Safe wrapper to prevent crashing or throwing when Redis is disabled/unauthenticated
const safeRedisClient = {
  get: async (key) => {
    if (!isRedisReady || !client) return null;
    return await client.get(key);
  },
  set: async (key, val, opts) => {
    if (!isRedisReady || !client) return null;
    return await client.set(key, val, opts);
  },
  del: async (key) => {
    if (!isRedisReady || !client) return null;
    return await client.del(key);
  },
  isOpen: () => isRedisReady,
  rawClient: () => client,
};

export default safeRedisClient;
