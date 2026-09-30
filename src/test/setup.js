import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Unmount what each test rendered (Vitest has no global afterEach for Testing Library to hook into)
afterEach(() => cleanup());
