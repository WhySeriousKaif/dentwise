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

    // Check if Gemini API is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        message: 'Gemini API not configured. Please set GEMINI_API_KEY in environment variables.' 
      }, { status: 500 });
    }

    // Use Gemini API for text-based conversation
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are DentWise AI, a professional dental assistant. You help patients with:

- General dental health questions
- Appointment scheduling guidance  
- Dental procedure explanations
- Oral hygiene advice
- Emergency dental guidance
- Cost and insurance information

Guidelines:
- Always be professional and empathetic
- Provide accurate, evidence-based information
- For medical emergencies, direct users to seek immediate professional care
- Keep responses concise but informative
- Ask clarifying questions when needed
- Never provide specific medical diagnoses
- Use markdown formatting for better readability

User question: ${message}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request at the moment.";
    
    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      source: 'gemini'
    });

  } catch (error) {
    console.error('Gemini Chat API error:', error);
    
    // Fallback to simple responses if Gemini fails
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
