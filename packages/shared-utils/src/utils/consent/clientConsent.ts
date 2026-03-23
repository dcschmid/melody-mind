import { CONSENT_EVENTS, dispatchCustomEvent } from "../../constants/events";
import { RUNTIME_FLAGS, STORAGE_KEYS } from "../../constants/storage";
import { safeLocalStorage } from "../storage/safeStorage";
import { isServer } from "../environment";

export interface ConsentPreference {
  essential: true;
  analytics: boolean;
  date: number;
}

const CONSENT_STORAGE_KEY = STORAGE_KEYS.COOKIE_CONSENT;
const RUNTIME_ANALYTICS_FLAG = RUNTIME_FLAGS.ANALYTICS_ALLOWED;

export const isConsentPreference = (value: unknown): value is ConsentPreference => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ConsentPreference>;
  return (
    candidate.essential === true &&
    typeof candidate.analytics === "boolean" &&
    typeof candidate.date === "number"
  );
};

export const readConsentPreference = (): ConsentPreference | null => {
  const parsed = safeLocalStorage.get<unknown>(CONSENT_STORAGE_KEY, null);
  return isConsentPreference(parsed) ? parsed : null;
};

export const writeConsentPreference = (
  analyticsEnabled: boolean,
  timestamp = Date.now()
): ConsentPreference => {
  const consent: ConsentPreference = {
    essential: true,
    analytics: analyticsEnabled,
    date: timestamp,
  };

  safeLocalStorage.set(CONSENT_STORAGE_KEY, consent);
  return consent;
};

export const setRuntimeAnalyticsAllowed = (enabled: boolean): void => {
  if (isServer) {
    return;
  }

  window[RUNTIME_ANALYTICS_FLAG] = enabled;
};

export const getRuntimeAnalyticsAllowed = (): boolean => {
  if (isServer) {
    return false;
  }

  return window[RUNTIME_ANALYTICS_FLAG] === true;
};

export const getDoNotTrackEnabled = (): boolean => {
  if (isServer) {
    return false;
  }

  const navigatorValue = window.navigator?.doNotTrack;
  const windowValue = window.doNotTrack;
  const legacyMsValue = (window.navigator as Navigator & { msDoNotTrack?: string })
    ?.msDoNotTrack;

  return navigatorValue === "1" || windowValue === "1" || legacyMsValue === "1";
};

export const dispatchConsentChange = (
  consent: ConsentPreference,
  dntEnabled: boolean
): void => {
  dispatchCustomEvent(CONSENT_EVENTS.CHANGED, {
    consent,
    dntEnabled,
  });
};
