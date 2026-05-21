import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Database,
  FileText,
  UploadCloud,
  Copy,
  Check,
  Trash2,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Settings2,
  RefreshCw,
  BarChart2,
  Info,
  AlertTriangle,
  FileSpreadsheet,
  BookOpen
} from "lucide-react";
import Markdown from "react-markdown";

// Default system instructions for advanced customization & analysis format
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
- 善用 Markdown 的表格、列表、粗體、區塊引用與程式碼塊（尤其是數據部分）來使排版精緻、易讀。`;

// Preset CSV Template data for interactive client experimentation
const CSV_TEMPLATES = [
  {
    id: "sales",
    title: "📊 銷售與通路營收報表",
    description: "觀看不同產品類別、通路及銷售額的統計趨勢與關聯性。",
    data: `日期,商品分類,銷售量,客單價,銷售通路,銷售額
2026-05-01,消費電子,120,5400,線上官網,648000
2026-05-02,消費電子,98,5350,線上官網,524300
2026-05-03,智慧家居,45,2200,零售通路,99000
2026-05-04,生活周邊,210,450,線上官網,94500
2026-05-05,健康個人護理,85,1300,實體百貨,110500
2026-05-06,消費電子,150,5500,實體百貨,825000
2026-05-07,智慧家居,80,2400,線上官網,192000
2026-05-08,生活周邊,300,420,線上官網,126000
2026-05-09,健康個人護理,110,1250,線上官網,137500
2026-05-10,消費電子,85,5400,零售通路,459000`
  },
  {
    id: "marketing",
    title: "📈 網站流量與行銷轉化率",
    description: "分析各個媒體來源、跳出率以及投入行銷花費後的轉化率效益。",
    data: `日期,來源媒介,瀏覽量(PV),獨立訪客(UV),跳出率(%),目標轉化次數,行銷花費(TWD)
2026-05-10,Google搜尋,4500,3200,42.5,124,0
2026-05-11,Facebook廣告,8200,5400,68.2,342,12500
2026-05-12,電子報發送,1200,950,28.4,78,1400
2026-05-13,Google關鍵字廣告,3400,2100,55.1,165,6800
2026-05-14,Line官方帳號,1800,1400,35.0,92,800
2026-05-15,Instagram自然流量,2900,2150,48.6,85,0
2026-05-16,合作網紅KOL,15000,11000,52.3,950,45000
2026-05-17,Direct直接流量,2200,1800,38.1,54,0`
  },
  {
    id: "survey",
    title: "💡 APP 用戶滿意度與建議",
    description: "洞分析用戶反饋、系統類別、滿意分數與對應的具體產品建議。",
    data: `回饋時間,用戶ID,手機系統,APP版本,滿意度評分(1-5),反饋主題,具體建議
