import MainLayout from '../layouts/MainLayout'

export default function PrivacyPolicyPage(){
  return <MainLayout><div className="max-w-4xl mx-auto px-4 py-10 text-neutral-400 font-body leading-7 space-y-8">
    <header className="border-b border-white/10 pb-6"><h1 className="text-3xl font-display font-black text-white uppercase tracking-wider">Privacy Policy</h1><p className="text-xs font-mono text-neutral-500 mt-2">LAST UPDATED: October 6, 2026</p></header>
    <Section t="1. What we collect">When you sign in, we receive account information provided by Supabase Auth, such as your email address and authentication identifiers. We store community profile information you choose to provide, subscriptions, device notification registrations, posts, comments, likes, bookmarks, follows and reports.</Section>
    <Section t="2. Public streaming data">We process publicly available streamer information from supported platforms, including channel identity, live status, stream title, thumbnail, viewer count and broadcast URL. This information is used to operate the live directory, history and discovery features.</Section>
    <Section t="3. How we use data">We use information to authenticate users, operate community features, deliver notifications, moderate content, maintain streamer data, provide analytics and keep the service secure.</Section>
    <Section t="4. Service providers">The application uses Supabase for database and authentication infrastructure, Vercel for frontend hosting and Render for backend hosting. External streaming platforms provide streamer data. Providers may process data according to their own policies.</Section>
    <Section t="5. Storage and security">Authentication sessions and limited preferences may be stored in browser storage. We use database row-level security and server-side privileged APIs to restrict access to protected data. No internet service can guarantee absolute security.</Section>
    <Section t="6. Your controls">You can update your community profile, manage subscriptions and notification registrations, log out, and permanently delete your account from Settings. Account deletion removes the user-owned application records we control and requests deletion of the Supabase authentication account.</Section>
    <Section t="7. Retention">Operational records may be retained where necessary for security, moderation, legal obligations, fraud prevention or service integrity. Public streamer history is not treated as private user data.</Section>
    <Section t="8. Contact">For privacy requests or questions, contact the VALO Community team through the Contact page.</Section>
  </div></MainLayout>
}
function Section({t,children}){return <section className="space-y-2"><h2 className="text-white font-display font-black uppercase tracking-wider text-sm">// {t}</h2><p>{children}</p></section>}
