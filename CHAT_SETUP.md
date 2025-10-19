# Real-time Chat Setup Guide

This guide will help you set up real-time chat with either VAPI or Gemini API.

## 🎯 Available AI Services

### Option 1: VAPI (Recommended)
- **Pros**: Same service as voice agent, consistent experience
- **Cons**: Requires VAPI account and configuration
- **Setup**: Use existing VAPI credentials

### Option 2: Gemini API
- **Pros**: Google's AI, very reliable
- **Cons**: Separate from voice agent
- **Setup**: Get API key from Google AI Studio

### Option 3: Fallback (No Setup Required)
- **Pros**: Works immediately, no API keys needed
- **Cons**: Basic keyword-based responses
- **Setup**: None required

## 🚀 Quick Setup

### For VAPI (Recommended)
If you already have VAPI configured for voice:

1. **Check your `.env.local` file:**
   ```env
   NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here
   NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
   ```

2. **That's it!** Chat will automatically use VAPI.

### For Gemini API
If you prefer Gemini or don't have VAPI:

1. **Get Gemini API Key:**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Sign in with Google account
   - Create a new API key
   - Copy the API key

2. **Add to `.env.local`:**
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Restart your server:**
   ```bash
   npm run dev
   ```

### For Fallback (No Setup)
If you don't want to configure any APIs:

1. **No setup required!**
2. **Chat will work with basic responses**
3. **Perfect for testing and development**

## 🔧 How It Works

The smart chat system automatically chooses the best available AI service:

1. **VAPI First**: If VAPI is configured, it uses VAPI
2. **Gemini Second**: If VAPI fails or isn't configured, it tries Gemini
3. **Fallback Last**: If both fail, it uses intelligent keyword-based responses

## 📱 Using the Chat

### Access Chat
1. **Sign in to your account**
2. **Go to `/chat` page**
3. **Start chatting with the AI**

### Features
- **Real-time responses**
- **Quick action buttons**
- **Message history**
- **Professional dental advice**
- **Appointment booking help**
- **Cost information**
- **Emergency guidance**

## 🛠️ Troubleshooting

### "AI not configured" Error
- Check your `.env.local` file
- Ensure API keys are correct
- Restart your development server

### Poor Response Quality
- VAPI: Check assistant configuration in VAPI dashboard
- Gemini: Ensure API key has proper permissions
- Fallback: Responses are basic but functional

### No Responses
- Check internet connection
- Verify API keys are valid
- Check browser console for errors

## 🎨 Customization

### VAPI Assistant
Configure your VAPI assistant with:
- Professional dental knowledge
- Appointment booking capabilities
- Emergency response protocols
- Cost and insurance information

### Gemini Prompts
The system automatically uses dental-focused prompts, but you can customize them in `/api/chat/route.js`.

## 📊 Monitoring

### VAPI Dashboard
- Monitor chat usage
- View conversation logs
- Track API usage
- Analyze response quality

### Gemini Console
- Check API usage
- Monitor costs
- View error logs

## 🔒 Security

- API keys are server-side only
- No sensitive data stored in chat
- All conversations are temporary
- User authentication required

## 🚀 Production Tips

1. **Use VAPI for consistency** with voice agent
2. **Monitor API usage** to avoid overages
3. **Set up proper error handling**
4. **Implement rate limiting**
5. **Add conversation logging**

## 🎉 You're Ready!

Once configured, users can:
1. Access the chat at `/chat`
2. Get instant dental advice
3. Book appointments through chat
4. Get cost and insurance information
5. Receive emergency guidance

The chat system provides a seamless, intelligent experience for your dental platform!
