#!/usr/bin/env node
/**
 * PNG-кадри анімації щита → WebP.
 *
 *   node scripts/frames-to-webp.mjs            # конвертує й лишає PNG на місці
 *   node scripts/frames-to-webp.mjs --replace  # додатково видаляє вихідні PNG
 *
 * Навіщо: у програванні бере участь 90 кадрів по ~129 КБ — це 10 МБ, які
 * треба завантажити, перш ніж кільце на першому екрані почне рухатись.
 * WebP на тій самій якості дає ≈35 КБ на кадр, тобто близько 3 МБ.
 *
 * Потрібен sharp:  npm i -D sharp
 */

import fs from 'node:fs/promises'
import path from 'node:path'

const FRAMES_DIR = path.join(process.cwd(), 'public', 'animation', 'frames')
const QUALITY = 82
const REPLACE = process.argv.includes('--replace')

const loadSharp = async () => {
  try {
    return (await import('sharp')).default
  } catch {
    console.error('Не знайдено sharp. Встановіть: npm i -D sharp')
    process.exit(1)
  }
}

const main = async () => {
  const sharp = await loadSharp()
  const files = (await fs.readdir(FRAMES_DIR))
    .filter((name) => name.toLowerCase().endsWith('.png'))
    .sort()

  if (files.length === 0) {
    console.error(`У ${FRAMES_DIR} немає PNG`)
    process.exit(1)
  }

  let pngBytes = 0
  let webpBytes = 0

  for (const [index, name] of files.entries()) {
    const from = path.join(FRAMES_DIR, name)
    const to = from.replace(/\.png$/i, '.webp')

    pngBytes += (await fs.stat(from)).size
    await sharp(from).webp({ quality: QUALITY, effort: 6 }).toFile(to)
    webpBytes += (await fs.stat(to)).size

    if (REPLACE) await fs.unlink(from)
    if ((index + 1) % 20 === 0) console.log(`  ${index + 1}/${files.length}`)
  }

  const mb = (bytes) => (bytes / 1048576).toFixed(1)
  console.log(
    `\nГотово: ${files.length} кадрів  ${mb(pngBytes)} МБ → ${mb(webpBytes)} МБ ` +
      `(${Math.round((webpBytes / pngBytes) * 100)}%)`,
  )
  if (!REPLACE) console.log('PNG лишились на місці — приберіть їх після перевірки.')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
