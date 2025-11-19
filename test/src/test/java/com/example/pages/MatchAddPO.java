package com.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

/**
 * Page Object for the Create Match page.
 * Handles all element interactions on the match creation form.
 */
public class MatchAddPO {
    private WebDriver driver;
    private WebDriverWait wait;
    
    // Locators
    private static final String PAGE_TITLE_CSS = "h2";
    private static final String BACK_TO_HOME_BUTTON_ID = "back-to-home-button";
    private static final String TITLE_INPUT_ID = "title-input";
    private static final String DIFFICULTY_SELECT_ID = "difficulty-select";
    private static final String REV_NUMBER_INPUT_ID = "reviewers-input";
    private static final String DURATION_FIRST_INPUT_ID = "first-phase-duration-input";
    private static final String DURATION_SECOND_INPUT_ID = "second-phase-duration-input";
    private static final String SAVE_MATCH_BUTTON_ID = "save-match-button";
    private static final String RESET_BUTTON_ID = "reset-button";
    private static final String MATCH_SETTINGS_RADIO_GROUP_ID = "match-settings-radio-group";
    private static final String MATCH_SETTINGS_LIST_CSS = ".match-settings-scrollable .ant-space-vertical";
    private static final String TITLE_ERROR_ID = "title_help";
    private static final String REV_NUMBER_ERROR_ID = "review_number_help";
    private static final String DURATION_FIRST_ERROR_ID = "duration_phase1_help";
    private static final String DURATION_SECOND_ERROR_ID = "duration_phase2_help";
    
    public MatchAddPO(WebDriver driver) {
        this.driver = driver;
        // Use longer timeout in CI environments
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }
    
    // Actions
    public void setMatchTitle(String title) {
        getTitleInput().clear();
        getTitleInput().sendKeys(title);
    }
    
    public void clickCreateButton() {
        getCreateButton().click();
    }
    
    public void clickCancelButton() {
        getCancelButton().click();
    }
    
    public void clickBackToHomeButton() {
        getBackToHomeButton().click();
    }
    
    public void clickMatchSettingAtIndex(int index) {
        getMatchSettingAtIndex(index).click();
    }
    
    public void setDifficultyLevel(String level) {
        getDifficultyLevelBox().click();
        // Wait for dropdown to open and option to be clickable
        WebElement option = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//div[@class='ant-select-item-option-content' and text()='" + level + "']")
        ));
        option.click();
    }
    
    public void setRevNumber(int revNumber) {
        WebElement revNumberInput = getRevNumber();
        revNumberInput.click();
        revNumberInput.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        revNumberInput.sendKeys(String.valueOf(revNumber));
    }
    
    public void setDurationFirst(int duration) {
        getDurationFirst().clear();
        getDurationFirst().sendKeys(String.valueOf(duration));
    }
    
    public void setDurationSecond(int duration) {
        getDurationSecond().clear();
        getDurationSecond().sendKeys(String.valueOf(duration));
    }
    
    // Element getters
    public WebElement getPageTitle() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(PAGE_TITLE_CSS)));
    }
    
    public WebElement getBackToHomeButton() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(BACK_TO_HOME_BUTTON_ID)));
    }
    
    public WebElement getTitleInput() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(TITLE_INPUT_ID)));
    }
    
    public WebElement getCreateButton() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(SAVE_MATCH_BUTTON_ID)));
    }
    
    public WebElement getCancelButton() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(RESET_BUTTON_ID)));
    }
    
    public WebElement getDifficultyLevelBox() {
        return driver.findElement(By.id(DIFFICULTY_SELECT_ID));
    }
    
    public WebElement getSelectedDifficultyLevel() {
        return driver.findElement(By.cssSelector("span.ant-select-selection-item"));
    }
    
    public WebElement getRevNumber() {
        return driver.findElement(By.id(REV_NUMBER_INPUT_ID));
    }
    
    public WebElement getDurationFirst() {
        return driver.findElement(By.id(DURATION_FIRST_INPUT_ID));
    }
    
    public WebElement getDurationSecond() {
        return driver.findElement(By.id(DURATION_SECOND_INPUT_ID));
    }
    
    public WebElement getMatchSettingAtIndex(int index) {
        String testId = "match-setting-" + index;
        return driver.findElement(By.id(testId));
    }
    
    public WebElement getMatchSettingsRadioGroup() {
        return driver.findElement(By.id(MATCH_SETTINGS_RADIO_GROUP_ID));
    }
    
    // Error message getters
    public WebElement getTitleError() {
        return driver.findElement(By.id(TITLE_ERROR_ID));
    }
    
    public WebElement getRevNumberError() {
        return driver.findElement(By.id(REV_NUMBER_ERROR_ID));
    }
    
    public WebElement getDurationFirstError() {
        return driver.findElement(By.id(DURATION_FIRST_ERROR_ID));
    }
    
    public WebElement getDurationSecondError() {
        return driver.findElement(By.id(DURATION_SECOND_ERROR_ID));
    }
    
    // Verification methods
    public boolean isPageLoaded() {
        try {
            return getPageTitle().isDisplayed() && 
                   getPageTitle().getText().equals("Create New Match");
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isMatchSettingsListDisplayed() {
        try {
            return driver.findElement(By.cssSelector(MATCH_SETTINGS_LIST_CSS)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isMatchSettingsRadioGroupDisplayed() {
        try {
            return getMatchSettingsRadioGroup().isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isCreateButtonEnabled() {
        return getCreateButton().isEnabled();
    }
    
    public boolean isCancelButtonDisplayed() {
        return getCancelButton().isDisplayed();
    }
    
    public boolean isBackToHomeButtonDisplayed() {
        return getBackToHomeButton().isDisplayed();
    }
    
    public boolean isTitleErrorDisplayed() {
        try {
            return getTitleError().isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isRevNumberErrorDisplayed() {
        try {
            return getRevNumberError().isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isDurationFirstErrorDisplayed() {
        try {
            return getDurationFirstError().isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isDurationSecondErrorDisplayed() {
        try {
            return getDurationSecondError().isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getTitleErrorText() {
        try {
            return getTitleError().getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public String getRevNumberErrorText() {
        try {
            return getRevNumberError().getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public String getDurationFirstErrorText() {
        try {
            return getDurationFirstError().getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public String getDurationSecondErrorText() {
        try {
            return getDurationSecondError().getText();
        } catch (Exception e) {
            return "";
        }
    }
}
