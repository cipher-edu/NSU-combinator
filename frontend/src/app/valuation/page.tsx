'use client'

import { useMemo, useState } from 'react'
import { PageTitle } from '@/components/Chrome'
import { useI18n } from '@/lib/i18n'

export default function ValuationPage() {
  const { t } = useI18n()
  const [raise, setRaise] = useState(100000)
  const [equity, setEquity] = useState(10)
  const [arr, setArr] = useState(120000)
  const [mult, setMult] = useState(10)
  const [exitArr, setExitArr] = useState(5_000_000)
  const [exitX, setExitX] = useState(8)
  const [p, setP] = useState(25)
  const [ret, setRet] = useState(30)
  const [years, setYears] = useState(5)

  const deal = equity > 0 ? raise / (equity / 100) : 0
  const rev = arr * mult
  const vc = useMemo(() => {
    const exit = exitArr * exitX
    const need = (raise * Math.pow(1 + ret / 100, years)) / Math.max(p / 100, 0.01)
    return Math.max(exit - need, 0)
  }, [exitArr, exitX, raise, ret, years, p])
  const avg = (deal + rev + vc) / 3
  const mrr = Math.round(arr / 12)

  function demo() {
    setRaise(100000)
    setEquity(10)
    setArr(120000)
    setMult(10)
    setExitArr(5_000_000)
    setExitX(8)
    setP(25)
    setRet(30)
    setYears(5)
  }
  function clear() {
    setRaise(0)
    setEquity(0)
    setArr(0)
    setMult(0)
    setExitArr(0)
    setExitX(0)
    setP(0)
    setRet(0)
    setYears(0)
  }

  return (
    <main className="pb-24">
      <PageTitle title={t.valTitle} lead={t.valLead} />
      <div className="mx-auto mb-6 flex max-w-5xl justify-end gap-4 px-5 text-[13px] sm:px-6">
        <button type="button" className="link-hover" onClick={demo}>
          Demo
        </button>
        <button type="button" className="link-hover" onClick={clear}>
          Tozalash
        </button>
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 px-5 sm:grid-cols-3 sm:px-6">
        <Card title="Bitim asosida">
          <Num label="Jalb $" value={raise} set={setRaise} />
          <Num label="Ulush %" value={equity} set={setEquity} />
          <Out v={deal} />
        </Card>
        <Card title="Daromad ×">
          <Num label="MRR $" value={mrr} set={(n) => setArr(n * 12)} />
          <Num label="ARR $" value={arr} set={setArr} />
          <Num label="Multiplikator" value={mult} set={setMult} />
          <Out v={rev} />
        </Card>
        <Card title="VC metodi">
          <Num label="Exit ARR $" value={exitArr} set={setExitArr} />
          <Num label="Exit ×" value={exitX} set={setExitX} />
          <Num label="Ehtimollik %" value={p} set={setP} />
          <Num label="Kutilgan daromad %" value={ret} set={setRet} />
          <Num label="Yillar" value={years} set={setYears} />
          <Out v={vc} />
        </Card>
      </div>
      <div className="mx-auto mt-12 max-w-5xl px-5 text-center sm:px-6">
        <p className="eyebrow">O‘rtacha pre-money baho</p>
        <p className="mt-3 font-display text-5xl italic">{avg ? `$${Math.round(avg).toLocaleString()}` : '—'}</p>
        <p className="mt-2 text-sm text-muted">Uchta metod o‘rtachasi · dastlabki chama</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-8 text-[14px] text-muted">
          <li>Bitim asosida <span className="text-ink">${Math.round(deal).toLocaleString()}</span></li>
          <li>Daromad × <span className="text-ink">${Math.round(rev).toLocaleString()}</span></li>
          <li>VC metodi <span className="text-ink">${Math.round(vc).toLocaleString()}</span></li>
        </ul>
      </div>
    </main>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white/70 p-5">
      <h3 className="mb-4 font-display text-xl">{title}</h3>
      {children}
    </div>
  )
}
function Num({ label, value, set }: { label: string; value: number; set: (n: number) => void }) {
  return (
    <label className="mb-3 block text-[13px] text-muted">
      {label}
      <input
        type="number"
        className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-ink"
        value={value}
        onChange={(e) => set(Number(e.target.value))}
      />
    </label>
  )
}
function Out({ v }: { v: number }) {
  return <p className="mt-2 font-display text-2xl">${Math.round(v).toLocaleString()}</p>
}
