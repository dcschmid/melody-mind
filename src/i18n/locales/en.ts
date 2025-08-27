import template from "./template";

export default {
  // Merge base template to keep existing common keys and then add/override
  ...template,

  // Footer keys ensured in main English locale (explicit overrides/additions)
  "footer.description":
    "The ultimate music trivia game. Test your knowledge across genres and decades.",
  "footer.legal_title": "Legal",
  "footer.connect_title": "Connect & Support",
  "footer.support_label": "Support the project:",
  "footer.donate": "Donate",
  "footer.donate_aria": "Donate via PayPal",
  "footer.impressum": "Legal Notice",
  "footer.impressum_aria": "View legal information and legal notice",
  "footer.privacy": "Privacy Policy",
  "footer.privacy_aria": "View privacy policy",
  "footer.aria": "Footer",
  "footer.external_nav": "Footer links",
  "footer.legal_nav": "Legal information",
  "footer.github": "GitHub",
  "footer.kofi": "Ko-fi",
  "footer.opens_in_new_tab": "opens in a new tab",
  "footer.rights": "All rights reserved",
  "footer.source_code": "View MelodyMind source code on GitHub",
  "footer.support_kofi": "Support MelodyMind on Ko-fi",

  // Maintainable, short keys for Privacy Page (English)
  "pages.privacy.title": "Privacy Policy",
  "pages.privacy.meta_description":
    "MelodyMind privacy policy — How we collect, process and protect your personal data.",
  "pages.privacy.last_updated": "Last updated: {date}",

  "pages.privacy.intro_p1":
    "The following gives a simple overview of what happens to your personal information when you visit our website. Personal information is any data with which you could be personally identified.",
  "pages.privacy.responsible_party_title": "Information about the responsible party",
  "pages.privacy.responsible_party_description":
    "The data processing on this website is carried out by the website operator. You can find the operator's contact details in the imprint/legal notice section.",

  "pages.privacy.data_collected.manual":
    "Some data is collected when you provide it to us (for example, when you fill in contact forms).",
  "pages.privacy.data_collected.automatic":
    "Other data is collected automatically by our IT systems when you visit the website. This mainly includes technical data such as the browser and operating system you use, or the time of access.",

  "pages.privacy.hosting.title": "Hosting Provider",
  "pages.privacy.hosting.description":
    "We host the content of our website at Render Services, Inc., 525 Brannan Street, Suite 300, San Francisco, CA 94107, USA.",
  "pages.privacy.hosting.render_privacy_link_label": "Render privacy policy",
  "pages.privacy.hosting.render_privacy_link_url": "https://render.com/privacy",

  "pages.privacy.legal_basis.title": "Legal basis for processing",
  "pages.privacy.legal_basis.description":
    "The use of the website is based on Art. 6(1)(f) GDPR. We have a legitimate interest in a reliable and user-friendly presentation of our website.",

  "pages.privacy.turso_storage.title": "Game data and storage",
  "pages.privacy.turso_storage.description":
    "When you play MelodyMind, the following data may be stored in our TursoDB database: game statistics (rounds played, categories, difficulty levels). This data is stored securely to provide persistent game progress and features such as high scores and achievements.",
  "pages.privacy.turso_storage.deletion_request":
    "You can request deletion of your data at any time by contacting us via the contact details provided in the imprint.",

  "pages.privacy.cookies.title": "Cookies",
  "pages.privacy.cookies.description":
    "Our website uses cookies. These are small text files that your browser stores on your device. We use only technically necessary cookies for core functionality unless you explicitly consent to additional cookies.",

  "pages.privacy.analytics.title": "Analytics",
  "pages.privacy.analytics.description":
    "We use Fathom Analytics, a privacy-focused analytics service, to better understand how visitors interact with our website. Fathom processes data anonymously and does not collect personal data or set tracking cookies.",
  "pages.privacy.analytics.link_label": "Fathom privacy policy",
  "pages.privacy.analytics.link_url": "https://usefathom.com/privacy",

  "pages.privacy.rights.title": "Your rights",
  "pages.privacy.rights.description":
    "You have the right to access, correct or erase your personal data, restrict processing, object to processing, and request data portability where applicable. To exercise these rights, please contact us using the details in the imprint.",
  "pages.privacy.rights.complaint":
    "You also have the right to lodge a complaint with a data protection supervisory authority about our processing of your personal data.",

  "pages.privacy.contact.title": "Contact",
  "pages.privacy.contact.address":
    "Address: Daniel Schmid, Hiltenspergerstr. 78, 80796 Munich, Germany",
  "pages.privacy.contact.email_label": "Email",
  "pages.privacy.contact.email": "dcschmid@murena.io",

  // Maintainable, short keys for Imprint / Legal Notice (English)
  "pages.imprint.title": "Legal Notice",
  "pages.imprint.heading": "Legal Notice / Imprint",
  "pages.imprint.intro":
    "This legal notice contains the legally required information about the website operator. Please adapt the information to your specific situation where necessary.",
  "pages.imprint.company_name_label": "Operator",
  "pages.imprint.company_name": "MelodyMind (Daniel Schmid)",
  "pages.imprint.address_label": "Address",
  "pages.imprint.address": "Hiltenspergerstr. 78, 80796 Munich, Germany",
  "pages.imprint.contact_label": "Contact",
  "pages.imprint.contact_email": "dcschmid@murena.io",

  "pages.imprint.music_assets.title": "Music previews and artwork",
  "pages.imprint.music_assets.description":
    "The music previews and album covers used in MelodyMind are provided through licensed APIs. All rights to the music and images remain with the respective artists, record labels, and rights holders.",

  "pages.imprint.streaming_links.title": "Streaming links",
  "pages.imprint.streaming_links.description":
    "Streaming links lead to licensed music services such as Spotify, Apple Music and Deezer. MelodyMind itself does not host copyrighted content.",

  "pages.imprint.dispute_resolution.title": "Online dispute resolution",
  "pages.imprint.dispute_resolution.description":
    "The European Commission provides a platform for online dispute resolution (ODR). For complaints arising from online contracts, you can find the ODR platform at the following link.",
  "pages.imprint.dispute_resolution.odr_link_label": "European Commission ODR platform",
  "pages.imprint.dispute_resolution.odr_link_url": "https://ec.europa.eu/consumers/odr",

  "pages.imprint.dispute_participation":
    "We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board.",

  "pages.legal.disclaimer.title": "Disclaimer",
  "pages.legal.disclaimer.content":
    "This legal notice has been created with care. However, we cannot guarantee completeness and accuracy. Please adapt the information according to your specific situation and local legal requirements.",

  // For backwards compatibility: keep existing auto.* keys as fallback (do not remove)
  // If you plan to migrate templates incrementally, replace usages of `auto.*` with the short keys above.
};
