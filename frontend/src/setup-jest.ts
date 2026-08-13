/**
 * Jest setup — runs once per test file, before any spec.
 * Required by jest-preset-angular to bootstrap Angular's testing environment.
 */
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();
