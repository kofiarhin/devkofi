import { vi } from "vitest";

// Mock window.URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/fake-blob-url");

// Mock <a>.click to avoid jsdom navigation error
vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
