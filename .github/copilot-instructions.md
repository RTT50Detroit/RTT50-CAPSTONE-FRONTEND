# Copilot Instructions

## UI Text Casing

Always use Title Case for user-facing UI text, and check it whenever you add or change UI:

- Headings (`h1`–`h6`), eyebrows, card titles, and stat labels
- Buttons, nav links, and call-to-action links
- Form field labels, `<option>` labels, and tooltips (`title`, `aria-label`)
- Status labels such as "Online Now" and "Early Access"

Title Case rules:

- Capitalize the first and last word, and every word of four or more letters.
- Lowercase short articles, conjunctions, and prepositions (a, an, the, and, but, or, for, to, of, in, on, at, by, as) unless first or last.
- Hyphenated terms capitalize each part (for example, "Short-Form Posts").

Keep sentence case for full-sentence body copy, descriptions, placeholders, and messages (for example, "No profiles found yet.").

## Page Settings Controls

When adding a page settings control, place it in the page header's top-right corner. Use the established video-game HUD styling: a transparent or translucent background with gold accents and a gear icon. The control toggles its settings menu; clicking outside the menu or toggling the control again closes it, and Escape dismisses it. Render the menu as an overlay so opening it does not shift surrounding page layout. Keep the control accessible with an accurate `aria-expanded` state, an accessible name, and keyboard focus behavior.
