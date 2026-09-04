'use client'

import { useEffect, useRef, useState } from 'react'
import { adminApi } from '@/lib/admin-api'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function cmd(name: string, arg?: string) {
  document.execCommand(name, false, arg)
}

function ytId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/)
  return m?.[1] || ''
}

export function RichEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const vidRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (document.activeElement === el) return
    if (el.innerHTML !== (value || '')) el.innerHTML = value || ''
  }, [value])

  function emit() {
    onChange(ref.current?.innerHTML || '')
  }

  function run(name: string, arg?: string) {
    ref.current?.focus()
    cmd(name, arg)
    emit()
  }

  function insert(html: string) {
    ref.current?.focus()
    cmd('insertHTML', html)
    emit()
  }

  function link() {
    const url = window.prompt('Havola (https://...)')
    if (url) run('createLink', url)
  }

  function videoUrl() {
    const url = window.prompt('YouTube havolasi')
    if (!url) return
    const id = ytId(url)
    if (!id) {
      window.alert('YouTube havolasi tanilmadi')
      return
    }
    insert(
      `<p><iframe src="https://www.youtube.com/embed/${id}" width="560" height="315" title="YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>`,
    )
  }

  async function upload(file: File, kind: 'image' | 'file' | 'video') {
    const fd = new FormData()
    fd.append('file', file)
    setBusy(kind)
    try {
      const d = await adminApi<{ url: string; name: string; kind: string }>('/api/v1/ops/uploads', {
        method: 'POST',
        body: fd,
      })
      if (kind === 'image' || d.kind === 'image') {
        insert(`<p><img src="${d.url}" alt="${d.name}" /></p>`)
      } else if (kind === 'video' || d.kind === 'media') {
        const tag = d.url.match(/\.(mp3|wav|ogg)(\?|$)/i)
          ? `<p><audio src="${d.url}" controls></audio></p>`
          : `<p><video src="${d.url}" controls width="560"></video></p>`
        insert(tag)
      } else {
        insert(`<p class="fa-attach"><a href="${d.url}" download="${d.name}">${d.name}</a></p>`)
      }
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Yuklanmadi')
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="fa-editor">
      <div className="fa-editor-bar">
        <button type="button" title="Qalin" onMouseDown={(e) => e.preventDefault()} onClick={() => run('bold')}>
          B
        </button>
        <button type="button" title="Kursiv" onMouseDown={(e) => e.preventDefault()} onClick={() => run('italic')}>
          I
        </button>
        <button type="button" title="Tagchiziq" onMouseDown={(e) => e.preventDefault()} onClick={() => run('underline')}>
          U
        </button>
        <button type="button" title="O‘chirish" onMouseDown={(e) => e.preventDefault()} onClick={() => run('strikeThrough')}>
          S
        </button>
        <span />
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('formatBlock', 'H2')}>
          H2
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('formatBlock', 'H3')}>
          H3
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('formatBlock', 'P')}>
          P
        </button>
        <span />
        <button type="button" title="Chap" onMouseDown={(e) => e.preventDefault()} onClick={() => run('justifyLeft')}>
          Chap
        </button>
        <button type="button" title="Markaz" onMouseDown={(e) => e.preventDefault()} onClick={() => run('justifyCenter')}>
          Markaz
        </button>
        <button type="button" title="O‘ng" onMouseDown={(e) => e.preventDefault()} onClick={() => run('justifyRight')}>
          O‘ng
        </button>
        <span />
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('insertUnorderedList')}>
          • List
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('insertOrderedList')}>
          1.
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('formatBlock', 'BLOCKQUOTE')}>
          “
        </button>
        <button
          type="button"
          title="Jadval"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            insert(
              '<table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td>—</td><td>—</td></tr><tr><td>—</td><td>—</td></tr></tbody></table><p></p>',
            )
          }
        >
          Jadval
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('insertHorizontalRule')}>
          —
        </button>
        <span />
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={link}>
          Havola
        </button>
        <button type="button" disabled={!!busy} onMouseDown={(e) => e.preventDefault()} onClick={() => imgRef.current?.click()}>
          {busy === 'image' ? '…' : 'Rasm'}
        </button>
        <button type="button" disabled={!!busy} onMouseDown={(e) => e.preventDefault()} onClick={() => vidRef.current?.click()}>
          {busy === 'video' ? '…' : 'Video fayl'}
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={videoUrl}>
          YouTube
        </button>
        <button type="button" disabled={!!busy} onMouseDown={(e) => e.preventDefault()} onClick={() => fileRef.current?.click()}>
          {busy === 'file' ? '…' : 'Fayl'}
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('undo')}>
          Ortga
        </button>
        <input ref={imgRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload(f, 'image') }} />
        <input ref={vidRef} type="file" accept="video/*,audio/*" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload(f, 'video') }} />
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload(f, 'file') }} />
      </div>
      <div
        ref={ref}
        className="fa-editor-area"
        contentEditable
        data-placeholder={placeholder || 'Matn, rasm, video yoki fayl qo‘shing…'}
        onInput={emit}
        onBlur={emit}
        suppressContentEditableWarning
      />
    </div>
  )
}
