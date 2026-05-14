const GITHUB_REPOSITORY_URL_REGEX = /^(https?:\/\/)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?(\.git)?$/;

export function isValidGitHubRepositoryUrl(value: string) {
  return GITHUB_REPOSITORY_URL_REGEX.test(value.trim());
}

export function validateGitHubRepositoryUrl(value: string) {
  const repositoryUrl = value.trim();

  if (!repositoryUrl) {
    return {
      isValid: false,
      message: "Please enter a GitHub repository URL.",
    };
  }

  if (!isValidGitHubRepositoryUrl(repositoryUrl)) {
    return {
      isValid: false,
      message: "Enter a valid GitHub repository URL, for example https://github.com/owner/repo.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
}
