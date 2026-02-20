# Prophet Stories Video Strategy

## Current State
- **Existing:** `src/content/prophets-data.ts` - 25 prophets with summaries, sections, lessons
- **New Content:** `stories-of-the-prophets-menk/` folder - 28 markdown files with full transcripts + YouTube URLs

## Proposed Strategy

### Option 1: External Links (Recommended)
**Approach:** Provide YouTube links that open in a new tab or embedded iframe

**Pros:**
- No hosting costs
- No bandwidth usage
- YouTube handles streaming quality, CDN, caching
- Works offline if user has YouTube Premium
- Simple to implement

**Cons:**
- Users leave the app
- Requires internet connection
- YouTube ads (unless Premium)

### Option 2: Embedded YouTube Player
**Approach:** Embed YouTube iframe directly in the page

**Pros:**
- Users stay in the app
- YouTube still handles streaming
- Can show video alongside transcript

**Cons:**
- More complex UI
- Still requires internet
- iframe can be slow on mobile

### Recommendation: Option 1 (External Links with a nice UI)

## Implementation Plan

### Step 1: Parse the Markdown Files
Create a script to extract:
- Frontmatter (YouTube URL, author, episode info)
- Full transcript content

### Step 2: Extend the Data Model
Add to `ProphetStory` interface:
```typescript
interface VideoContent {
  url: string
  author: string
  series: string
  episode: number
  topic: string
  channel: string
}

interface ProphetStory {
  // ... existing fields
  video?: VideoContent
  fullTranscript?: string  // Optional full Menk transcript
}
```

### Step 3: Create a Parser Script
Build a Node.js script to:
1. Read each markdown file
2. Parse YAML frontmatter
3. Extract transcript body
4. Generate TypeScript data file

### Step 4: Update ProphetStoriesPage
- Add "Watch Video" / "Read Full Transcript" tabs
- Link to YouTube with nice button styling
- Show transcript inline (collapsible or separate tab)

### Step 5: Matching Strategy
Map the 28 transcript files to the 25 prophets:

| Transcript File | Prophet |
|----------------|---------|
| 01-introduction | (General - skip or add as intro) |
| 02-creation-of-aadam | Adam |
| 03-aadam-on-earth-p1 | Adam |
| 04-aadam-on-earth-p2 | Adam |
| 05-sheeth | (Add Sheeth as new prophet) |
| 06-idrees | Idris |
| 07-nuh | Nuh |
| 08-hud | Hud |
| 09-saalih | Salih |
| 10-ibraheem-p1 | Ibrahim |
| 11-ibraheem-p2 | Ibrahim |
| 12-ibraheem-ismail-p3 | Ibrahim/Ismail |
| 13-ibraheem-p4 | Ibrahim |
| 15-yaqub-yusuf-p1 | Yaqub/Yusuf |
| 16-yusuf-p2 | Yusuf |
| 17-yusuf-p3 | Yusuf |
| 18-ayoub-yunus | Ayyub/Yunus |
| 19-musa-haroon-p1 | Musa/Harun |
| 20-musa-haroon-p2 | Musa/Harun |
| 21-musa-haroon-p3 | Musa/Harun |
| 22-musa-bani-israeel-p1 | Musa |
| 23-musa-bani-israeel-p2 | Musa |
| 24-shu-ayb | Shuayb |
| 25-musa-uzair-hizqeel-yushua-dawud-p1 | Multiple |
| 26-dawud-p2 | Dawud |
| 27-sulayman-p1 | Sulayman |
| 28-sulayman-p2-ilyaas-dhul-kifl-zakariyyah-yahya | Multiple |

Note: Some files cover multiple prophets - will need to either:
- Split content
- Link same video to multiple prophets
- Create separate "series" view

## UI Design

### Prophet Detail Page Structure:
```
┌─────────────────────────────────────┐
│ ← Back                              │
│ Prophet Name (Arabic)               │
│ Title                               │
├─────────────────────────────────────┤
│ [Summary] [Full Story] [Video] ← Tabs│
├─────────────────────────────────────┤
│                                     │
│  Content Area:                      │
│  - Summary tab: Current content     │
│  - Full Story: Menk transcript      │
│  - Video: YouTube link/player       │
│                                     │
├─────────────────────────────────────┤
│ ▶ Watch on YouTube                  │
│   Stories of the Prophets - Ep 2    │
│   Mufti Ismail Menk                 │
├─────────────────────────────────────┤
│ Mentioned in Surahs                 │
│ [Surah badges...]                   │
├─────────────────────────────────────┤
│ Lesson for Ramadan                  │
└─────────────────────────────────────┘
```

## Implementation Priority
1. Create markdown parser script
2. Match transcripts to existing prophets
3. Add video URLs to existing data
4. Update UI with tabs
5. Add "Watch Video" button/link

## Files to Create/Modify
- `scripts/parse-menk-stories.ts` - Parser script
- `src/content/prophets-data.ts` - Add video/transcript fields
- `src/pages/ProphetStoriesPage.tsx` - Add tabs and video UI
- `src/components/VideoLink.tsx` - Reusable video link component
