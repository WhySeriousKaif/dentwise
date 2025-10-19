# Gemini AI Setup Guide

## Why You're Getting Default Responses

Currently, you're getting default fallback responses instead of Gemini AI because the `GEMINI_API_KEY` environment variable is not configured.

## How to Fix This

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the generated API key

### Step 2: Add the API Key to Your Environment

Add this line to your `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Important:** Replace `your_actual_gemini_api_key_here` with your actual API key from Google AI Studio.

### Step 3: Restart Your Development Server

After adding the API key:

1. Stop your current development server (Ctrl+C)
2. Start it again: `npm run dev`

### Step 4: Test the Chat

1. Go to your website
2. Click the chat button
3. Ask "home remedy" or any dental question
4. You should now get responses from Gemini AI instead of the fallback system

## Current Chat System Priority

The chat system automatically chooses the best available option:

1. **VAPI** (if `NEXT_PUBLIC_VAPI_API_KEY` is set)
2. **Gemini** (if `GEMINI_API_KEY` is set and VAPI is not)
3. **Fallback** (if neither is set - current situation)

## Verification

To verify it's working, you can test the API directly:

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"home remedy"}' | jq -r '.source'
```

This should return `gemini` instead of `fallback` once configured.

## Troubleshooting

- **Still getting fallback?** Check that the API key is correctly added to `.env.local`
- **Server not restarting?** Make sure to stop and start the development server
- **API key invalid?** Verify the key is correct and active in Google AI Studio
- **Rate limits?** Free tier has usage limits, but should work for testing

## Features You'll Get with Gemini

- **Better Responses**: More natural and contextual answers
- **Dental Expertise**: Specialized knowledge about dental health
- **Home Remedies**: Proper advice about natural dental care
- **Professional Tone**: Medical-grade responses
- **Better Formatting**: Properly formatted markdown responses
