import InfoPage from '../components/common/InfoPage'
const sections=[
 {title:'Acceptance',body:"By using Let's Build VALO Community, you agree to these terms and our Privacy Policy."},
 {title:'Community',body:'You are responsible for content you publish. Do not post illegal, abusive, hateful, deceptive, or infringing material.'},
 {title:'Accounts',body:'Keep your account secure. We may restrict accounts that abuse the platform or violate these rules.'},
 {title:'User content',body:'You retain ownership of content you submit, while granting the platform permission to host and display it as needed to operate the service.'},
 {title:'Streaming data',body:'Streamer status and public metadata are sourced from supported platforms and may be delayed or unavailable.'},
 {title:'Availability',body:'The service is provided on an availability basis and features may change as the community evolves.'},
 {title:'Contact',body:'For legal or account questions, use the Contact page.'},
]
export default function TermsPage(){return <InfoPage eyebrow="LEGAL / TERMS" title="Terms & conditions" intro="Last updated October 6, 2026. These terms describe the basic rules for using VALO Community." sections={sections} action={{to:'/contact',label:'Contact team'}}/>}
