import posthog from 'posthog-js';

const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (!key || !host) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_KEY or VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once both variables are configured'
    );
  }
} else {
  posthog.init(key, {
    api_host: host,
    defaults: '2026-05-30',
  });
}

export default posthog;
