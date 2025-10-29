/**
 * Safe Fathom Analytics Loader
 * Provides stub fallback if Fathom CDN fails to load
 */
(function () {
  'use strict';

  try {
    if (typeof window === 'undefined') {
      return;
    }

    // Stub fallback for Fathom if script fails to load
    if (typeof window.fathom === 'undefined') {
      window.fathom = {
        trackPageview: function () {},
        trackGoal: function () {},
        trackEvent: function () {},
        enableTrackingForMe: function () {},
        blockTrackingForMe: function () {},
        isTrackingEnabled: function () { return false; },
        setSite: function () {},
        beacon: function () {}
      };
    }
  } catch (e) {
    // Silent failure
  }
})();
