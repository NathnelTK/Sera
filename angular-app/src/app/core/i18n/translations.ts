/**
 * Lightweight, dependency-free i18n dictionaries.
 *
 * Translations are bundled with the app (no runtime HTTP fetch) so the language switch works
 * instantly and offline — important for low-bandwidth users. English is the fallback for any
 * key missing from another language.
 */

export type Lang = 'en' | 'am';

export interface LanguageOption {
  code: Lang;
  /** Name in English, for accessibility labels. */
  label: string;
  /** Name in the language's own script, shown in the switcher. */
  nativeLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ' },
];

export const DEFAULT_LANG: Lang = 'en';

type Dictionary = Record<string, string>;

const en: Dictionary = {
  'app.name': 'TalentOS',
  'app.tagline': 'Find your next opportunity',

  'common.loading': 'Loading…',
  'common.search': 'Search',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.save': 'Save',
  'common.back': 'Back',
  'common.viewAll': 'View all',
  'common.retry': 'Try again',
  'common.close': 'Close',
  'common.learnMore': 'Learn more',

  'nav.findJobs': 'Find jobs',
  'nav.forEmployers': 'For employers',
  'nav.forJobseekers': 'For job seekers',
  'nav.browseJobs': 'Browse jobs',
  'nav.signIn': 'Sign in',
  'nav.signUp': 'Sign up',
  'nav.dashboard': 'Dashboard',
  'nav.profile': 'Profile',
  'nav.myApplications': 'My applications',
  'nav.notifications': 'Notifications',
  'nav.logout': 'Sign out',
  'nav.postJob': 'Post a job',
  'nav.menu': 'Menu',
  'nav.account': 'Account',

  'lang.label': 'Language',
  'lang.english': 'English',
  'lang.amharic': 'Amharic',

  'logout.title': 'Sign out?',
  'logout.message': 'Are you sure you want to sign out of your TalentOS account?',
  'logout.confirm': 'Sign out',
  'logout.cancel': 'Stay signed in',

  'offline.title': "You're offline",
  'offline.message': "Check your internet connection — we'll reconnect automatically.",
  'offline.restored': 'Back online',
  'offline.banner': "You're offline — some features may not work until you reconnect.",
  'offline.retry': 'Retry',

  'error.generic': 'Something went wrong. Please try again.',
  'error.network': 'No internet connection. Please check your network and try again.',
  'error.server': 'Our servers hit a snag. Please try again shortly.',
  'error.unavailable': 'The service is temporarily unavailable. Please try again in a few moments.',
  'error.unauthorized': 'Please sign in to continue.',
  'error.forbidden': "You don't have permission to do that.",
  'error.notFound': "We couldn't find what you were looking for.",
  'error.validation': 'Please check the form and try again.',

  // Job seeker home
  'home.hero.title': 'Find the right job for you in Ethiopia',
  'home.hero.subtitle': 'Search thousands of jobs from verified employers — and apply with a profile they can trust.',
  'home.search.keyword': 'Job title, keywords, or company',
  'home.search.location': 'City or region',
  'home.search.button': 'Search jobs',
  'home.categories.title': 'Popular categories',
  'home.value.title': 'Why job seekers choose TalentOS',
  'home.value.verifiedTitle': 'Verified employers',
  'home.value.verifiedDesc': 'Every employer is vetted, so you can apply with confidence.',
  'home.value.faydaTitle': 'Stand out with Fayda',
  'home.value.faydaDesc': 'Verify your identity with your Fayda ID to build trust with employers.',
  'home.value.fastTitle': 'Apply in minutes',
  'home.value.fastDesc': 'One profile, one click — track every application in your dashboard.',
  'home.employer.title': 'Are you hiring?',
  'home.employer.subtitle': 'Reach verified talent across Ethiopia.',
  'home.employer.button': 'For employers',
  'home.cta.title': 'Your next opportunity is waiting',
  'home.cta.subtitle': 'Create a free profile and get matched with jobs that fit.',
  'home.cta.primary': 'Create your profile',
  'home.cta.secondary': 'Browse jobs',

  'home.cat.tech': 'Technology',
  'home.cat.finance': 'Finance',
  'home.cat.health': 'Healthcare',
  'home.cat.education': 'Education',
  'home.cat.sales': 'Sales & Marketing',
  'home.cat.engineering': 'Engineering',
  'home.cat.admin': 'Administration',
  'home.cat.hospitality': 'Hospitality',

  // Employer home
  'employers.hero.title': 'Hire verified talent in Ethiopia',
  'employers.hero.subtitle': 'Post a job, review Fayda-verified candidates, and hire faster with a modern applicant-tracking workflow.',
  'employers.hero.primary': 'Post a job',
  'employers.hero.secondary': 'See how it works',
  'employers.value.title': 'Built for Ethiopian hiring teams',
  'employers.value.verifiedTitle': 'Fayda-verified candidates',
  'employers.value.verifiedDesc': 'See which applicants have verified their national ID, and reduce hiring fraud.',
  'employers.value.pipelineTitle': 'A clear hiring pipeline',
  'employers.value.pipelineDesc': 'Track every candidate from application to offer in one place.',
  'employers.value.reachTitle': 'Reach the right people',
  'employers.value.reachDesc': 'Publish once and reach job seekers across the country.',
  'employers.how.title': 'How it works',
  'employers.how.step1Title': 'Post your job',
  'employers.how.step1Desc': 'Create an account and publish a role in minutes.',
  'employers.how.step2Title': 'Review candidates',
  'employers.how.step2Desc': 'Screen applicants and their verification status.',
  'employers.how.step3Title': 'Hire with confidence',
  'employers.how.step3Desc': 'Schedule interviews and make offers — all in TalentOS.',
  'employers.seeker.title': 'Looking for a job?',
  'employers.seeker.subtitle': 'Browse thousands of openings from verified employers.',
  'employers.seeker.button': 'Find jobs',
  'employers.cta.title': 'Start hiring today',
  'employers.cta.subtitle': 'Create a free employer account and post your first job.',
  'employers.cta.primary': 'Get started',

  // Footer
  'footer.tagline': "Ethiopia's modern recruitment platform.",
  'footer.forSeekers': 'For job seekers',
  'footer.forEmployers': 'For employers',
  'footer.company': 'Company',
  'footer.browseJobs': 'Browse jobs',
  'footer.createProfile': 'Create profile',
  'footer.postJob': 'Post a job',
  'footer.findTalent': 'Find talent',
  'footer.about': 'About us',
  'footer.contact': 'Contact',
  'footer.rights': 'All rights reserved.',
};

