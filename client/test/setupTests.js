import * as React from 'react';
import '@testing-library/jest-dom';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Framer Motion's whileInView requires IntersectionObserver, which jsdom doesn't provide
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
