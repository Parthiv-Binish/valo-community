import InfoPage from '../components/common/InfoPage'
const sections=[
 {title:'Be respectful',body:'Treat players, creators and moderators with basic respect. Disagreement is fine; harassment is not.'},
 {title:'No harassment, hate or threats',body:'Do not target people with abusive, hateful, threatening or discriminatory content.'},
 {title:'No spam, scams or impersonation',body:'Do not flood the community, deceive users, promote scams or impersonate another person or organization.'},
 {title:'Protect privacy and children',body:'Do not publish private personal information, credentials, contact details or sensitive information about other people without a lawful reason and appropriate permission. Never sexualise, exploit, target or solicit minors.'},
 {title:'Share content you can share',body:'Only upload media and material you have the right to publish. Respect creators and copyright holders.'},
 {title:'Keep it relevant',body:'Posts should be useful or entertaining for the VALORANT community: clips, strategies, tournaments, creators, news and discussion.'},
 {title:'Report problems',body:'If something breaks these rules, report it instead of escalating the situation. Reports can be submitted through the in-app report flow and are reviewed by moderators.'},
 {title:'Moderation and appeals',body:'Moderators may remove or restrict content and accounts when necessary to protect the community. If you believe an enforcement action was made in error, contact the team with the relevant details so it can be reviewed.'},
]
export default function CommunityGuidelinesPage(){return <InfoPage eyebrow="COMMUNITY / SAFETY" title="Community guidelines" intro="The rules are simple: build the community, don't make it worse. These guidelines apply to posts, comments, profiles and other community interactions." sections={sections} action={{to:'/report',label:'Report content'}}/>}