package com.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class AlgorithmMatchPO {
    private WebDriver driver;
    private WebDriverWait wait;

    private static final String PAGE_TITLE_XPATH = "//div[contains(text(), 'Algorithm Match - Phase 1')]";
    private static final String TIMER_XPATH = "//*[contains(text(), 'Time Remaining')]";
    private static final String PROBLEM_TAB_XPATH = "//div[text()='Problem Description']";
    private static final String TESTS_TAB_XPATH = "//div[contains(text(), 'Tests')]";
    private static final String LANGUAGE_SELECT_XPATH = "//select";
    private static final String EDITOR_XPATH = "//div[contains(@class, 'ace_content')]";
    private static final String RUN_PUBLIC_TESTS_BTN_XPATH = "//button[contains(text(), 'Run Public Tests')]";
    private static final String CUSTOM_INPUTS_BTN_XPATH = "//button[text()='Test My Custom Inputs']";
    private static final String ADD_TEST_BTN_XPATH = "//button[contains(., 'Add New Test Case')]";
    private static final String PUBLIC_TEST_ITEMS_XPATH = "//div[contains(@class, 'test-case-item')]"; 
    private static final String TRASH_ICONS_XPATH = "//i[contains(@class, 'fa-trash')]";
    private static final String SUCCESS_ADD_MESSAGE_XPATH = "//*[text()='Test Is Added']";
    private static final String SUCCESS_DELETE_MESSAGE_XPATH = "//*[text()='Test Is Deleted']";
    private static final String OUTPUT_HEADER_XPATH = "//div[contains(text(), 'Execution Output Windows')]";
    private static final String RESULTS_SUMMARY_XPATH = "//div[contains(text(), 'Test Results:')]";

    private static final String MODAL_CONTAINER_XPATH = "//div[contains(@class, 'modal')]"; 
    private static final String INPUT_FIELD_XPATH = "//label[text()='Input']/following-sibling::input | //label[text()='Input']/following-sibling::textarea";
    private static final String EXPECTED_OUTPUT_FIELD_XPATH = "//label[text()='Expected Output']/following-sibling::input | //label[text()='Expected Output']/following-sibling::textarea";
    private static final String CREATE_TEST_BTN_XPATH = "//button[text()='Create New Test']";

    public AlgorithmMatchPO(WebDriver driver) {
        this.driver = driver;
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }

    
    public boolean isPageLoaded() {
        try {
            return getPageTitle().isDisplayed() && getTimer().isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void setEditorCode(String code) {
        WebElement editor = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(EDITOR_XPATH)));
        editor.clear();
        editor.sendKeys(code);
    }

    public String getEditorCode() {
        WebElement editor = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(EDITOR_XPATH)));
        return editor.getAttribute("value");
    }

    public WebElement getPageTitle() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(PAGE_TITLE_XPATH)));
    }

    public WebElement getTimer() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TIMER_XPATH)));
    }

    public void clickTestsTab() {
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(TESTS_TAB_XPATH))).click();
    }

    public void clickProblemDescriptionTab() {
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(PROBLEM_TAB_XPATH))).click();
    }

    public void selectLanguage(String language) {
        WebElement dropdown = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(LANGUAGE_SELECT_XPATH)));
        Select select = new Select(dropdown);
        select.selectByVisibleText(language);
    }

    public void clickRunPublicTests() {
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(RUN_PUBLIC_TESTS_BTN_XPATH))).click();
    }

    public boolean isRunPublicTestsClickable() {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath(RUN_PUBLIC_TESTS_BTN_XPATH)));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    public void clickAddNewTestCase() {
        clickTestsTab(); 
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(ADD_TEST_BTN_XPATH))).click();
    }

    public void fillAndSubmitTestForm(String input, String expectedOutput) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(MODAL_CONTAINER_XPATH)));
        
        WebElement inputField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(INPUT_FIELD_XPATH)));
        WebElement outputField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(EXPECTED_OUTPUT_FIELD_XPATH)));
        WebElement submitBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(CREATE_TEST_BTN_XPATH)));

        inputField.clear();
        inputField.sendKeys(input);
        
        outputField.clear();
        outputField.sendKeys(expectedOutput);
        
        submitBtn.click();
    }

    public void deleteCustomTest(int index) {
        List<WebElement> bins = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.xpath(TRASH_ICONS_XPATH)));
        if(index < bins.size()) {
            bins.get(index).click();
        }
    }

    public WebElement waitTestAddedMessage() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(SUCCESS_ADD_MESSAGE_XPATH)));
    }

    public WebElement waitTestDeletedMessage() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(SUCCESS_DELETE_MESSAGE_XPATH)));
    }

    public String getResultsSummaryText() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(RESULTS_SUMMARY_XPATH))).getText();
    }

    public boolean isTestPassed(String testLabel) {
        String dynamicPath = "//div[contains(., '" + testLabel + "')]//span[contains(text(), 'Passed')]";
        return !driver.findElements(By.xpath(dynamicPath)).isEmpty();
    }

    public void toggleExecutionOutput() {
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(OUTPUT_HEADER_XPATH))).click();
    }
}