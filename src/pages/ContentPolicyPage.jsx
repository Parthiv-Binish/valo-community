import InfoPage from '../components/common/InfoPage'
const sections=[
 {title:'Allowed community content',body:'Share VALORANT clips, strategies, tournament moments, creator content and discussion that is useful or entertaining.'},
 {title:'Prohibited content',body:'No malicious or deceptive content, sexual or explicit material, child sexual abuse or exploitation, hateful content, threats, scams, unlawful activity or content intended to cause harm.'},
 {title:'Privacy and personal information',body:'Do not publish private personal information, credentials or sensitive information about other people.'},
 {title:'Copyright and intellectual property',body:'Only upload media you have permission or a lawful basis to share. Repeated or serious infringement may lead to content removal or account restrictions.'},
 {title:'Illegal or harmful material',body:'Content that violates applicable law, facilitates serious wrongdoing, threatens safety or exposes people to significant harm may be removed and may be referred to the appropriate authority where legally required.'},
 {title:'Enforcement',body:'Moderators may hide or remove violating content. Serious or repeated violations can lead to temporary restrictions or account termination.'},
 {title:'Reporting and review',body:'Use the report flow for posts, comments, users, streamers or submissions. Include enough context for moderators to investigate. You may contact the team if you need to raise a moderation grievance or request a review.'},
]
export default function ContentPolicyPage(){return <InfoPage eyebrow="COMMUNITY / CONTENT" title="Content policy" intro="What can be posted, what cannot, and how moderation and reporting work." sections={sections} action={{to:'/community-guidelines',label:'Read community rules'}}/>}