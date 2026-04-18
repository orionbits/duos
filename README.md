# German Workbook - Complete Documentation

## 📋 Overview

This is a **Next.js-based interactive digital workbook** for learning German. It converts German textbook PDFs into structured JSON format and provides an engaging web interface for students to study lessons, track vocabulary, complete exercises, and monitor their progress.

### Key Features
- 📚 **Textbook Conversion** - Convert German PDF textbooks to structured JSON
- 🎯 **Interactive Exercises** - Fill-blanks, multiple choice, true/false questions
- 📝 **Vocabulary Tracking** - Mark words as known/unfamiliar
- 📊 **Progress Dashboard** - Track lesson completion and vocabulary mastery
- 💾 **Offline Support** - PWA with service worker for offline learning
- 📤 **Data Portability** - Export/import user progress
- 🔊 **Text-to-Speech** - Pronunciation help for German words

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with localStorage persistence)
- **PDF Processing**: PyPDF2, pdfminer.six
- **PWA**: Service Worker, Web App Manifest

### Project Structure
```
project/
├── app/                          # Next.js app router pages
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Homepage with textbook list
│   ├── textbook/[textbookId]/
│   │   └── page.tsx            # Textbook lesson listing
│   └── lesson/[textbookId]/[lessonId]/
│       └── page.tsx            # Individual lesson viewer
├── components/                   # React components
│   ├── Navigation.tsx           # Top navigation bar
│   ├── VocabularyBlock.tsx      # Vocabulary display & tracking
│   ├── ExerciseBlock.tsx        # Interactive exercises
│   ├── DialogueBlock.tsx        # Dialogue viewer with audio
│   └── GrammarBlock.tsx         # Grammar rule display
├── hooks/
│   └── useTextbook.ts           # Textbook data fetching hook
├── store/
│   └── progressStore.ts         # Zustand store for user progress
├── types/
│   └── textbook.ts              # TypeScript type definitions
├── public/
│   ├── sw.js                    # Service worker for offline
│   ├── manifest.json            # PWA manifest
│   └── textbooks/               # Converted JSON textbooks
└── conv.py                      # PDF to JSON converter script
```

---

## 🔄 How It Works

### 1. Textbook Conversion (`conv.py`)

The Python script converts German textbook PDFs into structured JSON:

```bash
python conv.py path/to/textbook.pdf --output ./public/textbooks
```

**Conversion Process:**
1. **Extract Text** - Uses PyPDF2/pdfminer to extract text from PDF
2. **Clean Text** - Removes artifacts, fixes OCR issues, normalizes whitespace
3. **Detect Content** - Identifies lessons, vocabulary, grammar, dialogues, exercises
4. **Parse Blocks** - Converts raw text into structured content blocks
5. **Generate JSON** - Outputs standardized JSON for web app consumption

**Output Structure:**
```json
{
  "metadata": {
    "id": "netzwerk_a1",
    "name": "Netzwerk neu A1",
    "cefr_level": "A1",
    "total_lessons": 12
  },
  "lessons": [
    {
      "id": "lesson_1",
      "title": "Guten Tag!",
      "blocks": [...]
    }
  ]
}
```

### 2. Data Flow

```
PDF → conv.py → JSON → Next.js API/Public → Components → User
                                    ↓
                            Zustand Store (Progress)
                                    ↓
                              localStorage (Persistence)
```

### 3. Progress Tracking System

The `progressStore.ts` manages all user data using Zustand:

**Stored Data:**
- Which lessons are completed
- Which vocabulary words are known
- Exercise attempts and scores
- Last access timestamps

**Key Functions:**
- `markBlockComplete()` - Mark a lesson block as done
- `markVocabularyKnown()` - Track vocabulary mastery
- `saveExerciseAttempt()` - Record exercise answers
- `exportProgress()` / `importProgress()` - Data portability

**Persistence:**
- Data saved to `localStorage` automatically
- Survives page refreshes and browser restarts
- Can be exported/imported as JSON

### 4. Component Architecture

#### Textbook Page (`/textbook/[id]`)
- Lists all lessons in a textbook
- Shows progress percentage per lesson
- Navigates to individual lessons

#### Lesson Page (`/lesson/[id]/[lessonId]`)
- Sequential block-by-block navigation
- Progress bar shows lesson completion
- Renders different block types:

| Block Type | Component | Functionality |
|------------|-----------|---------------|
| vocabulary | `VocabularyBlock` | Display words, reveal meanings, mark known |
| exercise | `ExerciseBlock` | Interactive questions with immediate feedback |
| dialogue | `DialogueBlock` | Show conversations with translations |
| grammar | `GrammarBlock` | Display grammar rules with examples |
| reading | Generic | Text with optional glossary |
| listening | Generic | Transcript with comprehension questions |

#### Exercise Types Supported
- **Fill in the blank** - Text input with case-insensitive matching
- **Multiple choice** - Radio button selection
- **True/False** - Binary choice
- **Open-ended** - No auto-grading (for written responses)

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ 
- Python 3.8+ (for PDF conversion)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone <your-repo>
cd german-workbook

# 2. Install frontend dependencies
npm install

# 3. Install Python dependencies (for PDF conversion)
pip install PyPDF2 pdfminer.six

# 4. Create directories
mkdir -p public/textbooks public/media

