import MainLayout from '../layouts/MainLayout'

export default function TermsPage(){
  return (
    <MainLayout>
      <Legal title="Terms & Conditions" updated="October 6, 2026">
        <Section t="1. Acceptance">By using Let's Build VALO Community, you agree to these terms and our Privacy Policy.</Section>
        <Section t="2. Community">You are responsible for content you publish. Do not post illegal, abusive, hateful, deceptive, or infringing material.</Section>
        <Section t="3. Accounts">Keep your account secure. We may restrict accounts that abuse the platform or violate these rules.</Section>
        <Section t="4. User content">You retain ownership of content you submit, while granting the platform permission to host and display it as needed to operate the service.</Section>
        <Section t="5. Streaming data">Streamer status and public metadata are sourced from supported platforms and may be delayed or unavailable.</Section>
        <Section t="6. Availability">The service is provided on an availability basis and features may change as the community evolves.</Section>
        <Section t="7. Contact">For legal or account questions, use the Contact page.</Section>
      </Legal>
    </MainLayout>
  )
}

function Section({t, children}){
  return <section className="space-y-2"><h2 className="text-white font-display font-black uppercase tracking-wider text-sm">// {t}</h2><p>{children}</p></section>
}

function Legal({title, updated, children}){
  return <div className="max-w-4xl mx-auto px-4 py-10 text-neutral-400 font-body leading-7 space-y-8"><header className="border-b border-white/10 pb-6"><h1 className="text-3xl font-display font-black text-white uppercase tracking-wider">{title}</h1><p className="text-xs font-mono text-neutral-500 mt-2">LAST UPDATED: {updated}</p></header>{children}</div>
}
