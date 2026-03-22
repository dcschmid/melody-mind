export const PODCAST_SITE_URL = "https://podcasts.melody-mind.de";
export const PODCAST_FEED_PATH = "/podcast.xml";
export const PODCAST_FEED_URL = `${PODCAST_SITE_URL}${PODCAST_FEED_PATH}`;
export const PODCAST_IMAGE_PATH = "/the-melody-mind-podcast.jpg";
export const PODCAST_IMAGE_URL = `${PODCAST_SITE_URL}${PODCAST_IMAGE_PATH}`;

export type PodcastPlatformLink = {
  href: string;
  label: string;
  ariaLabel: string;
  iconName: string;
  rel?: string;
  target?: "_blank";
};

export const PODCAST_PLATFORM_LINKS: PodcastPlatformLink[] = [
  {
    href: "https://open.spotify.com/show/1qCTySbRctOad9Oi3FGpoF",
    label: "Spotify",
    ariaLabel: "Listen on Spotify",
    iconName: "spotify",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    href: "https://www.deezer.com/en/show/1002678961",
    label: "Deezer",
    ariaLabel: "Listen on Deezer",
    iconName: "deezer",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    href: "https://www.youtube.com/channel/UCD7MQkWw4P5Pd5xA_o6McLg",
    label: "YouTube",
    ariaLabel: "Listen on YouTube",
    iconName: "simple-icons:youtube",
    target: "_blank",
    rel: "noopener noreferrer",
  },
];

export const PODCAST_PLATFORM_URLS = PODCAST_PLATFORM_LINKS.map((link) => link.href);

export const PODCAST_PRECONNECT_ORIGINS = [
  "https://open.spotify.com",
  "https://www.deezer.com",
  "https://www.youtube.com",
];
