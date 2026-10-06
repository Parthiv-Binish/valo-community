import InfoPage from '../components/common/InfoPage'
const sections=[
 {title:'Be respectful',body:'Treat players, creators and moderators with basic respect. Disagreement is fine; harassment is not.'},
 {title:'No harassment, hate or threats',body:'Do not target people with abusive, hateful, threatening or discriminatory content.'},
 {title:'No spam, scams or impersonation',body:'Do not flood the community, deceive users, promote scams or impersonate another person or organization.'},
 {title:'Share content you can share',body:'Only upload media and material you have the right to publish. Respect creators and copyright holders.'},
 {title:'Keep it relevant',body:'Posts should be useful or entertaining for the VALORANT community: clips, strategies, tournaments, creators, news and discussion.'},
 {title:'Report problems',body:'If something breaks these rules, report it instead of escalating the situation. Moderators can review the referenced content.'},
]
export default function CommunityGuidelinesPage(){return <InfoPage eyebrow="COMMUNITY / SAFETY" title="Community guidelines" intro="The rules are simple: build the community, don't make it worse." sections={sections} action={{to:'/report',label:'Report content'}}/>}
