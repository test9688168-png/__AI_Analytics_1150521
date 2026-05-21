import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazily initialize Gemini Client to prevent crash on startup if GEMINI_API_KEY is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("找不到 GEMINI_API_KEY 環境變數。請在 AI Studio 中透過『Settings > Secrets』設定您的 API 憑證。");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const DEFAULT_SYSTEM_INSTRUCTION = `你是一位專業且資深的數據分析師與商業洞察專家。
當使用者提供 CSV 格式的報表資料時，請進行全面而深入的數據分析，並依據以下結構，使用繁體中文（Taiwan）輸出結構化且美觀的 Markdown 報告：

1. 📊 **數據概要與基本統計**：
   - 簡述數據集大小（欄位數、列數/資料筆數）。
   - 提供關鍵數據指標或趨勢的統計摘要（例如最大值、最小值、平均值或重點項目的佔比）。

2. 📈 **核心趨勢與關鍵發現 (Key Insights)**：
   - 條列指出數據中顯著的增長、衰退、週期性變化或重要發現。
   - 使用數據點 (具體數值、百分比) 來佐證你的發現。

3. 🔍 **潛在異常或值得注意的特異值 (Anomalies & Patterns)**：
   - 指出任何超出常規的數值、缺漏值或不尋常的資料特徵，並給出可能的原理解釋（例如季節性爆發、資料登錄錯誤等）。

4. 💡 **具體行動建議與商業決策 (Actionable Recommendations)**：
   - 根據分析結果，提供 3-5 項具體、可落地的商業或行動改進建議。
   - 每項建議需說明其背後的數據依據與預期效益。

5. 🔮 **未來展望或預測分析**：
   - 基於現有數據趨勢，對未來的發展方向或潛在風險進行合理預測。

請務必確保：
- 使用繁體中文（Taiwan）撰寫。
- 語氣專業、客觀、具說服力且字句簡練。
- 善用 Markdown 的表格、列表、粗體、區塊引用與程式碼塊（尤其是數據部分）來使排版精緻、易讀。
- 若偵測到輸入的不是標準 CSV 格式或資料嚴重毀損缺漏，請以專業語氣提醒使用者，並盡可能就現有的破碎資訊進行最佳推估。`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON payloads for CSV pasting up to 15MB
  app.use(express.json({ limit: "15mb" }));

  // API Route for Data Analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { csvData, customSettings } = req.body;
      if (!csvData || typeof csvData !== "string" || !csvData.trim()) {
        return res.status(400).json({ error: "請貼上有效的 CSV 格式數據以供 AI 進行分析。" });
      }

      // Obtain a lazily initialized Gemini AI instance
      const ai = getGeminiClient();

      const chosenSystemInstruction = customSettings?.systemInstruction?.trim() || DEFAULT_SYSTEM_INSTRUCTION;
      const userPrompt = `這是我的 CSV 資料，請為我進行全方位的數據分析與產出專業報告：\n\n\`\`\`csv\n${csvData}\n\`\`\``;

      // Invoke the recommended gemini-3.5-flash model
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: chosenSystemInstruction,
          temperature: 0.2, // Consistent, high-fidelity analysis
        },
      });

      const resultText = response.text || "AI 處理完成，但未回傳任何有效文本內容。";
      return res.json({ result: resultText, systemInstructionUsed: chosenSystemInstruction });

    } catch (error: any) {
      console.error("Gemini Analysis Failure:", error);
      const errorMessage = error.message || "無法完成數據分析。請確認您的環境變數配置或 API Key 是否正確。";
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Integrate Express with Vite or Static Assets depending on runtime mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server successfully engaged. Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
