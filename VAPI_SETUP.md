# Vapi Voice Assistant Setup

The voice assistant feature requires Vapi configuration. Here's how to set it up:

## 1. Get Vapi Credentials

1. Go to [Vapi.ai](https://vapi.ai)
2. Sign up for an account
3. Get your API key from the dashboard
4. Create an assistant and get the assistant ID

## 2. Set Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Vapi Configuration
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here

# Other required variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
MONGODB_URI=mongodb://localhost:27017/dentwise
JWT_SECRET=your_jwt_secret_key_here
```

## 3. Restart the Application

After setting the environment variables:

```bash
# Stop the current servers (Ctrl+C)
# Then restart
cd /Users/mdkaif/dentwise/server && npm run dev
cd /Users/mdkaif/dentwise && npm run dev
```

## 4. Test the Voice Feature

1. Go to `http://localhost:3000/voice`
2. Sign in to your account
3. Click "Start Call" to test the voice assistant

## Current Status

Without Vapi configuration, the voice feature will show a user-friendly error message instead of crashing the application.
