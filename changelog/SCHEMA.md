# Subbi Clothes — Changelog Data Schema

`data.json` in this folder is plain, strict JSON — no comments, parseable by any standard
JSON parser (`JSON.parse()`, `fetch().then(r => r.json())`, etc.). This file documents its
schema separately, since JSON itself has no comment syntax.

## Field reference

- **`version`** (string) — Display name shown in the timeline header. Examples: `"DEV-2.0"`,
  `"Subbi Clothes 3.3D"`.
- **`date`** (string) — Release date. Supported formats:
  - `"YYYY-MM-DD"` — full ISO-8601 date (preferred)
  - `"YYYY-MM"` — month precision only
  - `"YYYY"` — year precision only
  - `"Work in progress"` — pinned to the top of the timeline
  - `"—"` — unknown/TBD, sorted to the bottom
- **`type`** (string) — Release channel. Controls the colour pill in the UI. Allowed values:
  - `"stable"` — production release
  - `"dev"` — development/nightly build
  - `"beta"` — public beta/RC (excluded from the "Releases" filter)
  - `"legacy-stable"` — archived Stable entry; counts as Stable in filters
  - `"legacy-dev"` — archived DEV entry; counts as DEV in filters

  Legacy types render with reduced opacity/saturation.
- **`version_type`** (string) — Structural importance of the entry. Allowed values:
  - `"major"` — full release, rendered full-size in the timeline
  - `"middle"` — moderate update, rendered slightly smaller
  - `"minor"` — small patch, nested inside the parent's "Patch history" drawer (`sub_versions`)
  - `"hotfix"` — urgent bugfix, same nested rendering as minor

  `"minor"` and `"hotfix"` entries should live inside the `sub_versions` array of their
  nearest major/middle parent, not at the top level.
- **`badge`** (string) — Short label shown on the version chip. Examples: `"DEV · SC4"`,
  `"SC 3.0"`.
- **`summary`** (string) — One-paragraph description of the release shown below the version
  header.
- **`new`**, **`changed`**, **`fixed`**, **`bugs`** (array) — Lists of new features, changed
  behaviours, bug fixes, and known remaining bugs, respectively.
- **`hud`** (array) — HUD-specific changes (rendered in purple).
- **`sub_versions`** (array, optional) — Nested minor/hotfix entries belonging to this
  release. Each item uses the same field schema (`version`, `date`, `version_type`,
  `summary`, `new`, `changed`, `fixed`, `bugs`, `hud`). Stats from `sub_versions` are summed
  cumulatively into the parent's totals display. Example:
  ```json
  "sub_versions": [
    {
      "version": "3.0a",
      "date": "2025-01-15",
      "version_type": "hotfix",
      "summary": "Hotfix for startup crash.",
      "fixed": ["Fixed crash on startup."]
    },
    {
      "version": "3.0b",
      "date": "2025-02-01",
      "version_type": "minor",
      "summary": "Minor QoL improvements.",
      "changed": ["Improved menu responsiveness."],
      "fixed": ["Fixed particle colour reset."]
    }
  ]
  ```

## Markup mini-language

Applies to all list items (`new`/`changed`/`fixed`/`bugs`/`hud`) and `summary`.

**Inline formatting:**
- `**text**` — Bold
- `_text_` — Italic
- `~~text~~` — Strikethrough
- `||text||` — Spoiler (blurred, revealed on hover/click)
- `` ``code`` `` — Inline monospace code

**Status tags** — can appear anywhere in the string:
- `[fixed:X]` — "Fixed in vX" badge (green)
- `[replaced:X]` — "Replaced in vX" badge (orange)
- `[wip]` — Work In Progress badge (yellow)
- `[breaking]` — Breaking Change badge (red)
- `[note:text]` — Inline callout note (muted)

**Leading-tag behaviour**: when a status tag (`[wip]`, `[breaking]`, `[replaced:X]`,
`[fixed:X]`) appears at the very start of an item string — before any other visible text —
the renderer collapses it to a compact icon-only pill and right-aligns the rest of the
content. This keeps list items visually aligned even when only some carry a status badge and
others don't. Example: `"[replaced:DEV-4.0] Introduced a **Tags System**..."`

## Sub-list syntax

Any list item whose text begins with `"- "` (hyphen + space) is rendered as an indented
sub-bullet under the preceding sibling item. Sub-items must be plain JSON strings in the same
array as their parent. Example:
```json
"changed": [
  "Command system now flexible, accepting multiple formats:",
    "- on/off, 1/0, true/false, yes/no",
    "- Unknown command warnings",
    "- Remote access controls"
]
```
