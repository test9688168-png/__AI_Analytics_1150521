# 📊 AI 數據分析與洞察工具 (AI CSV Analytics Dashboard)

這是一個基於 **React 19**、**Vite 6** 與 **Express** 打造的現代化 AI 數據分析平台。使用者只需貼上 CSV 數據或拖曳上傳報表檔案，即可透過 **Google Gemini 3.5 Flash** 進行全面且深入的商業分析、特異值偵測，並獲得具體可落地的商業改進建議。

---

## 🌟 核心特色

*   📊 **資料一鍵帶入**：預設銷售營收、行銷轉換率、滿意度問卷等精選範本，隨點隨測。
*   📂 **多元匯入方式**：支援手動貼上 CSV 純文字，或直接拖曳上傳 `.csv` / `.txt` 表格檔案。
*   🧭 **即時資料預覽**：系統自動解析 CSV 結構，呈現前 5 筆資料預覽，並即時統計欄位數與資料筆數。
*   ⚙️ **自訂 AI 分析指令**：提供高級設定面板，允許精準微調 AI 的分析角色、報告架構與字數限制 (System Instruction)。
*   ⏳ **智能進度追蹤**：AI 分析過程中提供視覺化動態步驟進度提示，大幅降低等待焦慮。
*   ✍️ **精美報告渲染**：利用 Markdown 格式渲染報告，包含數據表格、重點標註、段落引用，排版清晰易讀。
*   📋 **一鍵複製報告**：分析完成後可一鍵複製 Markdown 原始碼，完美相容 Notion、Word、Google 文件。

---

## 🛠️ 技術棧 (Technology Stack)

*   **前端 (Frontend)**：React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion (動畫), Lucide React (圖標)
*   **後端 (Backend)**：Express, TypeScript, TSX (本地開發執行)
*   **AI 引擎**：Google GenAI SDK (`@google/genai`), Gemini 3.5 Flash (`gemini-3.5-flash`)

---

## 🚀 快速開始

### 前置準備 (Prerequisites)
1. 安裝 [Node.js](https://nodejs.org/) (建議 v20 以上版本)。
2. 取得 Google Gemini API Key。可前往 [Google AI Studio](https://aistudio.google.com/) 免費申請。

### 本地開發步驟
1.  **安裝依賴項目**：
    ```bash
    npm install
    ```

2.  **設定環境變數**：
    請編輯專案根目錄下的 `.env` 檔案並填入您的 Gemini API Key：
    ```bash
    GEMINI_API_KEY="您的_GEMINI_API_KEY"
    ```

3.  **啟動開發伺服器**：
    ```bash
    npm run dev
    ```
    啟動後，開啟瀏覽器造訪：`http://localhost:3000`

---

## 📦 專案生產環境打包 (Production Build)

若您想要在生產伺服器上直接打包並執行：

1.  **編譯專案**：
    ```bash
    npm run build
    ```
    此命令會：
    *   將前端 React 專案編譯至 `dist/` 資料夾下。
    *   使用 `esbuild` 將後端 `server.ts` 編譯為獨立且高效的 `dist/server.cjs` 檔案。

2.  **啟動生產環境伺服器**：
    ```bash
    npm start
    ```

---

## 📂 專案目錄結構

```text
├── .env                  # 本地環境變數設定檔 (未追蹤敏感金鑰)
├── .gitignore            # Git 忽略檔案設定
├── package.json          # 專案套件及腳本配置
├── tsconfig.json         # TypeScript 設定
├── vite.config.ts        # Vite 6 + Tailwind 4 構建設定
├── server.ts             # Express 後端主程式 (整合 Vite 中間件與 Gemini API)
├── src/                  # 前端 React 原始碼
│   ├── main.tsx          # 前端進入點
│   ├── App.tsx           # 前端儀表板 UI 與主要邏輯
│   └── index.css         # 全域 Tailwind CSS 樣式
└── dist/                 # 構建輸出目錄 (執行 npm run build 後產生)
```

---

## 📄 開源授權

本專案採用 [MIT License](LICENSE) 進行授權。
