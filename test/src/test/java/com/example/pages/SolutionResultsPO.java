package com.example.pages;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SolutionResultsPO {
    private WebDriver driver;
    private WebDriverWait wait;

    private static final String CONTAINER_ID = "solution-results-container";
    private static final String HEADER_ID = "solution-results-header";
    private static final String PAGE_TITLE_CLASS = "page-title-solution";
    private static final String CODE_BLOCK_ID = "solution-code-block";
    private static final String SCORE_DISPLAY_ID = "score-display";
    private static final String TOTAL_SCORE_ID = "total-score-value";
    private static final String PUBLIC_TESTS_ID = "public-teacher-tests";
    private static final String PRIVATE_TESTS_ID = "private-teacher-tests";
    private static final String STUDENT_TESTS_ID = "student-provided-tests";
    private static final String RETURN_HOME_BUTTON_ID = "return-home-button";

    public SolutionResultsPO(WebDriver driver) {
        this.driver = driver;
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }

    public boolean isPageLoaded() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.id(CONTAINER_ID))).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void waitForPageLoad() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(CONTAINER_ID)));
    }

    public String getPageTitle() {
        try {
            WebElement titleElement = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.className(PAGE_TITLE_CLASS)));
            return titleElement.getText();
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isHeaderVisible() {
        try {
            return driver.findElement(By.id(HEADER_ID)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isCodeBlockVisible() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.id(CODE_BLOCK_ID))).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getCodeBlockTitle() {
        try {
            WebElement codeBlock = driver.findElement(By.id(CODE_BLOCK_ID));
            WebElement title = codeBlock.findElement(By.className("code-block-title"));
            return title.getText();
        } catch (Exception e) {
            return null;
        }
    }

    public boolean hasSyntaxHighlighting() {
        try {
            WebElement codeBlock = driver.findElement(By.id(CODE_BLOCK_ID));
            WebElement highlightedCode = codeBlock.findElement(By.cssSelector("pre[class*='language-']"));
            return highlightedCode != null && highlightedCode.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getCodeContent() {
        try {
            WebElement codeBlock = driver.findElement(By.id(CODE_BLOCK_ID));
            WebElement codeElement = codeBlock.findElement(By.tagName("code"));
            return codeElement.getText();
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isScoreDisplayVisible() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.id(SCORE_DISPLAY_ID))).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getTotalScoreText() {
        try {
            WebElement scoreValue = driver.findElement(By.id(TOTAL_SCORE_ID));
            return scoreValue.getText();
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isPublicTeacherTestsSectionVisible() {
        try {
            return driver.findElement(By.id(PUBLIC_TESTS_ID)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isPrivateTeacherTestsSectionVisible() {
        try {
            return driver.findElement(By.id(PRIVATE_TESTS_ID)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isStudentTestsSectionVisible() {
        try {
            return driver.findElement(By.id(STUDENT_TESTS_ID)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getPublicTestsSectionHeader() {
        try {
            WebElement section = driver.findElement(By.id(PUBLIC_TESTS_ID));
            return section.findElement(By.className("section-header")).getText();
        } catch (Exception e) {
            return null;
        }
    }

    public String getPrivateTestsSectionHeader() {
        try {
            WebElement section = driver.findElement(By.id(PRIVATE_TESTS_ID));
            return section.findElement(By.className("section-header")).getText();
        } catch (Exception e) {
            return null;
        }
    }

    public String getStudentTestsSectionHeader() {
        try {
            WebElement section = driver.findElement(By.id(STUDENT_TESTS_ID));
            return section.findElement(By.className("section-header")).getText();
        } catch (Exception e) {
            return null;
        }
    }

    public List<WebElement> getPublicTestResults() {
        try {
            WebElement section = driver.findElement(By.id(PUBLIC_TESTS_ID));
            return section.findElements(By.cssSelector("[data-testid^='test-result-']"));
        } catch (Exception e) {
            return List.of();
        }
    }

    public List<WebElement> getPrivateTestResults() {
        try {
            WebElement section = driver.findElement(By.id(PRIVATE_TESTS_ID));
            return section.findElements(By.cssSelector("[data-testid^='test-result-']"));
        } catch (Exception e) {
            return List.of();
        }
    }

    public List<WebElement> getStudentTestResults() {
        try {
            WebElement section = driver.findElement(By.id(STUDENT_TESTS_ID));
            return section.findElements(By.cssSelector("[data-testid^='test-result-']"));
        } catch (Exception e) {
            return List.of();
        }
    }

    public WebElement getTestResultByNumber(String sectionId, int testNumber) {
        try {
            WebElement section = driver.findElement(By.id(sectionId));
            return section.findElement(By.cssSelector("[data-testid='test-result-" + testNumber + "']"));
        } catch (Exception e) {
            return null;
        }
    }

    public String getTestInput(WebElement testResult) {
        try {
            return testResult.findElement(By.className("test-input")).getText();
        } catch (Exception e) {
            return null;
        }
    }

    public String getTestExpectedOutput(WebElement testResult) {
        try {
            return testResult.findElement(By.className("test-expected")).getText();
        } catch (Exception e) {
            return null;
        }
    }

    public String getTestActualOutput(WebElement testResult) {
        try {
            WebElement failureDetails = testResult.findElement(By.className("test-failure-details"));
            return failureDetails.findElement(By.className("failure-output")).getText();
        } catch (Exception e) {
            return null;
        }
    }

    public String getTestStatus(WebElement testResult) {
        try {
            return testResult.findElement(By.className("test-status-text")).getText();
        } catch (Exception e) {
            return null;
        }
    }

    public String getTestStatusIcon(WebElement testResult) {
        try {
            WebElement statusIcon = testResult.findElement(By.cssSelector("[data-testid^='test-status-']"));
            return statusIcon.getText();
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isTestPassed(WebElement testResult) {
        try {
            return testResult.getAttribute("class").contains("passed");
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTestFailed(WebElement testResult) {
        try {
            return testResult.getAttribute("class").contains("failed");
        } catch (Exception e) {
            return false;
        }
    }

    public boolean hasPassedIcon(WebElement testResult) {
        try {
            WebElement statusIcon = testResult.findElement(By.cssSelector(".test-status-icon.passed"));
            String iconText = statusIcon.getText();
            return iconText.contains("✓");
        } catch (Exception e) {
            return false;
        }
    }

    public boolean hasFailedIcon(WebElement testResult) {
        try {
            WebElement statusIcon = testResult.findElement(By.cssSelector(".test-status-icon.failed"));
            String iconText = statusIcon.getText();
            return iconText.contains("✗");
        } catch (Exception e) {
            return false;
        }
    }

    public void clickReturnHomeButton() {
        wait.until(ExpectedConditions.elementToBeClickable(By.id(RETURN_HOME_BUTTON_ID))).click();
    }

    public boolean isReturnHomeButtonVisible() {
        try {
            return driver.findElement(By.id(RETURN_HOME_BUTTON_ID)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
