import { Link } from 'react-router-dom'
import MainLayout from '../../src/layouts/MainLayout'
import Icon from './Icon'

export default function InfoPage({ eyebrow='VALO COMMUNITY', title, intro, sections=[], action, children }) {
  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl">
        <header className="relative overflow-hidden rounded-[28px] border border-white/[.08] bg-[#0b0b10] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#ff4655]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#00e5ff]/[.06] blur-3xl" />
          <div className="relative">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[.24em] text-[#ff4655]">{eyebrow}</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">{title}</h1>
            {intro && <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-400">{intro}</p>}
            {action && <Link to={action.to} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#ff4655] px-4 py-2.5 text-xs font-black uppercase text-white hover:bg-[#e63f4d]">{action.label}<Icon name="arrow" size={14}/></Link>}
          </div>
        </header>

        {children ? (
          <div className="mt-5">{children}</div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {sections.map((section, index) => (
              <section key={section.title} className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ff4655]/10 font-mono text-[10px] font-bold text-[#ff6674]">{String(index + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-black uppercase tracking-wide text-white">{section.title}</h2>
                    {Array.isArray(section.body) ? (
                      <div className="mt-2 space-y-2 text-sm leading-6 text-neutral-400">
                        {section.body.map((item, i) => <p key={i}>{item}</p>)}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm leading-6 text-neutral-400">{section.body}</p>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
