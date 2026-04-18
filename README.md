# Duos | Interactive German Workbook

**Duos** is a Next.js-based educational platform designed to digitalize traditional German language textbooks. It transforms static PDFs into interactive, self-correcting digital workbooks using a multi-stage LLM processing pipeline.

## 🚀 The Pipeline logic
The core of this project is a three-stage transformation process:

1.  **Extraction:** Raw Textbook PDFs are converted into clean, structural Markdown using specialized extraction prompts (`prompt1.md`).
2.  **Answer Alignment:** Answer keys are extracted and normalized into a consistent Markdown format (`prompt1.md`).
3.  **Structuring:** An LLM-orchestrated prompt (`prompt2.md`) merges the content and answers into a typed json file.
4.  **Deployment:** The JSON is served by the Next.js frontend to render interactive Fill-in-the-blank, Multiple Choice, and Vocabulary modules.

## 🛠️ Features
- **Zero-Hustle Answers:** Answers are automatically mapped to exercises; no more flipping to the back of the book.
- **Interactive Exercises:** Self-correcting inputs for German grammar and vocabulary.
- **Structured Learning:** Vocabulary is categorized by gender (der/die/das) and part of speech automatically.
- **Markdown Mid-layer:** Allows for easy auditing of content before it enters the application database.

## 📁 Directory Structure
- `/public/textbooks/`: Stores the final processed JSON files.
- `/prompts/`: Contains the LLM engineering logic.
- `/components/`: React components designed to handle different question types (Matching, Fill-blank, etc).

## 💻 Setup
1. Clone the repo: `git clone https://github.com/orionbits/duos/`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## 🧠 Efficiency Goal
The project aims to reduce the time it takes to "digitize" one chapter from hours of manual entry to minutes of automated AI processing.
