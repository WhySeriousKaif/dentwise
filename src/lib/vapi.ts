import Vapi from "@vapi-ai/web";

// Initialize Vapi with API key, or create a mock instance if not configured
const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;

export const vapi = apiKey ? new Vapi(apiKey) : {
  start: () => Promise.reject(new Error("Vapi not configured")),
  stop: () => {},
  on: () => ({ off: () => {} }),
  off: () => {}
};

