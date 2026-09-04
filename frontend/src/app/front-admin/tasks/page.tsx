'use client'

import { useEffect, useState } from 'react'
import { adminApi, asList } from '@/lib/admin-api'
import { ResourcePage } from '@/components/admin/resource'

export default function TasksPage() {
  const [users, setUsers] = useState<{ value: string; label: string }[]>([])
  useEffect(() => {
    adminApi<{ results?: { id: string; name: string }[] } | { id: string; name: string }[]>('/api/v1/ops/users?role=admin&page_size=40')
      .then((d) => setUsers(asList(d).map((u) => ({ value: u.id, label: u.name }))))
      .catch(() => {})
  }, [])

  return (
    <ResourcePage
      kicker="Dastur"
      title="Vazifalar"
      lead="Klubning o‘z ishi: kontent, tadbir, dekanat, texnik. Talaba voronkasidan alohida."
      path="/api/v1/ops/tasks"
      columns={[
        { key: 't', label: 'Vazifa' },
        { key: 'st', label: 'Holat' },
        { key: 'a', label: 'Yo‘nalish' },
        { key: 'w', label: 'Mas’ul' },
      ]}
      fields={[
        { key: 'title', label: 'Sarlavha', required: true },
        { key: 'body', label: 'Tavsif', type: 'textarea' },
        {
          key: 'status',
          label: 'Holat',
          type: 'select',
          options: [
            { value: 'todo', label: 'Navbat' },
            { value: 'doing', label: 'Jarayon' },
            { value: 'done', label: 'Tayyor' },
          ],
        },
        {
          key: 'area',
          label: 'Yo‘nalish',
          type: 'select',
          options: [
            { value: 'content', label: 'Kontent' },
            { value: 'event', label: 'Tadbir' },
            { value: 'faculty', label: 'Dekanat' },
            { value: 'mentor', label: 'Mentor' },
            { value: 'tech', label: 'Texnik' },
            { value: 'demo', label: 'Demo Day' },
            { value: 'other', label: 'Boshqa' },
          ],
        },
        { key: 'assignee', label: 'Mas’ul', type: 'select', options: users },
        { key: 'due_at', label: 'Muddat', type: 'datetime' },
      ]}
      toRow={(r: { title: string; status: string; area: string; assignee_name: string | null }) => ({
        t: r.title,
        st: r.status,
        a: r.area,
        w: r.assignee_name || '—',
      })}
    />
  )
}
