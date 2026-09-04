'use client'

import { useState } from 'react'
import { ResourcePage } from '@/components/admin/resource'
import { Tabs } from '@/components/admin/kit'
import { NewsManager } from '@/components/admin/NewsManager'

export default function CmsPage() {
  const [tab, setTab] = useState('news')
  const tabs = [
    { id: 'news', label: 'Yangilik' },
    { id: 'gallery', label: 'Galereya' },
    { id: 'partners', label: 'Hamkor' },
    { id: 'staff', label: 'Jamoa' },
    { id: 'pages', label: 'Sahifa' },
  ]

  return (
    <>
      <Tabs items={tabs} value={tab} onChange={setTab} />
      {tab === 'news' && <NewsManager />}
      {tab === 'gallery' && (
        <ResourcePage
          kicker="Kontent"
          title="Galereya"
          path="/api/v1/ops/gallery"
          columns={[
            { key: 'c', label: 'Izoh' },
            { key: 'p', label: 'Joy' },
            { key: 'o', label: 'Tartib' },
          ]}
          fields={[
            { key: 'caption_uz', label: 'Izoh' },
            { key: 'slug', label: 'Slug' },
            { key: 'image', label: 'Rasm', type: 'file' },
            {
              key: 'placement',
              label: 'Joy',
              type: 'select',
              options: [
                { value: '', label: 'Faqat galereya' },
                { value: 'about', label: 'About' },
                { value: 'demo', label: 'Demo Day' },
                { value: 'apply', label: 'Ariza' },
                { value: 'og', label: 'OG' },
              ],
            },
            { key: 'order', label: 'Tartib', type: 'number' },
            { key: 'show_in_gallery', label: 'Galereyada', type: 'bool' },
            { key: 'is_published', label: 'Nashr', type: 'bool' },
          ]}
          toRow={(r: { caption_uz: string; placement: string; order: number }) => ({
            c: r.caption_uz || '—',
            p: r.placement || '—',
            o: r.order,
          })}
        />
      )}
      {tab === 'partners' && (
        <ResourcePage
          kicker="Kontent"
          title="Hamkorlar"
          path="/api/v1/ops/partners"
          columns={[
            { key: 'n', label: 'Nomi' },
            { key: 'u', label: 'URL' },
            { key: 'p', label: 'Nashr' },
          ]}
          fields={[
            { key: 'name', label: 'Nomi', required: true },
            { key: 'slug', label: 'Slug' },
            { key: 'url', label: 'URL', type: 'url' },
            { key: 'logo', label: 'Logo', type: 'file' },
            { key: 'order', label: 'Tartib', type: 'number' },
            { key: 'is_published', label: 'Nashr', type: 'bool' },
          ]}
          toRow={(r: { name: string; url: string; is_published: boolean }) => ({
            n: r.name,
            u: r.url || '—',
            p: r.is_published ? 'ha' : 'yo‘q',
          })}
        />
      )}
      {tab === 'staff' && (
        <ResourcePage
          kicker="Kontent"
          title="Jamoa (sayt)"
          path="/api/v1/ops/staff-members"
          columns={[
            { key: 'n', label: 'Ism' },
            { key: 't', label: 'Lavozim' },
            { key: 'p', label: 'Nashr' },
          ]}
          fields={[
            { key: 'name', label: 'Ism', required: true },
            { key: 'title_uz', label: 'Lavozim' },
            { key: 'slug', label: 'Slug' },
            { key: 'linkedin', label: 'LinkedIn', type: 'url' },
            { key: 'photo', label: 'Foto', type: 'file' },
            { key: 'order', label: 'Tartib', type: 'number' },
            { key: 'is_published', label: 'Nashr', type: 'bool' },
          ]}
          toRow={(r: { name: string; title_uz: string; is_published: boolean }) => ({
            n: r.name,
            t: r.title_uz,
            p: r.is_published ? 'ha' : 'yo‘q',
          })}
        />
      )}
      {tab === 'pages' && (
        <ResourcePage
          kicker="Kontent"
          title="Sahifalar"
          path="/api/v1/ops/pages"
          columns={[
            { key: 't', label: 'Sarlavha' },
            { key: 's', label: 'Slug' },
            { key: 'p', label: 'Nashr' },
          ]}
          fields={[
            { key: 'title_uz', label: 'Sarlavha', required: true },
            { key: 'slug', label: 'Slug' },
            { key: 'body_uz', label: 'Matn', type: 'rich' },
            { key: 'is_published', label: 'Nashr', type: 'bool' },
          ]}
          toRow={(r: { title_uz: string; slug: string; is_published: boolean }) => ({
            t: r.title_uz,
            s: r.slug,
            p: r.is_published ? 'ha' : 'yo‘q',
          })}
        />
      )}
    </>
  )
}