# 5. Run the development server
npm run dev
```

### Converting a Textbook

```bash
# Convert PDF to JSON
python conv.py "path/to/your/textbook.pdf" --output ./public

# Output will be in: public/textbooks/[textbook-id].json
# Manifest updated: public/manifest.json
```

### Building for Production

```bash
# Build the Next.js app
npm run build

# Start production server
npm start
```

---

## 📱 PWA Features

The app works offline once installed:

1. **Service Worker** (`public/sw.js`) caches:
   - Core HTML/CSS/JS
   - Textbook JSON files
   - Manifest and icons

2. **Installation**:
   - Chrome: Click the install icon in address bar
   - Safari: Share menu → Add to Home Screen
   - Works as standalone app

3. **Offline Capabilities**:
   - View previously accessed lessons
   - Complete exercises (syncs when online)
   - Track vocabulary progress

---

## 🔧 Configuration

### Adding a New Textbook

1. Convert PDF using `conv.py`
2. Copy JSON to `public/textbooks/`
3. Update `public/manifest.json`:
```json
{
  "textbooks": [
    {
      "id": "your_textbook_id",
      "name": "Textbook Name",
      "cefr_level": "A1"
    }
  ]
}
```

### Customizing Exercise Scoring

Edit `ExerciseBlock.tsx` to modify:
- Answer matching logic (case sensitivity, trimming)
- Passing thresholds
- Hint display behavior

### Changing Vocabulary Gender Colors

In `VocabularyBlock.tsx`, modify `getGenderColor()`:
```typescript
case 'der': return 'text-blue-600 bg-blue-50'
case 'die': return 'text-pink-600 bg-pink-50'
case 'das': return 'text-green-600 bg-green-50'
```

---

## 📊 State Management Details

### Zustand Store Structure

```typescript
interface UserProgress {
  version: number;           // For migrations
  lastUpdated: number;       // Timestamp
  textbooks: {
    [textbookId]: {
      lessons: {
        [lessonId]: {
          blocks: {
            [blockId]: {
              completed: boolean;
              lastViewed: number;
              exerciseAttempts?: Record<string, ExerciseAttempt>;
            }
          };
          completed: boolean;
          lastAccessed: number;
        };
      };
      vocabulary: {
        [wordId]: {
          known: boolean;
          reviewedAt?: number;
          timesReviewed: number;
        };
      };
    };
  };
}
```

### Persistence Middleware
- Auto-saves to localStorage after each state change
- Data key: `german-workbook-progress`
- Version 1.0.0

---

## 🎨 UI Components

### Navigation
- Sticky header with Home and Vocabulary links
- Active route highlighting
- Responsive mobile design

### Progress Dashboard (Homepage)
- Overall completion percentage
- Vocabulary known/total counter
- Export/Import/Clear buttons
- Textbook grid with CEFR level badges

### Lesson Player
- Sequential content blocks
- Previous/Next navigation
- Progress bar at top
- Back to textbook link

---

## 🔌 API & Data Flow

### No Backend Required!
- All textbook data served as static JSON from `public/textbooks/`
- User progress stored entirely in browser localStorage
- No authentication needed - works completely offline

### Data Loading
```typescript
// useTextbook hook fetches from public directory
fetch(`/textbooks/${textbookId}.json`)
```

### Progress Export Format
```json
{
  "version": 1,
  "lastUpdated": 1234567890,
  "textbooks": { ... }
}
```

---

## 🐛 Troubleshooting

### PDF Extraction Issues
- **Problem**: Garbled text or missing content
- **Solution**: Try different PDF extraction library or pre-process PDF

### Textbook Not Loading
- **Problem**: 404 error for textbook JSON
- **Solution**: Ensure file exists at `public/textbooks/[id].json`

### Progress Not Saving
- **Problem**: Progress resets on refresh
- **Solution**: Check browser localStorage permissions

### Speech Synthesis Not Working
- **Problem**: Audio playback fails
- **Solution**: Some browsers require user interaction first

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Anki-style spaced repetition for vocabulary
- [ ] Grammar exercise generator with AI
- [ ] Progress sync across devices (optional backend)
- [ ] Pronunciation recording & feedback
- [ ] Gamification (streaks, achievements)
- [ ] Dark mode
- [ ] More exercise types (drag-drop, sorting)
- [ ] Audio file integration (real recordings)

### Scalability Options
- Add backend API for multi-user support
- Use IndexedDB for larger datasets
- Implement CDN for textbook files
- Add teacher dashboard for class tracking

---

## 📄 License

This project is for educational purposes. Textbook content remains property of respective publishers.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📞 Support

For issues:
1. Check browser console for errors
2. Verify textbook JSON is valid
3. Clear localStorage and reload
4. Open GitHub issue with detailed description

---

## 🎯 Quick Start Commands

```bash
# Development
npm run dev                 # Start Next.js dev server
python conv.py sample.pdf   # Convert a PDF textbook

# Production
npm run build              # Build for production
npm start                  # Start production server

# Utilities
npm run lint              # Run ESLint
npm run type-check        # Run TypeScript compiler
```

---

## 📁 File Naming Conventions

- **Textbook IDs**: `{name}_{level}` (e.g., `netzwerk_a1`)
- **Lesson IDs**: `lesson_{number}` or extracted from title
- **Block IDs**: `{textbook_id}_p{page}_b{block_number}`
- **Vocabulary IDs**: Generated from German word (lowercase, underscores)

---
