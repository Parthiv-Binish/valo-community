import InfoPage from '../components/common/InfoPage'
export default function ContactPage(){
 return <InfoPage eyebrow="SUPPORT / CONTACT" title="Talk to the team" intro="For account, moderation, privacy, legal or technical issues, reach the VALO Community team directly." action={{to:'/help',label:'Open help center'}}>
  <div className="grid gap-4 md:grid-cols-2">
   <section className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-6">
    <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#00e5ff]">EMAIL SUPPORT</p>
    <h2 className="mt-2 font-display text-xl font-black uppercase text-white">Community team</h2>
    <p className="mt-2 text-sm leading-6 text-neutral-400">Include your account email, the affected page and a short description of the issue so we can investigate faster.</p>
    <a href="mailto:menatarmsclipz@gmail.com" className="mt-5 inline-flex items-center rounded-xl bg-[#ff4655] px-4 py-2.5 text-xs font-black uppercase text-white">Email support</a>
   </section>
   <section className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-6">
    <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#ff4655]">GRIEVANCE / MODERATION</p>
    <h2 className="mt-2 font-display text-xl font-black uppercase text-white">Raise a grievance</h2>
    <p className="mt-2 text-sm leading-6 text-neutral-400">Use this channel for privacy concerns, moderation decisions, account issues, unlawful-content concerns or other complaints about the service. Include the relevant post, account or report reference when available.</p>
    <a href="mailto:menatarmsclipz@gmail.com?subject=VALO%20Community%20Grievance" className="mt-5 inline-flex rounded-xl border border-[#ff4655]/25 px-4 py-2.5 text-xs font-black uppercase text-[#ff6674]">Email grievance team</a>
   </section>
   <section className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-6 md:col-span-2">
    <p className="font-mono text-[9px] uppercase tracking-[.2em] text-neutral-600">IN-APP REPORTING</p>
    <h2 className="mt-2 font-display text-xl font-black uppercase text-white">Report community content</h2>
    <p className="mt-2 text-sm leading-6 text-neutral-400">For a specific post, comment, user or streamer, the in-app report flow is the fastest route because it preserves the target reference for moderators.</p>
    <a href="/report" className="mt-5 inline-flex rounded-xl bg-white/[.05] px-4 py-2.5 text-xs font-black uppercase text-neutral-200">Open report form</a>
   </section>
  </div>
 </InfoPage>
}