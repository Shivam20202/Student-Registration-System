# 🎓 Student Registration System

A fully functional, responsive **Student Registration System** built with vanilla HTML, CSS, and JavaScript — developed as an assignment for **Internshala Training (JavaScript DOM Manipulation)**.

---

## 📸 Features

| Feature | Details |
|---|---|
| ➕ Add Students | Register students with Name, ID, Email, and Contact No. |
| ✏️ Edit (Popup Modal) | Edit any record via a smooth animated popup modal |
| 🗑️ Delete (Popup Modal) | Confirm deletion via a dedicated confirmation popup |
| 💾 Persistent Storage | Data saved in `localStorage` — survives page refresh |
| ✅ Input Validation | Real-time inline validation with descriptive error messages |
| 🔍 Live Search | Filter the table instantly by any field |
| 📜 Dynamic Scrollbar | Vertical scrollbar added via JS when records exceed 5 |
| 📱 Fully Responsive | Works on mobile (≤640px), tablet (641–1024px), desktop (≥1025px) |
| 🎨 Modern Dark UI | Animated gradient mesh background, smooth transitions, toast alerts |

---

## 📁 File Structure

```
student-registration-system/
│
├── index.html       # Main HTML structure
├── style.css        # All CSS styling (if separated)
├── script.js        # All JavaScript logic (if separated)
└── README.md        # Project documentation
```

> **Note:** For GitHub submission, the project is delivered as a single `index.html` with embedded CSS and JS. For separate commits, extract the `<style>` block into `style.css` and the `<script>` block into `script.js`.

---

## 🗂️ Assignment Task Coverage

### Task 1 — Basic Structure (5 Marks)
- `index.html` created with complete HTML5 boilerplate
- Meaningful `<title>` and `<meta>` tags (charset, viewport, description, author)

### Task 2 — Header (5 Marks)
- Catchy heading: **"Student Registration System"**
- Brief description paragraph summarizing system functionality
- Styled badge label "Internshala Assignment"

### Task 3 — Form & Input Fields (5 Marks)
- Form with four fields: **Student Name**, **Student ID**, **Email ID**, **Contact Number**
- Proper labels, placeholders, and accessible layout
- Styled with consistent spacing and dark-theme design

### Task 4 — Display Section (15 Marks)
- Registered records displayed in a responsive table on the same page
- Columns: `#`, Name, Student ID, Email, Contact No., Actions
- Fully responsive — adapts to all screen sizes

### Task 5 — Styling & Design (20 Marks)
- Custom CSS with variables for consistent theming
- Animated gradient mesh background
- Google Fonts: **Playfair Display** (headings) + **DM Sans** (body)
- Smooth hover states, transitions, row animations, and toast notifications
- Responsive across mobile, tablet, and desktop breakpoints

### Task 6 — JavaScript Functionality (40 Marks)
- ✅ **Add** new student records
- ✅ **Edit** records via popup modal (pre-filled, validated)
- ✅ **Delete** records via confirmation popup modal
- ✅ **LocalStorage** persistence — data survives page refresh
- ✅ **Validation**:
  - Student Name → letters and spaces only
  - Student ID → numbers only
  - Email → valid email format (`user@domain.tld`)
  - Contact Number → numbers only, minimum 10 digits
- ✅ **Empty row prevention** — toast alert shown
- ✅ **Duplicate ID prevention**
- ✅ **Dynamic vertical scrollbar** added via JavaScript when rows > 5

### Task 7 — Documentation & Comments (10 Marks)
- ✅ Flat, organized file structure (no nested folders)
- ✅ Inline code comments throughout HTML, CSS, and JS
- ✅ This README file
- ✅ Creative and polished presentation

---

## 🚀 Getting Started

### Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/student-registration-system.git
   ```

2. Open the project folder:
   ```bash
   cd student-registration-system
   ```

3. Open `index.html` in any modern browser:
   ```bash
   # macOS
   open index.html

   # Windows
   start index.html

   # Linux
   xdg-open index.html
   ```

No build tools, frameworks, or dependencies required.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure |
| **CSS3** | Styling, animations, responsive layout (Grid/Flexbox) |
| **Vanilla JavaScript** | DOM manipulation, validation, localStorage, modals |
| **Google Fonts** | Playfair Display + DM Sans typography |

---

## 📐 Responsive Breakpoints

| Screen | Breakpoint | Layout |
|---|---|---|
| Desktop | ≥ 1025px | Two-column grid (form + table side by side, equal height) |
| Tablet | 641px – 1024px | Single-column stacked layout |
| Mobile | ≤ 640px | Single-column, compact padding, full-width inputs |

---

## 🔐 Validation Rules

| Field | Rule |
|---|---|
| Student Name | Letters and spaces only, minimum 2 characters |
| Student ID | Digits only, must be unique |
| Email ID | Standard email format (`name@domain.tld`) |
| Contact Number | Digits only, minimum 10 digits |

---

## 📌 GitHub Commit Guide

For full marks, make **separate commits** for each file type:

```bash
git add index.html
git commit -m "Add: HTML structure and layout"

git add style.css
git commit -m "Add: CSS styling and responsive design"

git add script.js
git commit -m "Add: JavaScript DOM manipulation and validation"

git add README.md
git commit -m "Add: Project documentation and README"
```

---


## 📄 License

This project is submitted as part of an academic assignment for Internshala Trainings.
