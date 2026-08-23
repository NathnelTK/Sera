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
};

export const TRANSLATIONS: Record<Lang, Dictionary> = { en, am };
