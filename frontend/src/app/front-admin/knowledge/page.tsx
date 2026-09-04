'use client'

import { ResourcePage } from '@/components/admin/resource'

export default function KnowledgePage() {
  return (
    <ResourcePage
      kicker="Kontent"
      title="Bilim bazasi"
      lead="Playbook: qanday ariza, 1-hafta vazifa, pitch, xodim SOP."
      path="/api/v1/ops/knowledge"
      columns={[
        { key: 't', label: 'Sarlavha' },
        { key: 'a', label: 'Kimga' },
        { key: 'p', label: 'Nashr' },
      ]}
      fields={[
        { key: 'title_uz', label: 'Sarlavha', required: true },
        { key: 'slug', label: 'Slug' },
        { key: 'body_uz', label: 'Matn', type: 'rich' },
        {
          key: 'audience',
          label: 'Auditoria',
          type: 'select',
          options: [
            { value: 'founder', label: 'Jamoa' },
            { value: 'staff', label: 'Xodim' },
          ],
        },
        { key: 'is_published', label: 'Nashr', type: 'bool' },
      ]}
      toRow={(r: { title_uz: string; audience: string; is_published: boolean }) => ({
        t: r.title_uz,
        a: r.audience,
        p: r.is_published ? 'ha' : 'yo‘q',
      })}
    />
  )
}
