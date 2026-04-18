Convert the provided Markdown textbook content and Answer Key into a structured JSON file.

### SCHEMA RULES:
1. BLOCK-BASED: Content must be an array of "blocks".
2. BLOCK TYPES: 
   - "content": Standard text/titles.
   - "vocabulary": List of words with gender, part_of_speech, and plural.
   - "exercise-cloze": For paragraphs with blanks (use [0], [1] in text).
   - "exercise-list": For numbered questions.
   - "grammar-table": For declension/conjugation tables.
   - "dialogue": For character conversations.

3. DATA INTEGRITY:
   - "correct_answers": ALWAYS an array of strings (e.g., ["Antwort A", "Antwort B"]).
   - "gender": Strictly "der", "die", "das", or null. The "german" word field must NOT include the article.
   - "plural": Include only the plural form (e.g., "die Tische").

### JSON STRUCTURE:
{
  "metadata": { "id": "", "level": "A2", "topic": "" },
  "lessons": [
    {
      "id": "",
      "blocks": [
        {
          "type": "exercise-cloze",
          "content": {
            "instructions": "...",
            "text": "Ich gehe zur [0].",
            "blanks": [
              { "id": 0, "correct_answers": ["Schule"], "hint": "Nomen" }
            ]
          }
        },
        {
          "type": "grammar-table",
          "content": {
            "title": "Präsens",
            "headers": ["ich", "du", "er/sie/es"],
            "rows": [["bin", "bist", "ist"]]
          }
        }
      ]
    }
  ]
}

### MAPPING INSTRUCTIONS:
Search the "Answer Key" file provided. Match the Answer ID (e.g., A13) to the Lesson ID. Ensure the number of answers in the key matches the number of blanks/questions in the block.