import InfoPage from '../components/common/InfoPage'
const sections=[
 {title:'Browser storage',body:'VALO Community uses browser storage for authentication/session handling and limited local preferences such as the introductory experience. Authentication storage is used to keep your signed-in session; it is not used for behavioural advertising.'},
 {title:'Advertising',body:'The current application does not use advertising cookies as part of the community experience.'},
 {title:'Clearing storage',body:'You can clear browser storage through your browser settings. Clearing authentication storage will sign you out locally.'},
]
export default function CookiePolicyPage(){return <InfoPage eyebrow="LEGAL / STORAGE" title="Cookies & local storage" intro="A short explanation of the browser storage used by the current application." sections={sections}/>}
