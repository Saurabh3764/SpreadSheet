📊 React Spreadsheet Component This is a dynamic spreadsheet built with React, featuring editable cells, formula support (e.g., =SUM(A1:B2)), keyboard navigation, formatting options (bold, background color), and the ability to save/load data via JSON.


Live Demo Link - https://sprightly-starlight-a76406.netlify.app/


🚀 Features

✅ 10x10 Editable Grid by default

➕ Add Rows & Columns dynamically

🧮 Formula Support: =SUM(A1:B2), =AVG(A1:B2), and basic arithmetic like =A1+B2

💾 Save/Load Spreadsheet as JSON

🧭 Keyboard Navigation: Arrow keys, Tab

📋 Copy & Paste: Use Ctrl+C / Ctrl+V between cells

✨ Formatting: Toggle Bold and Background color

🔄 Reset Button to clear everything

💡 Auto Evaluation of formulas on load/edit

***************************************** Project Structure *******************************

📁 Project Structure css Copy Edit src/ ├── components/ │ ├── Spreadsheet.js │ └── Cell.js ├── App.js └── index.js 📦 Available Commands npm start – Run the dev server

npm run build – Build for production

🧪 Formula Syntax Guide Sum a range: =SUM(A1:B2)

Average a range: =AVG(A1:B2)

Basic math: =A1 + B2 * 2

If cells in the formula contain invalid or non-numeric data, they default to 0.

🎮 Keyboard Shortcuts Arrow Keys: Move between cells

Tab: Move right (wraps to next row)

Ctrl+C: Copy selected cell

Ctrl+V: Paste into selected cell

Ctrl+B: Toggle bold formatting

Backspace: Clear cell content

📂 Save & Load Save: Downloads current spreadsheet data as a .json file

Load: Upload a previously saved .json file to restore your sheet

🧼 Reset Click the Reset button to clear all data and local storage.
