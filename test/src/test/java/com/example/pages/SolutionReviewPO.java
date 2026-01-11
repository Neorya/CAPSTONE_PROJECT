package com.example.tests;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
 
public class SolutionReviewPO {
 
    private WebDriver driver;
    private WebDriverWait wait;
 
    private static final String PAGE_TITLE_XPATH = "//h1[contains(@class, 'ant-typography') or contains(text(), 'Solution Review - Game Session:')]"; 
    private static final String TOTAL_SCORE_XPATH = "//div[contains(@class, 'ant-card')]//span[contains(text(), 'Total Score')]";
    private static final String PAGE_STUDENT_ICON_XPATH = "//*[@id='iconID']";
    
    private static final String CODE_CONTAINER_XPATH = "//div[contains(@class, 'code-view-wrapper')]"; 
    private static final String CODE_KEYWORD_VOID_XPATH = "//code//span[text()='void']";
 
    private static final String PUBLIC_TESTS_HEADER_XPATH = "//div[contains(@class, 'ant-list-header') and contains(text(), 'PUBLIC TEACHER TESTS')]";
    private static final String PRIVATE_TESTS_HEADER_XPATH = "//div[contains(@class, 'ant-list-header') and contains(text(), 'PRIVATE TEACHER TESTS')]";
    private static final String STUDENT_TESTS_HEADER_XPATH = "//div[contains(@class, 'ant-list-header') and contains(text(), 'STUDENT PROVIDED TESTS')]";
 
    private static final String LIST_ITEM_BASE_XPATH = "//li[contains(@class, 'ant-list-item')]";
    private static final String ICON_PASSED_XPATH = ".//span[contains(@class, 'anticon-check-circle')]";
    private static final String ICON_FAILED_XPATH = ".//span[contains(@class, 'anticon-close-circle')]";
    private static final String STATUS_PASSED_TEXT_XPATH = ".//span[contains(@class, 'ant-typography-success') or text()='Passed']";
    private static final String STATUS_FAILED_TEXT_XPATH = ".//span[contains(@class, 'ant-typography-danger') or text()='Failed']";
 
    public SolutionReviewPO(WebDriver driver) {
        this.driver = driver;
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }
 
    public boolean isPageLoaded() {
         return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(PAGE_TITLE_XPATH))).isDisplayed();
    }
 
    public WebElement getTotalScoreElement() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TOTAL_SCORE_XPATH)));
    }

    public WebElement getStudentIcon() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(PAGE_STUDENT_ICON_XPATH)));
    }
    
    public WebElement getCodeBox() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(CODE_CONTAINER_XPATH)));
    }
    
    public WebElement getCode() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(CODE_KEYWORD_VOID_XPATH)));
    }
    
    public boolean isPrivateTestsSectionVisible() {
        return driver.findElement(By.xpath(PRIVATE_TESTS_HEADER_XPATH)).isDisplayed();
    }
    
    public boolean isStudentsTestsSectionVisible() {
        return driver.findElement(By.xpath(STUDENT_TESTS_HEADER_XPATH)).isDisplayed();
    }

    public boolean isPublicTestsSectionVisible() {
        return driver.findElement(By.xpath(PUBLIC_TESTS_HEADER_XPATH)).isDisplayed();
    }
 
    public WebElement getTestCaseByContent(String contentSnippet) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.xpath(LIST_ITEM_BASE_XPATH + "[contains(., '" + contentSnippet + "')]")
        ));
    }
 
    public boolean isTestPassed(WebElement testCaseElement) {
        try {
            boolean hasIcon = testCaseElement.findElement(By.xpath(ICON_PASSED_XPATH)).isDisplayed();
            boolean hasSuccesText = testCaseElement.findElement(By.xpath(STATUS_PASSED_TEXT_XPATH)).isDisplayed();
            return hasIcon &&  hasSuccesText;
        } catch (Exception e) {
            return false;
        }
    }
 
    public boolean isTestFailed(WebElement testCaseElement) {
        try {
            boolean hasIcon = testCaseElement.findElement(By.xpath(ICON_FAILED_XPATH)).isDisplayed();
            boolean hasErrorText = testCaseElement.findElement(By.xpath(STATUS_FAILED_TEXT_XPATH)).isDisplayed();
            return hasIcon && hasErrorText;
        } catch (Exception e) {
            return false;
        }
    }
}