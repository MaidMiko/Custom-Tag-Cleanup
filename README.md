# Custom Tag Cleanup Extension

## 📖 ภาษาไทย

### คำอธิบาย

ส่วนขยายสำหรับ **SillyTavern** ที่ช่วยล้างข้อความในห้องแชท  
โดยลบแท็กดีบัก/แท็กระบบที่ไม่ต้องการออกจากทุกข้อความที่อยู่ก่อนหน้าทั้งหมด  
และ **คงไว้เพียงข้อความล่าสุดตามจำนวนที่กำหนด (เริ่มต้น = 3 ข้อความ)**

### คุณสมบัติ

- 🧹 กดปุ่มครั้งเดียวเพื่อลบแท็กทั้งหมดในแชท  
- 🧩 รองรับแท็กที่ระบุไว้ในไฟล์ เช่น `<Echat>...</Echat>`  
- 💾 รายงานจำนวนอักขระที่ลบ และจำนวนโทเค็นที่ประหยัดได้โดยประมาณ  
- ⚡ รีเฟรชหน้าจอให้เห็นผลทันที (ไม่ต้องกด Edit)  
- 🔒 ผู้ใช้ทั่วไป **ไม่สามารถเพิ่มหรือลบแท็กเองได้** — มีเฉพาะผู้พัฒนาเท่านั้นที่แก้ในไฟล์ได้

### รายการแท็กที่ถูกลบโดยค่าเริ่มต้น

- `<details>...</details>`  
- `<Echat>...</Echat>`  
- `<g_pos_track>...</g_pos_track>`  
- `<LP>...</LP>`  
- `<STATUS>...</STATUS>`  
- `<TRK>...</TRK>`  
- `<TimeNa>...</TimeNa>`  
- `<Time_Na>...</Time_Na>`  
- `<Thought_na>...</Thought_na>`  
- `<UI>...</UI>`  
- `<notif_p>...</notif_p>`  
- `<tigger_ev>...</tigger_ev>`

> 🔧 หากต้องการเพิ่มหรือลดแท็ก ให้แก้ที่ตัวแปร `tagList` ภายในไฟล์ `index.js` โดยตรงเท่านั้น

### วิธีติดตั้ง

1. เปิด **SillyTavern → Extensions → Install from URL**  
2. วางลิงก์ GitHub Repository นี้  
3. เปิดใช้งาน **Custom Tag Cleanup** จากหน้า Extensions

### วิธีใช้งาน

- เมื่ออยู่ในห้องแชท ให้กดปุ่ม **🧹 Clean**  
- ระบบจะลบแท็กทั้งหมดที่ระบุออกจากทุกข้อความ  
- ข้อความล่าสุด (ค่าเริ่มต้น 2 อันสุดท้าย) จะถูกเก็บไว้  
- หลังทำงาน จะมี Toast แจ้งผล:  
  - จำนวนอักขระที่ลบ  
  - จำนวนโทเค็นโดยประมาณที่ประหยัดได้

> 💬 ปุ่มนี้เป็นโหมด Manual-Only — ไม่มีระบบอัตโนมัติ และไม่มีเมนูตั้งค่า  
> (กดซ้ำได้เรื่อย ๆ เพื่อเคลียร์อีกครั้ง)

### หมายเหตุ

- ระบบจะไม่ลบโค้ดบล็อก (```) หรือข้อความใน backtick (`…`)  
- HTML ปกติ (เช่น `<p>`, `<div>`) จะไม่ถูกแตะต้อง  

---

## 📖 English

### Description

A **SillyTavern** extension that cleans up chat logs  
by removing unwanted internal/debug tags from previous messages,  
leaving only the latest *N* messages (default: 2).

### Features

- 🧹 One-click cleanup of all old messages  
- 🧩 Removes predefined debug/UI tags such as `<Echat>...</Echat>`  
- 💾 Reports number of removed characters and estimated tokens saved  
- ⚡ Instant UI refresh (no need to manually edit messages)  
- 🔒 End-users cannot modify tag lists — only the developer can update `index.js`

### Tags Removed (Default)

`<details>`, `<Echat>`, `<g_pos_track>`, `<LP>`, `<STATUS>`, `<TRK>`,  
`<TimeNa>`, `<Time_Na>`, `<Thought_na>`, `<UI>`, `<notif_p>`, `<tigger_ev>`

> To edit the list, modify the `tagList` array directly inside `index.js`.

### Installation

1. Open **SillyTavern → Extensions → Install from URL**  
2. Paste this repository URL  
3. Enable **Custom Tag Cleanup** in the Extensions page

### Usage

- Click the **🧹 Clean** button while in a chat  
- The extension will remove all unwanted tags  
- Keeps only the most recent *N* messages (default 2)  
- A toast will appear showing how many characters/tokens were saved  

> Manual-only mode — no auto clean, no settings menu.  
> You can safely press multiple times if needed.

### Notes

- Code fences (```...```) and inline code (`...`) are preserved.  
- Standard HTML tags (`<p>`, `<div>`, etc.) are untouched.  

---

## 📄 License

````

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

