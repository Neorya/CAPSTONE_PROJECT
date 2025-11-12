# GitHub Actions Configuration for Selenium Tests

## Changes Made

### 1. Test Code Updates (`test/src/test/java/com/example/SettingListingTest.java`)

Added headless mode support with the following Chrome options for CI environments:
- `--headless=new` - Run Chrome in headless mode
- `--no-sandbox` - Required for Docker/CI environments
- `--disable-dev-shm-usage` - Overcome limited resource problems
- `--disable-gpu` - Disable GPU hardware acceleration
- `--window-size=1920,1080` - Set window size for consistent tests

The test automatically detects CI environment via:
- System property: `-Dheadless=true`
- Environment variable: `CI=true`

### 2. GitHub Actions Workflows Created

#### Option 1: `test.yml` - Direct Setup
Sets up all services directly in GitHub Actions:
- ✅ PostgreSQL service container
- ✅ Python API server
- ✅ React frontend
- ✅ Chrome & ChromeDriver
- ✅ Runs Maven tests
- ✅ Uploads test reports as artifacts

**Pros:** Faster startup, more granular control
**Cons:** More complex configuration

#### Option 2: `test-docker.yml` - Docker Compose
Uses your existing `docker-compose.yml`:
- ✅ Simpler configuration
- ✅ Matches local environment exactly
- ✅ Still uploads test reports

**Pros:** Simpler, matches local setup
**Cons:** Slightly slower due to image builds

## Usage

### Running Locally in Headless Mode
```bash
cd test
mvn clean test -Dheadless=true
```

### Running Locally with UI (Default)
```bash
cd test
mvn clean test
```

### In GitHub Actions
Tests will automatically run in headless mode when:
- Code is pushed to `main` or `develop` branches
- Pull requests are created
- Manually triggered via "Actions" tab

## Test Reports

After each test run, GitHub Actions will:
1. Upload test reports to **Artifacts** (available for 30 days)
2. Upload screenshots on failure (available for 7 days)

Access artifacts from:
- GitHub Actions run page → Scroll to bottom → "Artifacts" section

## Important Notes

1. **Application must be running**: Tests expect frontend at `http://localhost:3000`
2. **Chrome version**: GitHub Actions uses Chrome stable version
3. **Database**: PostgreSQL is initialized with your `init.sql` script
4. **Timeouts**: Adjusted wait times for CI environment startup

## Troubleshooting

If tests fail in CI but pass locally:
1. Check service logs in GitHub Actions output
2. Verify application startup times (may need to increase sleep/wait times)
3. Check ChromeDriver version compatibility warnings
4. Download test reports artifact for detailed failure info

## Next Steps

1. Choose either `test.yml` or `test-docker.yml` (delete the other)
2. Update branch names if you use different branches
3. Adjust wait times if services need longer to start
4. Consider adding test result reporting (e.g., GitHub Status Checks)
