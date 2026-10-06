import InfoPage from '../components/common/InfoPage'
const sections=[
 {title:'Account',body:'Use Profile and Settings to manage your account, public identity and session.'},
 {title:'Streams',body:'Live status is maintained by our backend and can occasionally be delayed. Use the live directory for the current verified state.'},
 {title:'Posts',body:'Create posts with images or videos, comment inline, follow creators, save posts and report content that breaks the rules.'},
 {title:'Safety',body:'Use the report and block tools when something needs moderator attention. Keep personal information out of public posts.'},
 {title:'Privacy',body:'Review the Privacy Policy or use Settings to permanently delete your account.'},
 {title:'Need more help?',body:'For account, moderation, privacy or technical issues, contact the VALO Community team.'},
]
export default function HelpPage(){return <InfoPage eyebrow="SUPPORT / HELP CENTER" title="How can we help?" intro="Quick answers for the features you use across VALO Community." sections={sections} action={{to:'/contact',label:'Contact support'}}/>}
