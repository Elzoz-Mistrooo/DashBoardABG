// src/utilits/detectDash.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const UAParser = require('ua-parser-js');

export function detectLoginDevice(userAgent) {
  const parser = new UAParser(userAgent);
  const parsed = parser.getResult();
  const deviceType = parsed.device?.type || '';
  const isBrowser = !!parsed.browser?.name;

  if (deviceType === 'mobile' || deviceType === 'tablet') {
    return 'mobile';
  }

  if (!deviceType && isBrowser) {
    return 'browser';
  }

  if (deviceType === 'desktop' && !isBrowser) {
    return 'office';
  }

  return 'backend';
}
