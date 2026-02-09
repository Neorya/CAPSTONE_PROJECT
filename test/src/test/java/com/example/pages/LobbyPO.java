package com.example.pages;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Page Object for the Student Lobby page
 * 
 * This page is shown to students after they join a game session
 * and are waiting for the teacher to start the game.
 */
public class LobbyPO {
    private WebDriver driver;
    private WebDriverWait wait;

    // Page elements
    private static final By PAGE_TITLE = By.xpath("//h2[contains(text(), 'Lobby')]");
    private static final By BACK_TO_HOME_BUTTON = By.id("back-to-home-button");
    
    // Waiting message
    private static final By WAITING_MESSAGE = By.cssSelector("[data-testid='lobby-waiting-message']");
    
    // Game session details
    private static final By GAME_NAME = By.xpath("//span[contains(@class, 'ant-card-head-title')]//span");
    private static final By SCHEDULED_START = By.xpath("//td[contains(text(), 'Scheduled Start')]/following-sibling::td//span");
    private static final By PARTICIPANTS_COUNT = By.xpath("//td[contains(., 'Participants')]/following-sibling::td//span");
    private static final By STATUS_TAG = By.cssSelector(".ant-tag");
    
    // Loading spinner
    private static final By LOADING_SPINNER = By.cssSelector(".ant-spin");
    
    // Messages
    private static final By SUCCESS_MESSAGE = By.cssSelector(".ant-message-success");
    private static final By INFO_MESSAGE = By.cssSelector(".ant-message-info");
    private static final By ERROR_MESSAGE = By.cssSelector(".ant-message-error");

    public LobbyPO(WebDriver driver) {
        this.driver = driver;
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }

    /**
     * Check if the Lobby page is loaded
     * @return true if the page is loaded, false otherwise
     */
    public boolean isPageLoaded() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(PAGE_TITLE)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if the waiting message is displayed
     * @return true if waiting message is visible
     */
    public boolean isWaitingMessageVisible() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(WAITING_MESSAGE)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get the waiting message text
     * @return the waiting message text
     */
    public String getWaitingMessageText() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(WAITING_MESSAGE)).getText();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Get the game session name displayed in the lobby
     * @return the game name
     */
    public String getGameName() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(GAME_NAME)).getText();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Get the participant count text
     * @return the participant count text (e.g., "3 player(s)")
     */
    public String getParticipantsCount() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(PARTICIPANTS_COUNT)).getText();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Get the status tag text
     * @return the status text (e.g., "Waiting to Start")
     */
    public String getStatusText() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(STATUS_TAG)).getText();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Click the back to home button
     */
    public void clickBackToHome() {
        try {
            WebElement button = wait.until(ExpectedConditions.elementToBeClickable(BACK_TO_HOME_BUTTON));
            button.click();
        } catch (Exception e) {
            throw new RuntimeException("Failed to click Back to Home button", e);
        }
    }

    /**
     * Wait for the loading spinner to disappear
     */
    public void waitForLoading() {
        try {
            wait.until(ExpectedConditions.invisibilityOfElementLocated(LOADING_SPINNER));
        } catch (Exception e) {
            // Spinner might not be present
        }
    }

    /**
     * Wait for a success message (e.g., "Game session has started!")
     * @return true if success message appeared
     */
    public boolean waitForSuccessMessage() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(SUCCESS_MESSAGE)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Wait for an info message
     * @return true if info message appeared
     */
    public boolean waitForInfoMessage() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(INFO_MESSAGE)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if still in lobby (not redirected to phase one)
     * @return true if still on lobby page
     */
    public boolean isStillInLobby() {
        try {
            return driver.findElement(PAGE_TITLE).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Wait for redirect to phase one (game started)
     * @param timeoutSeconds maximum time to wait
     * @return true if redirected to phase one
     */
    public boolean waitForRedirectToPhaseOne(int timeoutSeconds) {
        try {
            WebDriverWait longWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
            return longWait.until(driver -> driver.getCurrentUrl().contains("/phase-one"));
        } catch (Exception e) {
            return false;
        }
    }
}
