# GitHub Workflows

This directory contains GitHub Actions workflows for the `tan-pagination` library. These workflows provide continuous integration, automated testing, security checks, and release automation.

## Workflows Overview

### 1. CI (Continuous Integration) - `ci.yml`

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Features:**
- Tests across multiple Node.js versions (16.x, 18.x, 20.x)
- Runs linting and tests
- Builds the package
- Uploads coverage reports to Codecov
- Creates build artifacts

### 2. Release - `release.yml`

**Triggers:**
- Push of tags matching `v*` pattern (e.g., `v1.0.0`)

**Features:**
- Runs full test suite
- Publishes package to npm
- Creates GitHub release with changelog
- Automated versioning

### 3. PR Checks - `pr-checks.yml`

**Triggers:**
- Pull request events (opened, synchronized, reopened)

**Features:**
- Linting and formatting checks
- Test coverage validation (minimum 80%)
- Build verification
- Bundle size monitoring (max 50KB)
- Security audit

### 4. CodeQL Analysis - `codeql.yml`

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` branch
- Weekly schedule (Monday 1:30 AM)

**Features:**
- Static code analysis for security vulnerabilities
- JavaScript/TypeScript code scanning
- Automated security alerts

### 5. Dependency Updates - `dependency-update.yml`

**Triggers:**
- Weekly schedule (Monday 2:00 AM)
- Manual trigger via workflow_dispatch

**Features:**
- Automated dependency updates (minor/patch versions)
- Security vulnerability scanning
- Creates pull requests for updates
- Runs tests before proposing changes

## Required Secrets

To use these workflows effectively, you need to configure the following secrets in your GitHub repository:

### NPM_TOKEN
Required for publishing to npm registry.

1. Create an npm account and login
2. Generate an automation token: `npm token create --type=automation`
3. Add the token as `NPM_TOKEN` in GitHub repository secrets

### CODECOV_TOKEN (Optional)
Required for uploading coverage reports to Codecov.

1. Sign up at [codecov.io](https://codecov.io)
2. Add your repository
3. Copy the upload token
4. Add as `CODECOV_TOKEN` in GitHub repository secrets

## Workflow Permissions

Some workflows require specific permissions:

- **GITHUB_TOKEN**: Automatically provided by GitHub
- **Contents**: Read access for checkout, write for creating releases
- **Security-events**: Write access for CodeQL analysis
- **Actions**: Read access for workflow execution

## Usage Examples

### Creating a Release

1. Update version in `package.json`
2. Update `CHANGELOG.md` with new changes
3. Commit changes to `main` branch
4. Create and push a tag:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
5. The release workflow will automatically publish to npm and create a GitHub release

### Manual Dependency Update

You can manually trigger dependency updates:

1. Go to Actions tab in GitHub repository
2. Select "Dependency Update" workflow
3. Click "Run workflow"
4. Choose the branch and click "Run workflow"

### Monitoring Workflows

- Check the "Actions" tab in your GitHub repository
- View workflow runs, logs, and results
- Set up notifications for failed workflows
- Monitor security alerts from CodeQL

## Branch Protection Rules

For optimal security and quality, consider setting up branch protection rules:

```yaml
# Example branch protection for main branch
main:
  required_status_checks:
    - CI (16.x)
    - CI (18.x) 
    - CI (20.x)
    - lint-and-format
    - test-coverage
    - build-check
    - size-check
    - dependency-audit
  enforce_admins: true
  required_pull_request_reviews:
    required_approving_review_count: 1
    dismiss_stale_reviews: true
```

## Troubleshooting

### Common Issues

1. **npm publish fails**: Check NPM_TOKEN secret and package name availability
2. **Tests fail in CI**: Ensure all tests pass locally first
3. **Coverage below threshold**: Add more tests to increase coverage
4. **Bundle size too large**: Optimize imports and dependencies
5. **Security vulnerabilities**: Run `npm audit fix` and update dependencies

### Debug Steps

1. Check workflow logs in GitHub Actions
2. Run commands locally to reproduce issues
3. Verify secrets are configured correctly
4. Ensure package.json scripts work locally
5. Check for dependency conflicts

## Contributing

When adding new workflows:

1. Test workflows in a fork first
2. Add appropriate documentation
3. Consider security implications
4. Use official GitHub Actions when possible
5. Add error handling and meaningful output 