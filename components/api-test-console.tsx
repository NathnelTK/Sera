'use client'

import { FormEvent, useState } from 'react'
import { Activity, CheckCircle2, CircleAlert, Plus, RefreshCw, Server } from 'lucide-react'

type Job = { id: string; title: string; company: string; location: string; status: string }

export function ApiTestConsole() {
  const [health, setHealth] = useState<{ status: string; timestamp?: string } | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [message, setMessage] = useState('Run an endpoint to see its response here.')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', company: '', location: 'Remote' })

  async function runHealth() {
    setLoading(true)
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealth(data)
      setMessage(JSON.stringify(data, null, 2))
    } finally {
      setLoading(false)
    }
  }

  async function loadJobs() {
    setLoading(true)
    try {
      const response = await fetch('/api/jobs')
      const data = await response.json()
      setJobs(data.items)
      setMessage(JSON.stringify(data, null, 2))
    } finally {
      setLoading(false)
    }
  }

  async function createJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const response = await fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await response.json()
    setMessage(JSON.stringify(data, null, 2))
    if (response.ok) {
      setJobs((current) => [...current, data])
      setForm({ title: '', company: '', location: 'Remote' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3"><div className="rounded-lg bg-primary p-2 text-primary-foreground"><Server size={18} /></div><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">TalentOS</p><h1 className="text-lg font-semibold">API test console</h1></div></div>
          <span className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex"><Activity size={16} className="text-teal-600" /> Local endpoints</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-8 px-5 py-10 lg:px-8">
        <section><p className="font-mono text-sm text-teal-700">QUICK CHECKS</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Test the project without Postman.</h2><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Use these small endpoints to confirm the app is running, read jobs, and send your first create request.</p></section>
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="font-mono text-xs text-muted-foreground">GET /api/health</p><h3 className="mt-2 font-semibold">Service health</h3></div>{health?.status === 'ok' ? <CheckCircle2 className="text-teal-600" /> : <CircleAlert className="text-muted-foreground" />}</div><button onClick={runHealth} disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50">{loading ? <RefreshCw className="animate-spin" size={16} /> : <Activity size={16} />} Run check</button></div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm"><p className="font-mono text-xs text-muted-foreground">GET /api/jobs</p><h3 className="mt-2 font-semibold">List published jobs</h3><p className="mt-2 text-sm text-muted-foreground">Returns the in-memory sample job collection.</p><button onClick={loadJobs} disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:opacity-50"><RefreshCw size={16} /> Load jobs</button></div>
        </section>
        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="font-mono text-xs text-muted-foreground">POST /api/jobs</p><h3 className="mt-2 font-semibold">Create a draft job</h3></div><Plus size={18} className="text-teal-600" /></div><form onSubmit={createJob} className="mt-5 space-y-3">{(['title', 'company', 'location'] as const).map((field) => <label key={field} className="block"><span className="mb-1 block text-sm capitalize text-muted-foreground">{field}</span><input required={field !== 'location'} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring" /></label>)}<button disabled={loading} className="mt-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50">Create job</button></form></div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm"><h3 className="font-semibold">Response</h3><pre className="mt-4 min-h-44 overflow-auto rounded-lg bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200">{message}</pre></div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="font-semibold">Jobs returned <span className="font-mono text-sm text-muted-foreground">({jobs.length})</span></h3><button onClick={loadJobs} className="text-sm text-teal-700 hover:underline">Refresh</button></div>{jobs.length === 0 ? <p className="mt-5 text-sm text-muted-foreground">Load jobs to populate this table.</p> : <div className="mt-4 divide-y divide-border">{jobs.map((job) => <div key={job.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{job.title}</p><p className="text-sm text-muted-foreground">{job.company} · {job.location}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{job.status}</span></div>)}</div>}</section>
      </main>
    </div>
  )
}