const am: Dictionary = {
  'app.name': 'TalentOS',
  'app.tagline': 'ቀጣዩን እድልዎን ያግኙ',

  'common.loading': 'በመጫን ላይ…',
  'common.search': 'ፈልግ',
  'common.cancel': 'ሰርዝ',
  'common.confirm': 'አረጋግጥ',
  'common.save': 'አስቀምጥ',
  'common.back': 'ተመለስ',
  'common.viewAll': 'ሁሉንም ይመልከቱ',
  'common.retry': 'እንደገና ይሞክሩ',
  'common.close': 'ዝጋ',
  'common.learnMore': 'የበለጠ ይወቁ',

  'nav.findJobs': 'ስራ ፈልግ',
  'nav.forEmployers': 'ለቀጣሪዎች',
  'nav.forJobseekers': 'ለስራ ፈላጊዎች',
  'nav.browseJobs': 'ስራዎችን ያስሱ',
  'nav.signIn': 'ግባ',
  'nav.signUp': 'ተመዝገብ',
  'nav.dashboard': 'ዳሽቦርድ',
  'nav.profile': 'መገለጫ',
  'nav.myApplications': 'የእኔ ማመልከቻዎች',
  'nav.notifications': 'ማሳወቂያዎች',
  'nav.logout': 'ውጣ',
  'nav.postJob': 'ስራ ለጥፍ',
  'nav.menu': 'ምናሌ',
  'nav.account': 'መለያ',

  'lang.label': 'ቋንቋ',
  'lang.english': 'እንግሊዝኛ',
  'lang.amharic': 'አማርኛ',

  'logout.title': 'ይውጡ?',
  'logout.message': 'ከTalentOS መለያዎ መውጣት እርግጠኛ ነዎት?',
  'logout.confirm': 'ውጣ',
  'logout.cancel': 'ልቆይ',

  'offline.title': 'ከበይነመረብ ተቋርጠዋል',
  'offline.message': 'የበይነመረብ ግንኙነትዎን ያረጋግጡ — በራሳችን እንደገና እናገናኛለን።',
  'offline.restored': 'እንደገና ተገናኝተዋል',
  'offline.banner': 'ከበይነመረብ ተቋርጠዋል — እስኪገናኙ ድረስ አንዳንድ ባህሪያት ላይሰሩ ይችላሉ።',
  'offline.retry': 'እንደገና ሞክር',

  'error.generic': 'የሆነ ችግር ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።',
  'error.network': 'የበይነመረብ ግንኙነት የለም። እባክዎ አውታረ መረብዎን አረጋግጠው እንደገና ይሞክሩ።',
  'error.server': 'በአገልጋዮቻችን ላይ ችግር ተፈጥሯል። እባክዎ ትንሽ ቆይተው ይሞክሩ።',
  'error.unavailable': 'አገልግሎቱ ለጊዜው አይገኝም። እባክዎ ከጥቂት ቆይታ በኋላ ይሞክሩ።',
  'error.unauthorized': 'ለመቀጠል እባክዎ ይግቡ።',
  'error.forbidden': 'ይህን ለማድረግ ፍቃድ የለዎትም።',
  'error.notFound': 'የፈለጉትን ማግኘት አልቻልንም።',
  'error.validation': 'እባክዎ ቅጹን አረጋግጠው እንደገና ይሞክሩ።',

  // Job seeker home
  'home.hero.title': 'በኢትዮጵያ ውስጥ ተስማሚ ስራ ያግኙ',
  'home.hero.subtitle': 'ከተረጋገጡ ቀጣሪዎች በሺዎች የሚቆጠሩ ስራዎችን ይፈልጉ — እና በሚታመን መገለጫ ያመልክቱ።',
  'home.search.keyword': 'የስራ መደብ፣ ቁልፍ ቃላት ወይም ኩባንያ',
  'home.search.location': 'ከተማ ወይም ክልል',
  'home.search.button': 'ስራ ፈልግ',
  'home.categories.title': 'ታዋቂ ምድቦች',
  'home.value.title': 'ስራ ፈላጊዎች TalentOS ን ለምን ይመርጣሉ',
  'home.value.verifiedTitle': 'የተረጋገጡ ቀጣሪዎች',
  'home.value.verifiedDesc': 'እያንዳንዱ ቀጣሪ የተጣራ ነው፣ ስለዚህ በመተማመን ማመልከት ይችላሉ።',
  'home.value.faydaTitle': 'በፋይዳ ጎልተው ይታዩ',
  'home.value.faydaDesc': 'ከቀጣሪዎች ጋር መተማመንን ለመገንባት በፋይዳ መታወቂያዎ ማንነትዎን ያረጋግጡ።',
  'home.value.fastTitle': 'በደቂቃዎች ውስጥ ያመልክቱ',
  'home.value.fastDesc': 'አንድ መገለጫ፣ አንድ ጠቅታ — እያንዳንዱን ማመልከቻ በዳሽቦርድዎ ይከታተሉ።',
  'home.employer.title': 'እየቀጠሩ ነው?',
  'home.employer.subtitle': 'በመላው ኢትዮጵያ የተረጋገጠ ተሰጥኦ ያግኙ።',
  'home.employer.button': 'ለቀጣሪዎች',
  'home.cta.title': 'ቀጣዩ እድልዎ እየጠበቀ ነው',
  'home.cta.subtitle': 'ነጻ መገለጫ ይፍጠሩ እና ከሚስማሙ ስራዎች ጋር ይገናኙ።',
  'home.cta.primary': 'መገለጫዎን ይፍጠሩ',
  'home.cta.secondary': 'ስራዎችን ያስሱ',

  'home.cat.tech': 'ቴክኖሎጂ',
  'home.cat.finance': 'ፋይናንስ',
  'home.cat.health': 'ጤና',
  'home.cat.education': 'ትምህርት',
  'home.cat.sales': 'ሽያጭና ግብይት',
  'home.cat.engineering': 'ኢንጂነሪንግ',
  'home.cat.admin': 'አስተዳደር',
  'home.cat.hospitality': 'እንግዳ ተቀባይነት',

  // Employer home
  'employers.hero.title': 'በኢትዮጵያ የተረጋገጠ ተሰጥኦ ይቅጠሩ',
  'employers.hero.subtitle': 'ስራ ይለጥፉ፣ በፋይዳ የተረጋገጡ እጩዎችን ይገምግሙ፣ እና በዘመናዊ የቅጥር ሂደት በፍጥነት ይቅጠሩ።',
  'employers.hero.primary': 'ስራ ለጥፍ',
  'employers.hero.secondary': 'እንዴት እንደሚሰራ ይመልከቱ',
  'employers.value.title': 'ለኢትዮጵያ የቅጥር ቡድኖች የተገነባ',
  'employers.value.verifiedTitle': 'በፋይዳ የተረጋገጡ እጩዎች',
  'employers.value.verifiedDesc': 'የትኞቹ አመልካቾች ብሔራዊ መታወቂያቸውን እንዳረጋገጡ ይመልከቱ እና የቅጥር ማጭበርበርን ይቀንሱ።',
  'employers.value.pipelineTitle': 'ግልጽ የቅጥር ሂደት',
  'employers.value.pipelineDesc': 'እያንዳንዱን እጩ ከማመልከቻ እስከ ቅጥር ድረስ በአንድ ቦታ ይከታተሉ።',
  'employers.value.reachTitle': 'ትክክለኛ ሰዎችን ያግኙ',
  'employers.value.reachDesc': 'አንዴ ይለጥፉ እና በመላው ሀገሪቱ ያሉ ስራ ፈላጊዎችን ያግኙ።',
  'employers.how.title': 'እንዴት ይሰራል',
  'employers.how.step1Title': 'ስራዎን ይለጥፉ',
  'employers.how.step1Desc': 'መለያ ይፍጠሩ እና በደቂቃዎች ውስጥ ስራ ይለጥፉ።',
  'employers.how.step2Title': 'እጩዎችን ይገምግሙ',
  'employers.how.step2Desc': 'አመልካቾችን እና የማረጋገጫ ሁኔታቸውን ይመርምሩ።',
  'employers.how.step3Title': 'በመተማመን ይቅጠሩ',
  'employers.how.step3Desc': 'ቃለ መጠይቆችን ያዘጋጁ እና ቅጥር ያድርጉ — ሁሉም በTalentOS ውስጥ።',
  'employers.seeker.title': 'ስራ እየፈለጉ ነው?',
  'employers.seeker.subtitle': 'ከተረጋገጡ ቀጣሪዎች በሺዎች የሚቆጠሩ ክፍት ቦታዎችን ያስሱ።',
  'employers.seeker.button': 'ስራ ፈልግ',
  'employers.cta.title': 'ዛሬ መቅጠር ይጀምሩ',
  'employers.cta.subtitle': 'ነጻ የቀጣሪ መለያ ይፍጠሩ እና የመጀመሪያ ስራዎን ይለጥፉ።',
  'employers.cta.primary': 'ይጀምሩ',

  // Footer
  'footer.tagline': 'የኢትዮጵያ ዘመናዊ የቅጥር መድረክ።',
  'footer.forSeekers': 'ለስራ ፈላጊዎች',
  'footer.forEmployers': 'ለቀጣሪዎች',
  'footer.company': 'ኩባንያ',
  'footer.browseJobs': 'ስራዎችን ያስሱ',
  'footer.createProfile': 'መገለጫ ይፍጠሩ',
  'footer.postJob': 'ስራ ለጥፍ',
  'footer.findTalent': 'ተሰጥኦ ያግኙ',
  'footer.about': 'ስለ እኛ',
  'footer.contact': 'አግኙን',
  'footer.rights': 'መብቱ በህግ የተጠበቀ ነው።',
};

export const TRANSLATIONS: Record<Lang, Dictionary> = { en, am };
