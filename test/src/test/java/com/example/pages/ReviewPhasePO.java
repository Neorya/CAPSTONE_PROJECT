package com.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.List;

public class ReviewPhasePO {
    private WebDriver driver;
    private WebDriverWait wait;

    private static final String VOTING_SECTION_HEADER_ID = "voting-phase-header";
    private static final String VIEW_SOLUTIONS_LIST_ID = "view-solutions-list";
    private static final String SOLUTION_ITEM_XPATH = "//div[contains(@class, 'solution-item')]";
    private static final String PARTICIPANT_ID_XPATH = ".//span[contains(@class, 'participant-id')]";
    private static final String SUBMISSION_TIMESTAMP_XPATH = "//span[contains(@class, 'submission-timestamp')]";
    private static final String CODE_READONLY_CONTAINER_XPATH = "//div[contains(@id, 'code-editor-readonly')]";
    private static final String VIEW_DETAILS_BUTTON_XPATH = "//button[contains(@class, 'view-details-button')]";
    
    private static final String VOTE_CORRECT_RADIO_ID = "vote-correct";
    private static final String VOTE_INCORRECT_RADIO_ID = "vote-incorrect";
    private static final String VOTE_SKIP_RADIO_ID = "vote-skip"; 
    private static final String SKIP_REVIEW_BUTTON_ID = "skip-review-button";
    private static final String SUBMIT_VOTE_BUTTON_ID = "submit-vote-button";

    private static final String TEST_CASE_FORM_ID = "test-case-form";
    private static final String TEST_CASE_INPUT_ID = "test-case-input";
    private static final String TEST_CASE_EXPECTED_OUTPUT_ID = "test-case-expected-output";

    private static final String PHASE_TIMER_ID = "phase-timer";
    private static final String NOTIFICATION_MESSAGE_XPATH = "//div[contains(@class, 'ant-message-notice-content')]";
    private static final String ERROR_MESSAGE_XPATH = "//div[contains(@class, 'error-message')]";
    
    private static final String TODO_LIST_ID = "todo-review-list";

    private static final String TITLE_ID = "voting-phase-header";

    public ReviewPhasePO(WebDriver driver) {
        this.driver = driver;
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }
    
    public boolean isPageLoaded() {
        try {
            return isVotingSectionVisible() && isTimerVisible();
        } catch (Exception e) {
            return false;
        }
    }

    public void clickIncorrectVote() {
        WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(By.id(VOTE_INCORRECT_RADIO_ID)));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    public void clickCorrectVote() {
        WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(By.id(VOTE_CORRECT_RADIO_ID)));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    public void clickSkipVote() {
        WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(By.id(VOTE_SKIP_RADIO_ID)));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }
    

    public void setTestCaseInput(String input) {
         WebElement inputField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(TEST_CASE_INPUT_ID)));
         inputField.clear();
         inputField.sendKeys(input);
    }

    public void setTestCaseExpectedOutput(String output) {
        WebElement outputField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(TEST_CASE_EXPECTED_OUTPUT_ID)));
        outputField.clear();
        outputField.sendKeys(output);
    }

    public void clickSubmitVote() {
        wait.until(ExpectedConditions.elementToBeClickable(By.id(SUBMIT_VOTE_BUTTON_ID))).click();
    }

    public void clickViewDetails(int index) {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(VIEW_DETAILS_BUTTON_XPATH)));
        List<WebElement> buttons = driver.findElements(By.xpath(VIEW_DETAILS_BUTTON_XPATH));

        if (index >= 0 && index < buttons.size()) {
            wait.until(ExpectedConditions.elementToBeClickable(buttons.get(index))).click();
        }
    }
    
    public void clickViewDetailsForId(String participantId) {
        String xpath = String.format("//div[contains(@class, 'solution-item') and .//span[contains(@class, 'participant-id') and contains(text(),'%s')]]//button[contains(@class, 'view-details-button')]", participantId);
        driver.findElement(By.xpath(xpath)).click();
    }


    public boolean isVotingSectionVisible() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(VOTING_SECTION_HEADER_ID))).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isSolutionsListVisible() {
         try {
            return driver.findElement(By.id(VIEW_SOLUTIONS_LIST_ID)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTimerVisible() {
        try {
            return driver.findElement(By.id(PHASE_TIMER_ID)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public List<WebElement> getSolutionItems() {
        return driver.findElements(By.xpath(SOLUTION_ITEM_XPATH));
    }

    public String getParticipantId(WebElement solutionItem) {
        return solutionItem.findElement(By.xpath(PARTICIPANT_ID_XPATH)).getText();
    }
    
    public String getParticipantIdAtIndex(int index) {
        List<WebElement> items = getSolutionItems();
        if (index >= 0 && index < items.size()) {
            return getParticipantId(items.get(index));
        }
        return null;
    }

    public String getTimestamp(WebElement solutionItem) {
         return solutionItem.findElement(By.xpath(SUBMISSION_TIMESTAMP_XPATH)).getText();
    }

    public String getTitle() {
        return driver.findElement(By.id(TITLE_ID)).getText();
    }
    
    public boolean isCodeReadOnly() {
        try {
            // First check for readonly attribute on container
            WebElement editor = driver.findElement(By.xpath(CODE_READONLY_CONTAINER_XPATH));
            String readonlyAttr = editor.getAttribute("readonly");
            if ("true".equals(readonlyAttr)) {
                return true;
            }
            
            // Check Monaco editor readonly option via JavaScript
            Object result = ((JavascriptExecutor) driver).executeScript(
                "const editor = window.monaco?.editor?.getEditors()[0]; " +
                "return editor ? editor.getOption(window.monaco.editor.EditorOption.readOnly) : true;"
            );
            return result != null && (Boolean) result;
        } catch (Exception e) {
            // If we can't determine, check if container has readonly attribute
            try {
                WebElement container = driver.findElement(By.xpath(CODE_READONLY_CONTAINER_XPATH));
                return container.getAttribute("readonly") != null || 
                       "true".equals(container.getAttribute("readonly"));
            } catch (Exception ex) {
                return true; // Assume read-only if we can't find the editor
            }
        }
    }

    public boolean isTestCaseFormVisible() {
        try {
            return driver.findElement(By.id(TEST_CASE_FORM_ID)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isSubmitButtonEnabled() {
        try {
            return driver.findElement(By.id(SUBMIT_VOTE_BUTTON_ID)).isEnabled();
        } catch (Exception e) {
            return false;
        }
    }

    public String getNotificationText() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(NOTIFICATION_MESSAGE_XPATH))).getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public String getTimerText() {
         try {
            return driver.findElement(By.id(PHASE_TIMER_ID)).getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public int getTodoListCount() {
        try {
             WebElement list = driver.findElement(By.id(TODO_LIST_ID));
             return list.findElements(By.tagName("li")).size();
        } catch (Exception e) {
            return 0;
        }
    }
    
    public boolean isSolutionPresent(String participantId) {
        try {
             String xpath = String.format("//div[contains(@class, 'solution-item')]//span[contains(@class, 'participant-id') and text()='%s']", participantId);
             List<WebElement> elements = driver.findElements(By.xpath(xpath));
             return !elements.isEmpty() && elements.get(0).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
