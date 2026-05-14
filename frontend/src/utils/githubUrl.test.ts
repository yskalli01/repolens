import { describe, expect, it } from "vitest";

import { isValidGitHubRepositoryUrl, validateGitHubRepositoryUrl } from "./githubUrl";

describe("githubUrl utilities", () => {
  it("accepts standard GitHub repository URLs", () => {
    expect(isValidGitHubRepositoryUrl("https://github.com/vercel/next.js")).toBe(true);
    expect(isValidGitHubRepositoryUrl("github.com/spring-projects/spring-boot")).toBe(true);
    expect(isValidGitHubRepositoryUrl("https://github.com/openai/openai-java.git")).toBe(true);
  });

  it("rejects invalid or incomplete URLs", () => {
    expect(isValidGitHubRepositoryUrl("https://gitlab.com/vercel/next.js")).toBe(false);
    expect(isValidGitHubRepositoryUrl("https://github.com/vercel")).toBe(false);
    expect(validateGitHubRepositoryUrl("").isValid).toBe(false);
  });
});
