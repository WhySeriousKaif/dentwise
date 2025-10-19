import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    // Get token from cookies (optional for guest users)
    const token = request.cookies.get('token')?.value;
    let isAuthenticated = false;
    let userId = null;

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        isAuthenticated = true;
        userId = decoded.id;
      } catch (error) {
        // Token is invalid, but we'll still allow chat for guest users
        console.log('Invalid token, allowing guest chat');
      }
    }

    const { message, userId: requestUserId } = await request.json();

    if (!message) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    // Determine which AI service to use based on available configuration
    const hasVapi = process.env.NEXT_PUBLIC_VAPI_API_KEY && process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    const hasGemini = process.env.GEMINI_API_KEY;
    

    let response;
    let source = 'fallback';

    // VAPI is primarily for voice calls, not text chat
    // So we'll use Gemini for text chat
    if (hasGemini) {
        // Try Gemini if VAPI failed or not configured
        try {
          const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are DentWise AI, a professional dental assistant for the DentWise platform. You have complete knowledge about our platform and services.

## DENTWISE PLATFORM INFORMATION:

### OUR DENTAL TEAM:
**Dr. Sarah Johnson** - General Dentistry
- 10+ years experience
- Specializes in preventive care, cleanings, fillings
- Available: Monday-Friday, 9 AM - 5 PM
- Consultation: $150, Cleaning: $120, Filling: $200-400

**Dr. Michael Chen** - Oral Surgery & Implants
- 15+ years experience
- Advanced surgical procedures, implants, extractions
- Available: Tuesday-Thursday, 8 AM - 6 PM
- Consultation: $200, Implant: $2,500-4,000, Extraction: $300-800

**Dr. Emily Davis** - Cosmetic Dentistry
- 12+ years experience
- Smile makeovers, veneers, whitening, braces
- Available: Monday-Wednesday-Friday, 10 AM - 6 PM
- Consultation: $180, Veneers: $800-1,500 each, Whitening: $300-600

### SERVICES & PRICING:
**General Services:**
- Checkup & cleaning: $100-200
- Filling: $150-400 (depending on size)
- Crown: $800-1,500
- Root canal: $800-1,200
- Extraction: $200-500

**Cosmetic Services:**
- Teeth whitening: $300-600
- Veneers: $800-1,500 per tooth
- Invisalign: $3,000-7,000
- Dental bonding: $300-600 per tooth

**Emergency Services:**
- Emergency consultation: $200
- Emergency extraction: $400-800
- After-hours fee: +$100

### PLATFORM FEATURES:
- AI-powered voice consultations (10 calls/month on Basic plan)
- Unlimited AI chat support
- Online appointment booking
- Digital health records
- Appointment reminders
- Insurance accepted
- Payment plans available

### SUBSCRIPTION PLANS:
**AI Basic Plan: $9/month**
- 10 AI voice calls per month
- Unlimited text chat
- Basic appointment booking
- Email support

**AI Pro Plan: $19/month**
- Unlimited AI voice calls
- Advanced AI dental analysis
- Priority appointment booking
- 24/7 AI support
- Detailed health reports

### LOCATION & CONTACT:
- Main Office: 123 Dental Street, Health City, HC 12345
- Phone: (555) 123-DENT
- Email: info@dentwise.com
- Emergency Line: (555) 911-DENT
- Website: www.dentwise.com

### INSURANCE & PAYMENT:
- We accept most major insurance plans
- Payment plans available for treatments over $500
- Financing options through CareCredit
- 5% discount for multiple family members
- Senior citizen discount: 10%

## YOUR ROLE:
- Help patients with dental health questions
- Provide accurate information about our services and pricing
- Assist with appointment scheduling
- Guide patients to the right specialist
- Provide emergency guidance
- Explain procedures and costs
- Help with insurance questions
- Be professional, empathetic, and helpful
- Use markdown formatting for better readability
- For medical emergencies, direct users to call our emergency line or 911

User question: ${message}`
                }]
              }]
            })
          });

          if (geminiResponse.ok) {
            const data = await geminiResponse.json();
            response = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request at the moment.";
            source = 'gemini';
          } else {
            const errorData = await geminiResponse.text();
            console.error('Gemini API error response:', geminiResponse.status, errorData);
            throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorData}`);
          }
        } catch (error) {
          console.error('Gemini failed, using fallback:', error);
          // Fall through to fallback
        }
    }

    // Use fallback if both APIs failed or are not configured
    if (source === 'fallback') {
      response = getFallbackResponse(message);
    }
    
    return NextResponse.json({
      response: response,
      timestamp: new Date().toISOString(),
      source: source
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback to simple responses
    const fallbackResponse = getFallbackResponse(message);
    
    return NextResponse.json({
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      source: 'fallback'
    });
  }
}

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Emergency responses
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('severe pain')) {
    return "🚨 **DENTAL EMERGENCY DETECTED** 🚨\n\nIf you're experiencing severe pain, swelling, or trauma, please:\n\n• Contact our emergency line immediately\n• Visit the nearest emergency dental clinic\n• For life-threatening situations, call 911\n\nDon't wait - seek immediate professional care!";
  }
  
  // Pain-related responses
  if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('ache')) {
    return "I understand you're experiencing dental pain. This could indicate:\n\n• Tooth decay or cavity\n• Gum disease\n• Tooth sensitivity\n• Abscess or infection\n\n**Recommendation:** Schedule an appointment with a dentist as soon as possible. For severe pain, consider it an emergency.";
  }
  
  // Bleeding responses
  if (lowerMessage.includes('bleeding') || lowerMessage.includes('blood') || lowerMessage.includes('gums')) {
    return "Bleeding gums can indicate:\n\n• Gingivitis (early gum disease)\n• Periodontitis (advanced gum disease)\n• Brushing too hard\n• Vitamin deficiency\n\n**What to do:**\n• Continue gentle brushing and flossing\n• Use a soft-bristled toothbrush\n• Schedule a dental checkup\n• Consider an antimicrobial mouthwash";
  }
  
  // Appointment booking
  if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
    return "I'd be happy to help you book an appointment! Here's how:\n\n**For New Patients:**\n• Visit our signup page to create an account\n• Use our online booking system\n• Choose from available time slots\n\n**For Existing Patients:**\n• Log in to your dashboard\n• Go to the Appointments section\n• Select your preferred dentist and time\n\n**Available Services:**\n• General checkups\n• Cleanings\n• Fillings\n• Crowns and bridges\n• Cosmetic procedures";
  }
  
  // Cost inquiries
  if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('expensive') || lowerMessage.includes('insurance')) {
    return "Dental costs vary based on treatment needed:\n\n**General Services:**\n• Checkup & cleaning: $100-200\n• Filling: $150-400\n• Crown: $800-1500\n• Root canal: $800-1200\n\n**Payment Options:**\n• Insurance accepted\n• Payment plans available\n• Financing options\n• Discounts for multiple procedures\n\n**Contact us** for a personalized quote based on your specific needs!";
  }
  
  // Doctor/dentist information
  if (lowerMessage.includes('doctor') || lowerMessage.includes('dentist') || lowerMessage.includes('team')) {
    return "Our dental team includes:\n\n**Dr. Sarah Johnson** - General Dentistry\n• 10+ years experience\n• Specializes in preventive care\n\n**Dr. Michael Chen** - Oral Surgery\n• Advanced surgical procedures\n• Implant specialist\n\n**Dr. Emily Davis** - Cosmetic Dentistry\n• Smile makeovers\n• Veneers and whitening\n\nAll our dentists are:\n• Licensed and certified\n• Continuing education\n• Patient-focused care\n• Modern technology users";
  }
  
  // Cleaning and hygiene
  if (lowerMessage.includes('cleaning') || lowerMessage.includes('hygiene') || lowerMessage.includes('brush') || lowerMessage.includes('floss')) {
    return "**Daily Oral Hygiene Routine:**\n\n**Morning:**\n• Brush for 2 minutes with fluoride toothpaste\n• Use soft-bristled toothbrush\n• Replace brush every 3 months\n\n**After Meals:**\n• Rinse with water\n• Use mouthwash if needed\n\n**Evening:**\n• Brush thoroughly\n• Floss between all teeth\n• Use interdental brushes if needed\n\n**Professional Cleanings:**\n• Every 6 months recommended\n• Removes tartar buildup\n• Prevents gum disease\n• Early problem detection";
  }
  
  // Home remedies
  if (lowerMessage.includes('home remedy') || lowerMessage.includes('natural') || lowerMessage.includes('remedy')) {
    return "**Natural Dental Home Remedies:**\n\n**For Tooth Pain:**\n• **Saltwater rinse** - Mix 1/2 tsp salt in warm water, swish for 30 seconds\n• **Clove oil** - Apply small amount to affected area (dilute with carrier oil)\n• **Cold compress** - Apply ice pack wrapped in cloth for 15 minutes\n\n**For Gum Health:**\n• **Oil pulling** - Swish coconut oil for 10-15 minutes daily\n• **Green tea** - Rinse with cooled green tea (contains antioxidants)\n• **Aloe vera** - Apply pure aloe vera gel to gums\n\n**For Bad Breath:**\n• **Baking soda** - Brush with baking soda or use as mouthwash\n• **Parsley** - Chew fresh parsley leaves\n• **Apple cider vinegar** - Dilute 1 tbsp in water, rinse mouth\n\n**Important Notes:**\n• These are temporary relief methods\n• Always consult a dentist for persistent issues\n• Some remedies may not be suitable for everyone\n• Professional dental care is still essential\n\n**When to See a Dentist:**\n• Pain lasting more than 2 days\n• Swelling or fever\n• Difficulty swallowing\n• Signs of infection";
  }
  
  // General dental questions
  if (lowerMessage.includes('tooth') || lowerMessage.includes('teeth') || lowerMessage.includes('cavity') || lowerMessage.includes('decay')) {
    return "**Tooth Health Basics:**\n\n**Preventing Cavities:**\n• Limit sugary foods and drinks\n• Brush twice daily\n• Floss daily\n• Use fluoride toothpaste\n• Regular dental checkups\n\n**Signs of Problems:**\n• Tooth sensitivity\n• Pain when chewing\n• Visible holes or dark spots\n• Bad breath\n\n**Treatment Options:**\n• Fillings for small cavities\n• Crowns for larger damage\n• Root canals for infected teeth\n• Extractions if necessary\n\n**Remember:** Early detection saves time, money, and discomfort!";
  }
  
  // General greeting or help
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return "Hello! I'm your AI dental assistant. I can help you with:\n\n**🦷 General Questions:**\n• Oral health advice\n• Dental procedures\n• Prevention tips\n\n**📅 Appointments:**\n• Booking assistance\n• Scheduling help\n• Reminder information\n\n**👨‍⚕️ Our Team:**\n• Doctor information\n• Specialties\n• Experience details\n\n**💰 Costs:**\n• Pricing information\n• Insurance questions\n• Payment options\n\n**🚨 Emergencies:**\n• Urgent care guidance\n• Emergency contacts\n\nWhat would you like to know about?";
  }
  
  // Default response
  return "Thank you for your question! I'm here to help with dental health information. Based on your inquiry, I'd recommend:\n\n• Scheduling a consultation with one of our dentists\n• Checking our FAQ section\n• Contacting our office directly\n\nFor specific medical advice, always consult with a qualified dentist. Is there anything specific about dental health I can help you with?";
}
