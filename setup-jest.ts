import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// Setup zone.js for testing even though the app uses zoneless change detection
// This is required for Angular TestBed to work properly with Jest
setupZoneTestEnv();
