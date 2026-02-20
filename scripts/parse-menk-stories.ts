#!/usr/bin/env tsx
/**
 * Script to parse Stories of the Prophets markdown files
 * and generate TypeScript data with transcripts and video URLs
 */

import * as fs from 'fs'
import * as path from 'path'

interface VideoContent {
  url: string
  author: string
  series: string
  episode: number
  topic: string
  channel: string
  source: string
}

interface MenkStory {
  filename: string
  video: VideoContent
  transcript: string
  title: string
}

// Map filename patterns to prophet IDs
const PROPHET_MAPPINGS: Record<string, string[]> = {
  '01-introduction-to-stories-of-the-prophets-menk': [], // Skip - general intro
  '02-creation-of-aadam-as-menk': ['adam'],
  '03-aadam-as-on-earth-part-1-menk': ['adam'],
  '04-aadam-as-on-earth-part-2-menk': ['adam'],
  '05-sheeth-as-menk': ['sheeth'], // New prophet
  '06-idrees-as-menk': ['idris'],
  '07-nuh-as-menk': ['nuh'],
  '08-hud-as-menk': ['hud'],
  '09-saalih-as-menk': ['salih'],
  '10-ibraheem-as-part-1-menk': ['ibrahim'],
  '11-ibraheem-as-part-2-menk': ['ibrahim'],
  '12-ibraheem-as-and-ismail-as-part-3-menk': ['ibrahim', 'ismail'],
  '13-ibraheem-as-part-4-menk': ['ibrahim'],
  '15-yaqub-as-and-yusuf-as-part-1-menk': ['yaqub', 'yusuf'],
  '16-yusuf-as-part-2-menk': ['yusuf'],
  '17-yusuf-as-part-3-menk': ['yusuf'],
  '18-ayoub-as-and-yunus-as-menk': ['ayyub', 'yunus'],
  '19-musa-as-and-haroon-as-part-1-menk': ['musa', 'harun'],
  '20-musa-as-and-haroon-as-part-2-menk': ['musa', 'harun'],
  '21-musa-as-and-haroon-as-part-3-menk': ['musa', 'harun'],
  '22-musa-as-and-bani-israeel-part-1-menk': ['musa'],
  '23-musa-as-and-bani-israeel-part-2-menk': ['musa'],
  '24-shu-ayb-as-menk': ['shuayb'],
  '25-musa-uzair-hizqeel-yushua-dawud-as-part-1-menk': ['musa', 'dawud'],
  '26-dawud-as-part-2-menk': ['dawud'],
  '27-sulayman-as-part-1-menk': ['sulayman'],
  '28-sulayman-p2-ilyaas-dhul-kifl-zakariyyah-yahya-as-menk': ['sulayman', 'ilyas', 'dhulkifl', 'zakariyya', 'yahya'],
  '29-isa-as-jesus-pbuh-menk': ['isa'],
}

function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  // Normalize line endings to Unix style
  const normalizedContent = content.replace(/\r\n/g, '\n')
  
  const match = normalizedContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    return { frontmatter: {}, body: content }
  }

  const fmLines = match[1].split('\n')
  const frontmatter: Record<string, any> = {}
  
  for (const line of fmLines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    
    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()
    
    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
    
    // Parse arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(v => v.trim().replace(/"/g, ''))
    }
    
    // Parse numbers
    if (/^\d+$/.test(value)) {
      value = parseInt(value, 10)
    }
    
    frontmatter[key] = value
  }
  
  return { frontmatter, body: match[2].trim() }
}

function parseMarkdownFile(filePath: string): MenkStory | null {
  const content = fs.readFileSync(filePath, 'utf-8')
  const { frontmatter, body } = parseFrontmatter(content)
  
  if (!frontmatter.url) {
    console.warn(`No URL found in ${filePath}`)
    return null
  }

  // Extract title from first h1
  const titleMatch = body.match(/^# (.+)$/m)
  const title = titleMatch ? titleMatch[1] : frontmatter.topic || 'Unknown'

  return {
    filename: path.basename(filePath, '.md'),
    video: {
      url: frontmatter.url,
      author: frontmatter.author,
      series: frontmatter.series,
      episode: frontmatter.episode,
      topic: frontmatter.topic,
      channel: frontmatter.channel,
      source: frontmatter.source,
    },
    transcript: body,
    title,
  }
}

function escapeString(str: string): string {
  return str.replace(/'/g, "\\'").replace(/\n/g, '\\n')
}

function generateVideoData(stories: MenkStory[]): string {
  const videosByProphet: Record<string, MenkStory[]> = {}

  for (const story of stories) {
    const prophetIds = PROPHET_MAPPINGS[story.filename] || []
    for (const id of prophetIds) {
      if (!videosByProphet[id]) {
        videosByProphet[id] = []
      }
      videosByProphet[id].push(story)
    }
  }

  // Generate TypeScript code
  let tsCode = `// Auto-generated from Menk's Stories of the Prophets
// Generated: ${new Date().toISOString()}

export interface VideoContent {
  url: string
  author: string
  series: string
  episode: number
  topic: string
  channel: string
  source: string
}

export interface MenkVideoSeries {
  prophetId: string
  videos: VideoContent[]
}

export const MENK_PROPHEY_VIDEOS: Record<string, VideoContent[]> = {
`

  for (const [prophetId, videos] of Object.entries(videosByProphet)) {
    tsCode += `  '${prophetId}': [
`
    for (const video of videos) {
      tsCode += `    {
      url: '${video.video.url}',
      author: '${escapeString(video.video.author)}',
      series: '${escapeString(video.video.series)}',
      episode: ${video.video.episode},
      topic: '${escapeString(video.video.topic)}',
      channel: '${escapeString(video.video.channel)}',
      source: '${video.video.source}',
    },
`
    }
    tsCode += `  ],
`
  }

  tsCode += `}
`

  return tsCode
}

function main() {
  const storiesDir = path.join(process.cwd(), 'stories-of-the-prophets-menk')
  
  if (!fs.existsSync(storiesDir)) {
    console.error(`Directory not found: ${storiesDir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(storiesDir)
    .filter(f => f.endsWith('.md'))
    .sort()

  console.log(`Found ${files.length} markdown files`)

  const stories: MenkStory[] = []
  for (const file of files) {
    const filePath = path.join(storiesDir, file)
    const story = parseMarkdownFile(filePath)
    if (story) {
      stories.push(story)
      console.log(`✓ Parsed: ${file} -> ${story.title}`)
    }
  }

  // Generate and save video data
  const videoData = generateVideoData(stories)
  const outputPath = path.join(process.cwd(), 'src/content/prophets-videos.ts')
  fs.writeFileSync(outputPath, videoData)
  console.log(`\n✓ Generated: ${outputPath}`)

  // Summary
  console.log('\n--- Summary ---')
  const mappedProphets = new Set<string>()
  for (const story of stories) {
    const ids = PROPHET_MAPPINGS[story.filename] || []
    ids.forEach(id => mappedProphets.add(id))
  }
  console.log(`Total stories: ${stories.length}`)
  console.log(`Prophets with videos: ${mappedProphets.size}`)
  console.log(`Prophet IDs: ${Array.from(mappedProphets).join(', ')}`)
}

main()
