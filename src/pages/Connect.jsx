import { useEffect, useState } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteNav from '../components/SiteNav.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { CONTACT, LINKS, TOPICS } from '../data/connect.js'

// Drop a file named connect-portrait.(jpg|png|webp) into src/assets/images to show it here.
const portraitFiles = import.meta.glob('../assets/images/connect-portrait.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})
const portrait = Object.values(portraitFiles)[0]

const LABEL = 'block font-mono text-[11px] uppercase tracking-widest text-editorial-muted'
const FIELD =
  'w-full rounded-none bg-transparent border-0 border-b border-[#2b2d31] focus:border-editorial-white px-0 py-3 text-editorial-white font-body text-base placeholder:text-[#3a3d42] outline-none focus-visible:outline-none transition-colors'

function ContactCard({ number, label, title, blurb, href }) {
  const live = Boolean(href)
  const external = live && href.startsWith('http')
  const className = `group p-6 bg-obsidian/80 border border-[#1b1c1e] rounded-sm flex flex-col justify-between h-44 transition-all duration-300 ${
    live ? 'hover:bg-[#17181a] hover:border-[#2b2d31]' : 'opacity-60'
  }`
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-editorial-muted">
          {String(number).padStart(2, '0')} // {label}
        </span>
        {live && (
          <span
            aria-hidden="true"
            className="text-sm text-editorial-muted group-hover:text-editorial-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
          >
            ↗
          </span>
        )}
      </div>
      <div>
        <h3 className="font-headline text-lg font-semibold text-editorial-white uppercase tracking-wide mb-1">{title}</h3>
        <p className="font-body text-xs text-editorial-muted break-words">{live ? blurb : 'Link coming soon'}</p>
      </div>
    </>
  )

  if (!live) {
    return (
      <div className={className} aria-disabled="true">
        {body}
      </div>
    )
  }
  return (
    <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {body}
    </a>
  )
}

function InfoRow({ label, value, last }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 ${last ? '' : 'border-b border-[#1b1c1e] pb-3'}`}>
      <span className="font-mono text-[11px] uppercase tracking-widest text-editorial-muted">{label}</span>
      <span className="font-mono text-xs text-editorial-white text-right">{value}</span>
    </div>
  )
}

/** Opens the visitor's email app with the message pre-filled — nothing is sent from this page itself. */
function ContactForm() {
  const [status, setStatus] = useState({ tone: 'neutral', text: "Opens your email app with the message ready to send." })

  const onSubmit = (event) => {
    event.preventDefault()
    if (!CONTACT.email) {
      setStatus({ tone: 'error', text: "Sending isn't set up yet — please use one of the links above." })
      return
    }
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const email = String(form.get('email')).trim()
    const topic = TOPICS.find((t) => t.value === form.get('subject'))?.label ?? 'General'
    const subject = `[Portfolio] ${topic}`
    const body = `${String(form.get('message')).trim()}\n\n— ${name} (${email})`
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus({ tone: 'ok', text: 'Opening your email app — press send there to deliver it.' })
  }

  const toneClass = { neutral: 'text-[#55585d]', ok: 'text-emerald-400', error: 'text-primary' }[status.tone]

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className={LABEL} htmlFor="name">
          Name / Identifier
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" placeholder="Your name or organization" className={FIELD} />
      </div>

      <div className="space-y-2">
        <label className={LABEL} htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="email@domain.com" className={FIELD} />
      </div>

      <div className="space-y-2">
        <label className={LABEL} htmlFor="subject">
          Domain / Inquiry Area
        </label>
        <div className="relative">
          <select id="subject" name="subject" className={`${FIELD} appearance-none pr-8 cursor-pointer`}>
            {TOPICS.map((topic) => (
              <option key={topic.value} value={topic.value} className="bg-obsidian text-editorial-white">
                {topic.label}
              </option>
            ))}
          </select>
          <span
            className="material-symbols-outlined pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[20px] text-editorial-muted"
            aria-hidden="true"
          >
            expand_more
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className={LABEL} htmlFor="message">
          Message
        </label>
        <textarea id="message" name="message" required rows={4} placeholder="Provide context or proposal details..." className={`${FIELD} resize-none`} />
      </div>

      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-editorial-white hover:bg-white text-void font-mono text-xs uppercase tracking-widest font-semibold transition-colors duration-200 active:scale-95"
        >
          Send message
          <span className="text-sm" aria-hidden="true">
            →
          </span>
        </button>
        <p className={`font-mono text-[11px] ${toneClass}`} role="status" aria-live="polite">
          {status.text}
        </p>
      </div>
    </form>
  )
}

export default function Connect() {
  useEffect(() => {
    document.title = 'Connect — TITAN'
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest text-editorial-muted antialiased">
      <SiteHeader className="relative max-w-6xl mx-auto" alwaysShowChildren>
        <SiteNav activeId="connect" />
      </SiteHeader>

      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-8 md:px-16 pt-10 pb-16 md:pb-24">
          {/* Hero */}
          <section className="max-w-3xl mb-16 md:mb-20">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-4 h-px bg-ducati-red" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-editorial-muted">
                Initiate transmission
              </span>
            </div>
            <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-editorial-white uppercase leading-tight md:leading-none mb-6">
              Get in <span className="text-ducati-red font-light italic">touch.</span>
            </h1>
            <p className="font-body text-base md:text-lg text-editorial-muted leading-relaxed max-w-xl">
              <span className="font-semibold italic text-editorial-white">
                Available for high-throughput systems advisory, quantitative engineering, or track days
              </span>.
              <span className="block mt-3">
                Whether it's building something together, exchanging ideas, sharing a laugh, or talking through a difficult
                time—I'm around.{' '}
                <span className="font-semibold italic text-editorial-white">Sometimes, being heard is all we need.</span>
              </span>
            </p>
          </section>

          {/* Direct links */}
          <section className="mb-20 md:mb-24" aria-label="Direct links">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {LINKS.map((link, i) => (
                <ContactCard key={link.id} number={i + 1} label={link.label} title={link.label} blurb={link.blurb} href={link.href} />
              ))}
              <ContactCard
                number={LINKS.length + 1}
                label="Direct"
                title="Direct Mail"
                blurb={CONTACT.email}
                href={CONTACT.email ? `mailto:${CONTACT.email}` : ''}
              />
            </div>
          </section>

          {/* Details + form */}
          <section className="border-t border-[#1b1c1e] pt-16 md:pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
              <div className="lg:col-span-5 max-w-sm">
                <div className="relative w-full aspect-[4/5] rounded overflow-hidden bg-surface-container-lowest border border-[#1b1c1e] mb-8">
                  {portrait && (
                    <img
                      src={portrait}
                      alt="Abhishek Kumar"
                      className="w-full h-full object-cover contrast-110 opacity-80 hover:opacity-100 transition-opacity duration-700 ease-out"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0f] via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>
                <div className="space-y-4">
                  <InfoRow label="Location" value={CONTACT.location} />
                  <InfoRow label="Collaboration" value={CONTACT.collaboration} />
                  <InfoRow label="Response" value={CONTACT.response} last />
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="mb-10">
                  <h2 className="font-headline text-2xl font-bold uppercase tracking-tight text-editorial-white mb-2">
                    Send message
                  </h2>
                  <p className="font-body text-sm text-editorial-muted">
                    Drop a brief description of your project, infrastructure scope, or dispatch.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="border-t border-[#1b1c1e]">
        <div className="max-w-6xl mx-auto">
          <SiteFooter />
        </div>
      </div>
    </div>
  )
}
