import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setupTests.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
      include: [
        "src/Pages/Home/**",
        "src/Pages/contact/**",
        "src/Pages/CourseOutline/**",
        "src/Pages/JoinMentorship/**",
        "src/Pages/Login/**",
        "src/components/Header/**",
        "src/hooks/useContactMutation.js",
        "src/hooks/useGithubInfoQuery.js",
        "src/hooks/useJoinNewsletterMutation.js",
        "src/hooks/useLoginMutation.js",
        "src/hooks/useMentorshipMutation.js",
        "src/hooks/useStudentData.js",
      ],
    },
    css: false,
  },
});
