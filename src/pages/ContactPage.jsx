import InfoPage from '../components/common/InfoPage'
export default function ContactPage(){
 return <InfoPage eyebrow="SUPPORT / CONTACT" title="Talk to the team" intro="For account, moderation, privacy or technical issues, reach the VALO Community team directly." action={{to:'/help',label:'Open help center'}}>
  <div className="grid gap-4 md:grid-cols-2">
   <section className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-6">
    <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#00e5ff]">EMAIL SUPPORT</p>
    <h2 className="mt-2 font-display text-xl font-black uppercase text-white">Community team</h2>
    <p className="mt-2 text-sm leading-6 text-neutral-400">Include your account email, the affected page and a short description of the issue so we can investigate faster.</p>
    <a href="mailto:menatarmsclipz@gmail.com" className="mt-5 inline-flex items-center rounded-xl bg-[#ff4655] px-4 py-2.5 text-xs font-black uppercase text-white">Email support</a>
   </section>
   <section className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-6">
    <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#ff4655]">MODERATION</p>
    <h2 className="mt-2 font-display text-xl font-black uppercase text-white">Report content</h2>
    <p className="mt-2 text-sm leading-6 text-neutral-400">For posts, comments, users or streamers that violate the rules, use the in-app report flow so moderators receive the correct reference.</p>
    <a href="/posts" className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2.5 text-xs font-black uppercase text-neutral-300">Go to community</a>
   </section>
  </div>
 </InfoPage>
}
