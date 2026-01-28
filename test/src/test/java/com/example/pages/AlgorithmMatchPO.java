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

    private static final String PAGE_TITLE_XPATH = "//*[@data-testid='phase1-title']";
    private static final String TIMER_XPATH = "//*[@data-testid='phase1-timer']";
    private static final String PROBLEM_TAB_XPATH = "//div[text()='Problem Description']";
    private static final String TESTS_TAB_XPATH = "//div[contains(text(), 'Tests')]";
    private static final String ANT_SELECT_SELECTOR = "//div[contains(@class, 'ant-select-selector')]";
    private static final String EDITOR_XPATH = "//div[contains(@class, 'ace_content')]";
    private static final String RUN_PUBLIC_TESTS_BTN_XPATH = "//button[contains(., 'Run Public Tests')]";
    private static final String CUSTOM_INPUTS_BTN_XPATH = "//button[contains(., 'Test My Custom Inputs')]";
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
            boolean titleVisible = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(PAGE_TITLE_XPATH))).isDisplayed();
            boolean timerVisible = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TIMER_XPATH))).isDisplayed();
            return titleVisible && timerVisible;
        } catch (Exception e) {
            return false;
        }
    }

    public void setEditorCode(String code) {
        WebElement editor = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(EDITOR_XPATH)));
        // Focus the editor first
        editor.click();
        
        // Use JavaScript to set the value in Monaco editor model efficiently
        org.openqa.selenium.JavascriptExecutor js = (org.openqa.selenium.JavascriptExecutor) driver;
        String script = "var editors = document.querySelectorAll('.monaco-editor');" +
                       "if(editors.length > 0) {" +
                       "  var editor = monaco.editor.getModels()[0];" +
                       "  if(editor) { editor.setValue(arguments[0]); }" +
                       "}";
        js.executeScript(script, code);
    }

    public String getEditorCode() {
        org.openqa.selenium.JavascriptExecutor js = (org.openqa.selenium.JavascriptExecutor) driver;
        String script = "var model = monaco.editor.getModels()[0];" +
                       "return model ? model.getValue() : '';";
        return (String) js.executeScript(script);
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
        // Click the Ant Design Select component
        WebElement selectTrigger = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(ANT_SELECT_SELECTOR)));
        selectTrigger.click();
        
        // Wait for the dropdown option to be visible and click it
        String optionXpath = "//div[contains(@class, 'ant-select-item-option-content')][text()='" + language + "']";
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(optionXpath))).click();
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

        inputField.sendKeys(org.openqa.selenium.Keys.chord(org.openqa.selenium.Keys.CONTROL, "a"), org.openqa.selenium.Keys.BACK_SPACE);
        inputField.sendKeys(input);
        
        outputField.sendKeys(org.openqa.selenium.Keys.chord(org.openqa.selenium.Keys.CONTROL, "a"), org.openqa.selenium.Keys.BACK_SPACE);
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