2026-05-18,U88319,iOS,v4.2.1,5,流暢度,新介面的操作非常滑順、動畫和視覺轉場很舒服！
2026-05-18,U10428,Android,v4.2.0,2,閃退問題,今天更新過後，在進入結帳介面時會直接崩潰關閉程式。
2026-05-19,U99427,iOS,v4.2.1,4,新功能建議,希望在數據儀表板中可以儲存多組自訂篩選條件。
2026-05-19,U43105,Android,v3.9.8,1,版本更新,強烈要求不要強制要求舊版Android更新否則無法使用。
2026-05-20,U50182,iOS,v4.2.1,5,點讚支援,客服系統回覆效率非常高，問題兩小時內就釐清解決了。
2026-05-20,U63911,iOS,v4.2.1,3,介面排版,字體在深色模式下對比度有點低，在戶外陽光下看得很吃力。`
  }
];

// Simple helper to parse CSV contents locally for preview grids and metrics
interface ParsedCSV {
  headers: string[];
  rows: string[][];
}

function parseCSVText(text: string): ParsedCSV {
  if (!text || !text.trim()) return { headers: [], rows: [] };
  
  const lines: string[] = [];
  let currentLine = "";
  let insideQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
      currentLine += char;
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = "";
      if (char === "\r" && text[i + 1] === "\n") {
        i++; // skip joint CRLF
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (lineString: string): string[] => {
    const result: string[] = [];
    let currentVal = "";
    let inQuotes = false;
    for (let i = 0; i < lineString.length; i++) {
      const char = lineString[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(currentVal.trim().replace(/^"|"$/g, ""));
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
    result.push(currentVal.trim().replace(/^"|"$/g, ""));
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines
    .slice(1)
    .map((line) => parseLine(line))
    .filter((row) => row.length > 0 && row.some((cell) => cell !== ""));

  return { headers, rows };
}

export default function App() {
  const [csvContent, setCsvContent] = useState<string>("");
  const [systemInstruction, setSystemInstruction] = useState<string>(DEFAULT_SYSTEM_INSTRUCTION);
  const [isInstructionModified, setIsInstructionModified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultEndRef = useRef<HTMLDivElement>(null);

  // Periodic visual loading text steps to soothe API waiting latency
  const loadingSteps = [
    "📡 正在發送數據流至 AI 分析伺服器...",
    "🔍 正在解析 CSV 欄位，分析結構特徵與資料筆數...",
    "📊 正在生成數據基本描述與核心統計數值指標...",
    "📈 正在分析多維度關聯性、識別潛在的核心關鍵趨勢...",
    "🔍 發現關鍵異常模式、洞見特異點並進行可能原因推理...",
    "💡 依據指標建立 3-5 項商業落地化具體執行方案建議...",
    "🔮 利用趨勢建模合理推演未來變革及經營展望...",
    "✨ 正在精心排版、並渲染優雅美觀的 Markdown 報告..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 5000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Show auto-dismiss toast alerts
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Preset Template Loader handler
  const loadPresetTemplate = (templateData: string) => {
    setCsvContent(templateData);
    setErrorMessage(null);
    showToast("已成功載入精選行銷範例數據！", "success");
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      readUploadedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      readUploadedFile(e.target.files[0]);
    }
  };

  const readUploadedFile = (file: File) => {
    const isCsv = file.name.endsWith(".csv") || file.name.endsWith(".txt") || file.type === "text/csv";
    if (!isCsv) {
      showToast("系統限制：僅支援上傳 .csv 或 .txt 副檔名之文字檔案！", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setCsvContent(text);
        setErrorMessage(null);
        showToast(`已成功匯入檔案：${file.name}`, "success");
      }
    };
    reader.onerror = () => {
      showToast("檔案讀取失敗，請重新嘗試！", "error");
    };
    reader.readAsText(file);
  };

  // Parse CSV state on the fly
  const parsedData = parseCSVText(csvContent);

  // Trigger server-side proxy API to invoke standard gemini-3.5-flash
  const executeAiAnalysis = async () => {
    if (!csvContent.trim()) {
      setErrorMessage("請提供 CSV 數據內容！您可點擊上方範本、拖曳上傳 CSV 檔、或自行貼上文字內容。");
      showToast("請提供 CSV 數據內容", "error");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setAnalysisResult("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          csvData: csvContent,
          customSettings: {
            systemInstruction: systemInstruction
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "AI 洞察分析服務在串接時發生錯誤。");
      }

      setAnalysisResult(data.result);
      showToast("數據智慧分析生成完畢！", "success");

      // Auto-scroll to result panel for elegant desktop view focus
      setTimeout(() => {
        resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "未能成功連接 AI 分析引擎，請再度嘗試，或於 Settings configuration 中檢查 API 密鑰配置。");
      showToast("分析服務連接失敗", "error");
    } finally {
      setLoading(false);
    }
  };

  // Copy with temporary visual feedback
  const copyToClipboard = async () => {
    if (!analysisResult) return;
    try {
      await navigator.clipboard.writeText(analysisResult);
      setIsCopied(true);
      showToast("分析報告已成功複製至剪貼簿！", "success");
      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    } catch (err) {
      showToast("複製失敗，請手動全選複製！", "error");
    }
  };

  const handleResetInstruction = () => {
    setSystemInstruction(DEFAULT_SYSTEM_INSTRUCTION);
    setIsInstructionModified(false);
    showToast("System Instruction 已恢復為預設專業設定。", "info");
  };

  const handleClearAll = () => {
    setCsvContent("");
    setAnalysisResult("");
    setErrorMessage(null);
    showToast("已清空所有貼上的數據與先前分析結果。", "info");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-teal-100 pb-16">
      
      {/* Toast Notification Header Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl border backdrop-blur-md"
            style={{
              backgroundColor:
                toastMessage.type === "success"
                  ? "rgba(240, 253, 250, 0.95)"
                  : toastMessage.type === "error"
                  ? "rgba(254, 242, 242, 0.95)"
                  : "rgba(240, 246, 255, 0.95)",
              borderColor:
                toastMessage.type === "success"
                  ? "#0d9488"
                  : toastMessage.type === "error"
                  ? "#ef4444"
                  : "#3b82f6",
              color:
                toastMessage.type === "success"
                  ? "#115e59"
                  : toastMessage.type === "error"
                  ? "#991b1b"
                  : "#1e40af"
            }}
          >
            {toastMessage.type === "success" && <Check className="w-5 h-5 shrink-0" />}
            {toastMessage.type === "error" && <AlertTriangle className="w-5 h-5 shrink-0" />}
            {toastMessage.type === "info" && <Info className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header Brand banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-teal-600 to-emerald-500 text-white p-2.5 rounded-xl shadow-md shadow-teal-100">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                AI 數據分析與洞察工具
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                Advanced CSV Business Intelligence & Predictive Analytics Engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200">
            <Database className="w-3.5 h-3.5 text-teal-600" />
            <span>核心：Google Gemini AI (gemini-3.5-flash)</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Helper Introduction Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 shadow-sm flex flex-col md:flex-row items-start gap-4">
          <div className="bg-teal-50 text-teal-700 p-3 rounded-xl shrink-0">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-slate-800">
              歡迎使用 AI 專業級商業數據解構工具
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              本工具運用新版多維度 AI 推理技術，協助您快速提煉報表價值。您只需<b>貼上 CSV 純文字、點擊下載預設範本試算、或上傳隨身報表檔案</b>。AI 將自動識別指標特徵、挖掘增長與異常，並提供具體可落地的商業執行指南。
            </p>
          </div>
        </div>

        {/* Workspace Dual Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: CSV Paste Input & Custom Prompts */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Part A: Preset Dataset Picker */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  步驟 1: 選擇範本數據或貼入來源
                </h3>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                  隨點即測
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {CSV_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => loadPresetTemplate(tmpl.data)}
                    className="group text-left p-3 rounded-xl border border-slate-100 hover:border-teal-200 bg-slate-50/50 hover:bg-teal-50/20 transition-all duration-200 hover:shadow-xs focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                        {tmpl.title}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transform group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Part B: Main CSV Drag & Paste Textarea block */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                  貼上或拖曳 CSV 數據內容
                </label>
                {csvContent && (
                  <button
                    onClick={handleClearAll}
                    className="text-slate-400 hover:text-red-500 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    title="清空上傳資料"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>清空</span>
                  </button>
                )}
              </div>

              {/* Drag and Drop Box Area wrapper */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-1.5 ${
                  dragActive
                    ? "border-teal-500 bg-teal-50/40"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <textarea
                  value={csvContent}
                  onChange={(e) => {
                    setCsvContent(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  id="csv-text-input"
                  placeholder="請在此貼上您的 CSV 格式數據（首行為欄位名稱，各欄以英文逗號區隔）..."
                  rows={13}
                  className="w-full text-xs font-mono bg-transparent border-0 p-3 focus:ring-0 focus:outline-none resize-y leading-relaxed text-slate-700 placeholder:text-slate-400"
                />

                {/* Upload Float Drag Helper overlay */}
                {!csvContent && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors gap-2 p-4 text-center select-none"
                  >
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-teal-500" />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700">
                        點擊選擇或拖曳 CSV 檔案至此處
                      </p>
                      <p className="text-[10px] text-slate-400 px-4">
                        支援 UTF-8 編碼之標準 .csv / .txt 純文字資料表
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Hidden Native File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Live Data Meta Status Indicators */}
              {csvContent && (
                <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 rounded-xl p-3 border border-slate-100 font-mono text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-slate-400" />
                    <span>資料統計：</span>
                    <strong className="text-slate-700 font-semibold">
                      {parsedData.rows.length}
                    </strong>
                    <span>筆紀錄</span>
                    <span className="text-slate-300">|</span>
                    <strong className="text-slate-700 font-semibold">
                      {parsedData.headers.length}
                    </strong>
                    <span>個特徵欄位</span>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-teal-600 hover:text-teal-800 transition-colors font-sans font-medium hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    重新上傳
                  </button>
                </div>
              )}
            </div>

            {/* Part C: Advanced System Instructions Modifier (Accordion tab) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 text-left flex items-center justify-between border-b border-rose-100/10 focus:outline-none transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-semibold text-slate-800">
                    🛠️ 精準微調：AI 分析指令設定 (System Instruction)
                  </span>
                  {isInstructionModified && (
                    <span className="text-[9px] bg-amber-100 border border-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full font-sans">
                      已修改
                    </span>
                  )}
                </div>
                {showAdvancedSettings ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {showAdvancedSettings && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 space-y-3 bg-white border-t border-slate-100">
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        您可以自訂 AI 所扮演的角色、分析維度及回應格式。當您點擊套用，系統將依據您修改後的 System Instruction 輸入指令限制執行。
                      </p>
                      <textarea
                        value={systemInstruction}
                        onChange={(e) => {
                          setSystemInstruction(e.target.value);
                          setIsInstructionModified(e.target.value !== DEFAULT_SYSTEM_INSTRUCTION);
                        }}
                        rows={8}
                        className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none leading-relaxed text-slate-700"
                        placeholder="請自訂系統指令以引導 AI 分析..."
                      />
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-400">
                          指令總字數：{systemInstruction.length} 字
                        </span>
                        <button
                          type="button"
                          onClick={handleResetInstruction}
                          disabled={systemInstruction === DEFAULT_SYSTEM_INSTRUCTION}
                          className="text-slate-500 hover:text-teal-600 disabled:opacity-40 disabled:hover:text-slate-500 font-medium cursor-pointer transition-colors"
                        >
                          重設為預設
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error Message Section */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs space-y-1.5 leading-relaxed">
                <div className="font-semibold flex items-center gap-1.5 text-rose-900">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  數據處理異常
                </div>
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Action Submit button */}
            <button
              onClick={executeAiAnalysis}
              disabled={loading || !csvContent.trim()}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                loading
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : !csvContent.trim()
                  ? "bg-slate-200 text-slate-400 hover:bg-slate-200 transition-none cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 text-white hover:shadow-lg hover:shadow-teal-100 active:scale-[0.99]"
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                  <span>AI 正在探勘數據中，請稍候...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>開始 AI 數據分析與洞察</span>
                </>
              )}
            </button>

          </div>

          {/* Right Panel: Render Grid Matrix & Output result Markdown */}
          <div className="lg:col-span-7 space-y-6">

            {/* Component B1: Paste Validation Grid Preview */}
            {csvContent && parsedData.headers.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-teal-600" />
                  來源資料網格預覽 (僅呈現前 5 筆)
                </h4>
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="min-w-full divide-y divide-slate-150 text-[11px] font-mono">
                    <thead className="bg-slate-50">
                      <tr>
                        {parsedData.headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-3 py-2.5 text-left font-semibold text-slate-700 whitespace-nowrap"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100 text-slate-600">
                      {parsedData.rows.slice(0, 5).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50 text-slate-700">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-2 whitespace-nowrap">
                              {cell || <span className="text-slate-300">N/A</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedData.rows.length > 5 && (
                  <p className="text-[10px] text-slate-400 text-right italic">
                    * 完整數據共 {parsedData.rows.length} 筆，已在分析範圍內。
                  </p>
                )}
              </div>
            )}
            
            {/* Component B2: Main AI Insights Output area */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col min-h-[500px]">
              
              {/* Output block Header Controls */}
              <div className="bg-gradient-to-r from-slate-50 to-white px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">
                    AI 深度數據洞察與決策報告
                  </span>
                </div>

                {analysisResult && (
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium text-slate-700 hover:text-teal-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-300 rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5 transition-all active:scale-[0.98]"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">已複製報告！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>一鍵複製 Markdown</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Main output Content Wrapper (States) */}
              <div className="p-6 flex-1 flex flex-col relative min-h-[400px]">
                
                {/* 1. Loading Animated Stage placeholder */}
                {loading && (
                  <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
                    <div className="relative mb-6">
                      <div className="w-14 h-14 rounded-full border-4 border-slate-100 border-t-teal-600 animate-spin" />
                      <Sparkles className="w-6 h-6 text-teal-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    
                    <h5 className="font-semibold text-slate-800 text-sm mb-2">
                      AI 數據大師正在分析中...
                    </h5>
                    
                    <div className="h-6 overflow-hidden w-full">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={loadingStep}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.25 }}
                          className="text-xs text-teal-600 font-medium font-sans"
                        >
                          {loadingSteps[loadingStep]}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    <div className="w-48 bg-slate-150 h-1.5 rounded-full overflow-hidden mt-6">
                      <motion.div
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full"
                        animate={{
                          x: ["-100%", "100%"]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.2,
                          ease: "easeInOut"
                        }}
                        style={{ width: "60%" }}
                      />
                    </div>
                  </div>
                )}

                {/* 2. Success Render Markdown Output */}
                {analysisResult ? (
                  <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed text-xs focus:outline-none select-text markdown-body">
                    <Markdown>{analysisResult}</Markdown>
                  </div>
                ) : !loading ? (
                  
                  /* 3. Empty State initial helper guidance card */
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 select-none">
                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-full text-slate-400 mb-4 animate-bounce">
                      <FileText className="w-10 h-10 stroke-1.5" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1.5">
                      待機中：尚未進行數據探勘
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                      請在左側填入 CSV 指標、上傳檔案，或挑選右側下方的「範本報表」填滿文字欄位，隨後點擊「開始 AI 分析」按鈕以產生報告。
                    </p>

                    {/* Quick Start Guidance Tips in empty state */}
                    <div className="mt-8 text-left max-w-sm bg-slate-50 border border-slate-200/50 rounded-xl p-4 space-y-2.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        💡 快速操作提示
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>點擊上方<b>「隨點即測」</b>中的任何報表範本，直接帶入！</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>點擊上傳貼上任何您自己的公司、學校或個人分析資料。</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>產出報告後，可點選一鍵複製成 Markdown 在 Word 或 Notion 中完美排版。</span>
                        </li>
                      </ul>
                    </div>

                  </div>
                ) : null}

                {/* Anchor for Auto Scroll */}
                <div ref={resultEndRef} />
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
