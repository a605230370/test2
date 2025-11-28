import { GoogleGenAI } from "@google/genai";
import { Category, FetchResult, Region, TrendItem, CATEGORIES, USER_KNOWLEDGE_BASE_URL } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (category: Category, region: Region, keywords?: string): string => {
  const categoryInfo = CATEGORIES.find(c => c.id === category);
  const regionContext = region === 'china' 
    ? "Focus on Chinese platforms like WeChat Articles (公众号), Bilibili, Juejin, 36Kr." 
    : "Focus on global platforms like X (Twitter), YouTube, TechCrunch, Hacker News, Medium.";
  
  const languageInstruction = "Ensure the output titles and summaries are in Simplified Chinese (简体中文).";

  let specificInterest = "";
  if (keywords && keywords.trim()) {
    specificInterest = `\n    CRITICAL INSTRUCTION: The user is specifically interested in "${keywords.trim()}". YOU MUST PRIORITIZE searching for news and trends related to these specific keywords. Only if absolutely no relevant information is found should you fall back to general ${categoryInfo?.label} trends.`;
  }

  // Fusion Instruction
  const knowledgeBaseContext = `
    DATA FUSION INSTRUCTION:
    The user maintains a manually curated list of tracked hotspots at this URL: ${USER_KNOWLEDGE_BASE_URL}
    1. USE Google Search to attempt to retrieve recent topics or signals from this specific Feishu/Lark document.
    2. PRIORITIZE topics that are present in BOTH the general web trends AND this user knowledge base.
    3. If the knowledge base is not directly readable, use it as a high-priority search context: assume the user values the types of high-quality, curated content found in such wikis.
  `;

  return `
    You are an advanced AI daily trend monitoring system.
    Task: Compile a Daily Digest of the most significant news and trends (past 24 hours) regarding ${categoryInfo?.promptDesc}.
    Region Context: ${regionContext}
    ${knowledgeBaseContext}
    ${specificInterest}
    ${languageInstruction}
    
    Please find exactly 6 distinct, high-quality trend items that define today's updates.
    
    CRITICAL OUTPUT FORMAT:
    You must output the results in a strict structured format using specific delimiters so I can parse it programmatically. 
    Do not use JSON blocks. Use the following format for each item:

    ###ITEM_START###
    TITLE: [Insert concise title here]
    SUMMARY: [Insert a 2-sentence summary of the event or content]
    PLATFORM: [Source platform name, e.g., Bilibili, arXiv, TechCrunch]
    TAGS: [Tag1], [Tag2], [Tag3]
    ###ITEM_END###

    Repeat this block for 6 items.
  `;
};

export const fetchTrends = async (category: Category, region: Region, keywords?: string): Promise<FetchResult> => {
  try {
    const modelId = 'gemini-2.5-flash';
    const prompt = generatePrompt(category, region, keywords);

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType is NOT supported with googleSearch
      },
    });

    const text = response.text || "";
    
    // Extract Grounding Metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Unknown Source',
        uri: chunk.web?.uri || '#',
      }))
      .filter((s: any) => s.uri !== '#')
      // Deduplicate sources based on URI
      .filter((v: any, i: any, a: any) => a.findIndex((t: any) => t.uri === v.uri) === i);

    // Parse the text manually since we couldn't use JSON mode
    const trends: TrendItem[] = [];
    const itemRegex = /###ITEM_START###([\s\S]*?)###ITEM_END###/g;
    let match;

    while ((match = itemRegex.exec(text)) !== null) {
      const itemContent = match[1];
      
      const titleMatch = itemContent.match(/TITLE:\s*(.*)/);
      const summaryMatch = itemContent.match(/SUMMARY:\s*(.*)/);
      const platformMatch = itemContent.match(/PLATFORM:\s*(.*)/);
      const tagsMatch = itemContent.match(/TAGS:\s*(.*)/);

      if (titleMatch && summaryMatch) {
        trends.push({
          id: Math.random().toString(36).substr(2, 9),
          title: titleMatch[1].trim(),
          summary: summaryMatch[1].trim(),
          platform: platformMatch ? platformMatch[1].trim() : 'Web',
          tags: tagsMatch 
            ? tagsMatch[1].split(/,|，/).map(t => t.trim()).filter(t => t.length > 0) 
            : ['AI', 'Trend'],
        });
      }
    }

    return {
      trends,
      sources,
      rawText: text // Keep for debugging or fallback display
    };

  } catch (error) {
    console.error("Error fetching trends:", error);
    throw error;
  }
};