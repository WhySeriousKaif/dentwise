# Chat Environment Variables Setup

## Required Environment Variables

Add these to your `.env.local` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/dentwise
JWT_SECRET=your_jwt_secret_key_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here

# AI Chat Configuration
# Option 1: VAPI (Recommended if you want voice + text)
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here

# Option 2: Google Gemini (Alternative to VAPI)
GEMINI_API_KEY=your_gemini_api_key_here
```

## Chat System Priority

The chat system automatically chooses the best available option:

1. **VAPI** (if `NEXT_PUBLIC_VAPI_API_KEY` is set)
2. **Gemini** (if `GEMINI_API_KEY` is set and VAPI is not)
3. **Smart Fallback** (if neither is set)

## VAPI Setup Instructions

1. Go to [https://vapi.ai](https://vapi.ai)
2. Sign up for an account
3. Get your API key from the dashboard
4. Create an assistant and get the assistant ID
5. Add both keys to your `.env.local` file

## Gemini Setup Instructions

1. Go to [https://aistudio.google.com/](https://aistudio.google.com/)
2. Create a new project or use an existing one
3. Generate an API key for the Gemini API
4. Add the key to your `.env.local` file

## Fallback System

If neither VAPI nor Gemini is configured, the chat will use a smart keyword-based system that provides helpful dental advice without requiring any external API keys.

## Testing the Chat

1. Start your development server: `npm run dev`
2. Go to `/signin` or `/signup`
3. Click the floating chat button in the bottom-right corner
4. Start chatting with the AI assistant!

## Features

- **Real-time Chat**: Instant responses from AI
- **Dental Expertise**: Specialized dental advice and information
- **Appointment Help**: Assistance with booking and managing appointments
- **No Authentication Required**: Chat works on auth pages without login
- **Responsive Design**: Works on mobile and desktop
- **Smart Fallback**: Always functional, even without API keys
