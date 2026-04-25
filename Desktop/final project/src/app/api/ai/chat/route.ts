import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history } = body;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: "GROQ_API_KEY is not defined in environment variables. Please restart your server." 
      }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    // 1. Context Retrieval with Timeout/Error handling
    let postsContext = "";
    try {
      await connectToDatabase();
      const searchTerms = message.split(' ').filter((w: string) => w.length > 2).join(' ');
      
      const contextPosts = await Post.find(
        searchTerms ? { $text: { $search: searchTerms }, status: "active" } : { status: "active" }
      )
      .populate("author", "name")
      .limit(5)
      .lean();

      if (contextPosts && contextPosts.length > 0) {
        postsContext = "Relevant posts from our database:\n" + contextPosts.map((p: any) => 
          `- [${p.type.toUpperCase()}] Title: ${p.title} | Location: ${p.city}, ${p.location} | Posted by: ${p.author?.name || "Anonymous"} | Post ID: ${p._id}`
        ).join('\n');
      }
    } catch (dbError) {
      console.warn("DB Context failed, continuing without it:", dbError);
      postsContext = "(Note: Live database search currently unavailable)";
    }

    // 2. Prepare Prompt
    const systemPrompt = `
      You are the AI assistant for 'RecoverIt' (Lost & Found Agadir, Morocco).
      Be helpful, concise, and friendly. 
      
      CRITICAL LANGUAGE RULES:
      - If the user speaks in Darija (Moroccan Arabic), even if they use Latin script (Arabezi/Franco-Arabic like 'b7al hadchi'), you MUST respond in Darija using ARABIC SCRIPT (Hrouf l-3arbiya).
      - If the user speaks in French or English, respond in that same language.
      - Always prioritize being helpful to people in Agadir.

      ${postsContext}
      
      Instructions:
      - If they lost something, CHECK the database posts above. If you find a match (e.g., they lost a 'shoe' and there is a 'FOUND' post with 'shoe'), tell them: "I found a match! It was posted by [Name]. You can find it in the list."
      - If no match is found, tell them to use the 'Report Lost' button.
      - If they found something, tell them to use the 'Report Found' button.
      - Always mention the location and the name of the person who posted the item if a match is found.
    `;

    // 3. Call Groq with a reliable model
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...(history || []).map((h: any) => ({
          role: h.role === "model" ? "assistant" : "user",
          content: h.text || h.parts?.[0]?.text || ""
        })),
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile", // Currently active and reliable model
      temperature: 0.6,
      max_tokens: 512,
    });

    const aiMessage = chatCompletion.choices[0]?.message?.content || "No response from AI.";

    return NextResponse.json({ success: true, message: aiMessage });

  } catch (error: any) {
    console.error("CRITICAL AI CHAT ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      error: `AI Error: ${error.message || "Unknown error"}` 
    }, { status: 500 });
  }
}
