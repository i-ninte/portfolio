'use client'

import { useEffect, useRef, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface BlogContentProps {
  content: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 px-3 py-1.5 rounded-md bg-dark-tertiary hover:bg-dark-border text-gray-400 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
    >
      {copied ? (
        <>
          <i className="fas fa-check text-green-400" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <i className="fas fa-copy" />
          <span>Copy</span>
        </>
      )}
    </button>
  )
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-dark-border">
      <div className="flex items-center justify-between px-4 py-2 bg-dark-tertiary border-b border-dark-border">
        <span className="text-xs text-gray-500 font-mono">{language || 'code'}</span>
        <CopyButton text={code} />
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem 1.5rem',
          background: '#0d0d0d',
          fontSize: '0.875rem',
          lineHeight: '1.7',
        }}
        showLineNumbers={code.split('\n').length > 3}
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          color: '#4a4a4a',
          userSelect: 'none',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [processedContent, setProcessedContent] = useState<React.ReactNode[]>([])

  useEffect(() => {
    if (!content) return

    // Parse HTML and extract code blocks for special rendering
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const elements: React.ReactNode[] = []
    let key = 0

    const processNode = (node: Node): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement
        const tagName = el.tagName.toLowerCase()

        // Handle code blocks
        if (tagName === 'pre') {
          const codeEl = el.querySelector('code')
          const code = codeEl?.textContent || el.textContent || ''
          const className = codeEl?.className || ''
          const langMatch = className.match(/language-(\w+)/)
          const language = langMatch ? langMatch[1] : detectLanguage(code)
          return <CodeBlock key={key++} code={code.trim()} language={language} />
        }

        // Handle inline code
        if (tagName === 'code' && el.parentElement?.tagName.toLowerCase() !== 'pre') {
          return (
            <code key={key++} className="px-1.5 py-0.5 rounded bg-dark-tertiary text-accent font-mono text-sm border border-dark-border">
              {el.textContent}
            </code>
          )
        }

        // Handle headings
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
          const HeadingTag = tagName as keyof JSX.IntrinsicElements
          const headingClasses: Record<string, string> = {
            h1: 'text-3xl font-bold mt-10 mb-4 text-white',
            h2: 'text-2xl font-bold mt-8 mb-4 text-white border-b border-dark-border pb-2',
            h3: 'text-xl font-semibold mt-6 mb-3 text-white',
            h4: 'text-lg font-semibold mt-5 mb-2 text-gray-200',
            h5: 'text-base font-semibold mt-4 mb-2 text-gray-300',
            h6: 'text-sm font-semibold mt-4 mb-2 text-gray-400',
          }
          return (
            <HeadingTag key={key++} className={headingClasses[tagName]}>
              {Array.from(el.childNodes).map(processNode)}
            </HeadingTag>
          )
        }

        // Handle paragraphs
        if (tagName === 'p') {
          return (
            <p key={key++} className="my-4 text-gray-300 leading-relaxed">
              {Array.from(el.childNodes).map(processNode)}
            </p>
          )
        }

        // Handle lists
        if (tagName === 'ul') {
          return (
            <ul key={key++} className="my-4 ml-6 space-y-2 list-disc list-outside text-gray-300">
              {Array.from(el.childNodes).map(processNode)}
            </ul>
          )
        }
        if (tagName === 'ol') {
          return (
            <ol key={key++} className="my-4 ml-6 space-y-2 list-decimal list-outside text-gray-300">
              {Array.from(el.childNodes).map(processNode)}
            </ol>
          )
        }
        if (tagName === 'li') {
          return (
            <li key={key++} className="pl-2">
              {Array.from(el.childNodes).map(processNode)}
            </li>
          )
        }

        // Handle blockquotes
        if (tagName === 'blockquote') {
          return (
            <blockquote key={key++} className="my-6 pl-4 border-l-4 border-accent bg-accent/5 py-3 pr-4 rounded-r-lg text-gray-400 italic">
              {Array.from(el.childNodes).map(processNode)}
            </blockquote>
          )
        }

        // Handle links
        if (tagName === 'a') {
          return (
            <a
              key={key++}
              href={el.getAttribute('href') || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-glow underline underline-offset-2 transition-colors"
            >
              {Array.from(el.childNodes).map(processNode)}
            </a>
          )
        }

        // Handle strong/bold
        if (tagName === 'strong' || tagName === 'b') {
          return (
            <strong key={key++} className="font-semibold text-white">
              {Array.from(el.childNodes).map(processNode)}
            </strong>
          )
        }

        // Handle emphasis/italic
        if (tagName === 'em' || tagName === 'i') {
          return (
            <em key={key++} className="italic text-gray-200">
              {Array.from(el.childNodes).map(processNode)}
            </em>
          )
        }

        // Handle images
        if (tagName === 'img') {
          return (
            <figure key={key++} className="my-6">
              <img
                src={el.getAttribute('src') || ''}
                alt={el.getAttribute('alt') || ''}
                className="rounded-xl max-w-full mx-auto border border-dark-border"
              />
              {el.getAttribute('alt') && (
                <figcaption className="text-center text-sm text-gray-500 mt-2">
                  {el.getAttribute('alt')}
                </figcaption>
              )}
            </figure>
          )
        }

        // Handle horizontal rules
        if (tagName === 'hr') {
          return <hr key={key++} className="my-8 border-dark-border" />
        }

        // Handle tables
        if (tagName === 'table') {
          return (
            <div key={key++} className="my-6 overflow-x-auto rounded-lg border border-dark-border">
              <table className="w-full text-sm">
                {Array.from(el.childNodes).map(processNode)}
              </table>
            </div>
          )
        }
        if (tagName === 'thead') {
          return (
            <thead key={key++} className="bg-dark-tertiary text-gray-300">
              {Array.from(el.childNodes).map(processNode)}
            </thead>
          )
        }
        if (tagName === 'tbody') {
          return (
            <tbody key={key++} className="divide-y divide-dark-border">
              {Array.from(el.childNodes).map(processNode)}
            </tbody>
          )
        }
        if (tagName === 'tr') {
          return (
            <tr key={key++} className="hover:bg-dark-tertiary/50 transition-colors">
              {Array.from(el.childNodes).map(processNode)}
            </tr>
          )
        }
        if (tagName === 'th') {
          return (
            <th key={key++} className="px-4 py-3 text-left font-semibold">
              {Array.from(el.childNodes).map(processNode)}
            </th>
          )
        }
        if (tagName === 'td') {
          return (
            <td key={key++} className="px-4 py-3 text-gray-400">
              {Array.from(el.childNodes).map(processNode)}
            </td>
          )
        }

        // Default: process children
        if (tagName === 'div' || tagName === 'span') {
          return (
            <span key={key++}>
              {Array.from(el.childNodes).map(processNode)}
            </span>
          )
        }

        // Fallback for other elements
        return (
          <span key={key++}>
            {Array.from(el.childNodes).map(processNode)}
          </span>
        )
      }

      return null
    }

    const bodyChildren = Array.from(doc.body.childNodes)
    const processed = bodyChildren.map(processNode).filter(Boolean)
    setProcessedContent(processed)
  }, [content])

  return (
    <article className="blog-content">
      {processedContent}
    </article>
  )
}

// Simple language detection for code blocks without explicit language
function detectLanguage(code: string): string {
  if (code.includes('import ') && code.includes('from ')) return 'python'
  if (code.includes('def ') || code.includes('print(')) return 'python'
  if (code.includes('const ') || code.includes('let ') || code.includes('=>')) return 'javascript'
  if (code.includes('function ') && code.includes('{')) return 'javascript'
  if (code.includes('interface ') || code.includes(': string') || code.includes(': number')) return 'typescript'
  if (code.includes('<?php')) return 'php'
  if (code.includes('#include') || code.includes('int main')) return 'c'
  if (code.includes('public class') || code.includes('private void')) return 'java'
  if (code.includes('fn ') && code.includes('->')) return 'rust'
  if (code.includes('func ') && code.includes('package ')) return 'go'
  if (code.includes('SELECT ') || code.includes('FROM ') || code.includes('WHERE ')) return 'sql'
  if (code.includes('<!DOCTYPE') || code.includes('<html')) return 'html'
  if (code.includes('{') && code.includes(':') && code.includes(';')) return 'css'
  if (code.startsWith('{') || code.startsWith('[')) return 'json'
  if (code.includes('$ ') || code.includes('npm ') || code.includes('pip ')) return 'bash'
  return 'text'
}
