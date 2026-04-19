## Build Log: Problems & Resolutions

A running log of the snags hit while building the code-editor section and how each was resolved.

### 1. Menu data was hard to extend
**Problem:** All dropdown options lived inline inside a single `Menu` array, so adding languages or topics meant editing the shape rather than a list.
**Resolution:** Split the option lists into named `as const` constants (`Languages`, `Topics`, `Difficulties`) in [app/data/data.ts](app/data/data.ts) and composed `Menu` from them. Same public shape, but the lists are now independently importable and trivial to extend.

### 2. `<code onChange={...}>` never fired
**Problem:** Tried to make a `<code>` element editable by attaching `onChange`. The handler never ran — `onChange` is only for form controls.
**Resolution:** Switched to the **transparent-textarea overlay** pattern: a real `<textarea>` captures input and owns state, while a `<code>` layer underneath renders the display. The textarea has `color: transparent` + `caret-color: white` so only the caret shows through.

### 3. Overlay layers drifted out of alignment
**Problem:** The textarea caret didn't land on the rendered glyph beneath it.
**Resolution:** Enforced identical typography on both layers via a shared `EDITOR_FONT` constant (`font-mono text-sm leading-6 whitespace-pre`) plus identical padding. Any divergence in font/line-height/padding between the layers breaks caret alignment.

### 4. Typed-vs-target diffing logic wasn't working
**Problem:** Attempted to diff typed text against the target but the logic kept producing wrong results.
**Resolution:** Collapsed the problem from "two text layers" into **one rendered target layer, walked per character**. For each index `i`:
- `i >= typed.length` → untyped (dim)
- `typed[i] === target[i]` → correct (white)
- otherwise → wrong (red; red *background* if the target char is whitespace, so mistyped indentation is visible)
Overflow (user typed past target length) is rendered as extra red spans appended after the map.

### 5. Misconception: "overlay effect needs two layers"
**Problem:** Assumption that the typing-test overlay look required a dim target layer *plus* a typed layer stacked on top.
**Resolution:** The overlay illusion is actually **per-character color transitions on a single target render**. The target never moves — individual character spans just flip from dim → white (or red) as the typed index advances. Two stacked text layers would cause a correct-dim glyph and a wrong-red glyph to overlap at the same pixel position.

### 6. Target rendered as `[object Object],[object Object],...`
**Problem:** Wrapped the char map in a template literal: `` {`${target.split(" ").map(...)}`} ``. Two bugs stacked:
1. The template literal coerced the array of JSX elements to a string.
2. `split(" ")` gave words, not characters — making per-character indexing impossible.
**Resolution:** Dropped the template-literal wrapper (JSX renders arrays of elements directly) and switched to `split("")` / `Array.from(target)` so each span holds exactly one character, including spaces and newlines. With `whitespace-pre` on the parent, indentation and line breaks preserve themselves with no special cases.

### 7. Caret doesn't drop to the next line on indentation
**Problem:** When the target contained `\n` and indentation, the textarea's native caret kept advancing horizontally on one long line instead of wrapping — because the user's typed string had no newline in it yet.
**Resolution:** Hid the textarea's native caret (`caret-transparent`) and rendered a **fake caret** as a styled span in the target layer at index `code.length`. Since the fake caret lives *inside* the rendered target, it automatically lands on the correct line, column, and character. The textarea became a pure input-capture element; all visuals come from the target render.

### 8. Auto-indent initially swallowed inline spaces
**Problem:** First pass at auto-indent broadly "skipped all whitespace" in both directions — which also consumed the single spaces between words (e.g., `let i = 0`), so the user couldn't type spaces at all.
**Resolution:** Narrowed the predicate to `isIndent = ch === " " || ch === "\t"` (not `\n`) and gated forward skipping on *"the last typed char is `\n`"*. Inline spaces within a line are now typed normally; only the leading whitespace run immediately after a newline is auto-filled.

### 9. Indent fired before the user pressed Enter
**Problem:** Auto-indent kicked in as soon as the caret reached end-of-line, so hitting Enter felt redundant — the line break "already happened." Lost the coding-muscle-memory feel.
**Resolution:** Required the user's own `\n` before the indent loop runs. `skipIndentForward` bails unless `out[out.length - 1] === "\n"`. Now Enter lands the newline *and* the leading indent spaces in one step, while Backspace peels the indent back to just after the `\n` (a second Backspace deletes the `\n` itself).

### 10. First Enter didn't indent; second Enter over-indented
**Problem:** After typing a closing bracket and hitting Enter, nothing happened. Hitting Enter again jumped two lines down with an indent. Looked like a logic bug in the helpers.
**Resolution:** Root cause was **length drift**, not logic: the indent helpers index into `PLACEHOLDER` by `code.length`, which assumes typed length equals target position. If the user skipped or doubled a character earlier (the diff render tolerates wrong chars — they just show red), `code.length` lands one short of the target's `\n`. First Enter then puts the typed `\n` at the target's `\n` position — `PLACEHOLDER[out.length]` is `\n` (not whitespace), so the indent loop doesn't fire. Second Enter advances past the target's `\n`, hits the leading space, and fills indent — but now the user has two `\n`s in their typed text. Diagnosis path: render `code.length` and `PLACEHOLDER[code.length]` as a debug readout and watch it at the moment Enter is pressed.

---

Built with ❤️ using React Router.
