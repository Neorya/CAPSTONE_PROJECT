package com.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class AlgorithmMatchPO {
    private WebDriver driver;
    private WebDriverWait wait;

    // Page title and timer - using Ant Design Typography
    private static final String PAGE_TITLE_XPATH = "//h2[contains(@class, 'page-title-text')] | //h2[contains(text(), 'Algorithm Match')]";
    private static final String TIMER_XPATH = "//span[contains(@class, 'timer-text')] | //*[contains(text(), 'Time Remaining')]";
    
    // Tabs - Ant Design Tabs structure
    private static final String PROBLEM_TAB_XPATH = "//div[contains(@class, 'ant-tabs-tab')]//div[contains(text(), 'Problem')]";
    private static final String TESTS_TAB_XPATH = "//div[contains(@class, 'ant-tabs-tab')]//div[contains(text(), 'Tests')]";
    
    // Language select - Ant Design Select
    private static final String LANGUAGE_SELECT_XPATH = "//div[contains(@class, 'ant-select')]";
    private static final String LANGUAGE_OPTION_XPATH = "//div[contains(@class, 'ant-select-item-option')]";
    
    // Editor - Monaco editor
    private static final String EDITOR_CONTAINER_XPATH = "//div[contains(@class, 'monaco-editor')]";
    
    // Buttons
    private static final String RUN_PUBLIC_TESTS_BTN_XPATH = "//button[.//span[contains(text(), 'Run Public Tests')]]";
    private static final String CUSTOM_INPUTS_BTN_XPATH = "//button[.//span[contains(text(), 'Test My Custom Inputs')]]";
    private static final String ADD_TEST_BTN_XPATH = "//button[.//span[contains(text(), 'Add New Test Case')]]";
    
    // Test items and delete
    private static final String PUBLIC_TEST_ITEMS_XPATH = "//div[contains(@class, 'test-case-item-container')]"; 
    private static final String TRASH_ICONS_XPATH = "//button[.//span[@aria-label='delete']] | //span[contains(@class, 'anticon-delete')]/ancestor::button";
    
    // Success messages - Ant Design message or custom success-message div
    private static final String SUCCESS_ADD_MESSAGE_XPATH = "//*[contains(@class, 'success-message')] | //*[contains(@class, 'ant-message-success')]";
    private static final String SUCCESS_DELETE_MESSAGE_XPATH = "//*[contains(@class, 'success-message')] | //*[contains(@class, 'ant-message-success')]";
    
    // Output/Results section - Collapse panel with results-collapse class
    private static final String OUTPUT_COLLAPSE_XPATH = "//div[contains(@class, 'results-collapse')]//div[contains(@class, 'ant-collapse-header')]";
    private static final String RESULTS_SUMMARY_XPATH = "//div[contains(@class, 'run-results-header')] | //div[contains(@class, 'results-collapse')]//*[contains(text(), 'Test Results')] | //div[contains(@class, 'results-collapse')]//*[contains(text(), 'Passed')] | //div[contains(@class, 'results-collapse')]//*[contains(text(), 'Failed')] | //div[contains(@class, 'results-collapse')]//*[contains(text(), 'error')]";
    private static final String OUTPUT_HEADER_XPATH = "//div[contains(@class, 'results-collapse')]//span[contains(@class, 'ant-collapse-header-text')]";

    // Modal - Ant Design Modal
    private static final String MODAL_CONTAINER_XPATH = "//div[contains(@class, 'ant-modal-content')]"; 
    private static final String INPUT_FIELD_XPATH = "//div[contains(@class, 'ant-modal-content')]//label[contains(text(), 'Input')]/following::input[1]";
    private static final String EXPECTED_OUTPUT_FIELD_XPATH = "//div[contains(@class, 'ant-modal-content')]//label[contains(text(), 'Expected')]/following::input[1]";
    private static final String CREATE_TEST_BTN_XPATH = "//div[contains(@class, 'ant-modal-content')]//button[.//span[contains(text(), 'Create')]]";
    
    private static final String COLLAPSE_CONTENT_XPATH = "//div[contains(@class, 'results-collapse')]//div[contains(@class, 'ant-collapse-content-box')]";

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
        // Monaco editor requires JavaScript to set value
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(EDITOR_CONTAINER_XPATH)));
        String escapedCode = code.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n");
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
            "const editor = window.monaco?.editor?.getEditors()[0]; " +
            "if (editor) { editor.setValue('" + escapedCode + "'); }"
        );
    }

    public String getEditorCode() {
        // Monaco editor requires JavaScript to get value
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(EDITOR_CONTAINER_XPATH)));
        Object result = ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
            "const editor = window.monaco?.editor?.getEditors()[0]; " +
            "return editor ? editor.getValue() : '';"
        );
        return result != null ? result.toString() : "";
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
        // Ant Design Select - click to open dropdown, then select option
        WebElement dropdown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(LANGUAGE_SELECT_XPATH)));
        dropdown.click();
        
        // Wait for dropdown options to appear and click the one matching the language
        WebElement option = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//div[contains(@class, 'ant-select-item-option') and contains(., '" + language + "')]")
        ));
        option.click();
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
        // Wait for the collapse to be expanded and results to appear
        try {
            // First check if collapse content is visible
            WebElement content = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(COLLAPSE_CONTENT_XPATH)));
            return content.getText();
        } catch (Exception e) {
            // Fallback to getting any text in results area
            try {
                return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(RESULTS_SUMMARY_XPATH))).getText();
            } catch (Exception e2) {
                return "";
            }
        }
    }
    
    public void waitForTestResults(int timeoutSeconds) {
        // Wait for loading to finish and results to appear
        long startTime = System.currentTimeMillis();
        long timeout = timeoutSeconds * 1000L;
        
        while (System.currentTimeMillis() - startTime < timeout) {
            try {
                // Check if results collapse content has actual results (not just header)
                WebElement content = driver.findElement(By.xpath(COLLAPSE_CONTENT_XPATH));
                String text = content.getText();
                if (text.contains("Passed") || text.contains("Failed") || text.contains("error") || text.contains("Error")) {
                    return;
                }
            } catch (Exception e) {
                // Content not visible yet
            }
            try { Thread.sleep(500); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        }
    }
    
    public boolean isCollapseExpanded() {
        try {
            WebElement collapseItem = driver.findElement(By.xpath("//div[contains(@class, 'results-collapse')]//div[contains(@class, 'ant-collapse-item')]"));
            String className = collapseItem.getAttribute("class");
            return className != null && className.contains("ant-collapse-item-active");
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTestPassed(String testLabel) {
        String dynamicPath = "//div[contains(., '" + testLabel + "')]//span[contains(text(), 'Passed')]";
        return !driver.findElements(By.xpath(dynamicPath)).isEmpty();
    }

    public void toggleExecutionOutput() {
        WebElement collapseHeader = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(OUTPUT_COLLAPSE_XPATH)));
        collapseHeader.click();
        // Wait a moment for the collapse animation
        try { Thread.sleep(500); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}