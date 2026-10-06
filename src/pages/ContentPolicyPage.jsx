import InfoPage from '../components/common/InfoPage'
const sections=[
 {title:'Allowed community content',body:'Share VALORANT clips, strategies, tournament moments, creator content and discussion that is useful or entertaining.'},
 {title:'Prohibited content',body:'No malicious or deceptive content, sexual or explicit material, hateful content, threats, scams or harmful activity.'},
 {title:'Privacy & personal information',body:'Do not publish private personal information, credentials or sensitive information about other people.'},
 {title:'Copyright',body:'Only upload media you have permission to share. Repeated infringement may lead to content removal or account restrictions.'},
 {title:'Enforcement',body:'Moderators may hide or remove violating content. Serious or repeated violations can lead to temporary restrictions or account termination.'},
]
export default function ContentPolicyPage(){return <InfoPage eyebrow="COMMUNITY / CONTENT" title="Content policy" intro="What can be posted, what cannot, and how moderation works." sections={sections} action={{to:'/community-guidelines',label:'Read community rules'}}/>}
