package com.example.pages;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Page Object for the Join Game Session page (Student view)
 * 
 * Provides methods for students to view available game sessions,
 * join sessions, and handle various session states.
 */
public class JoinGameSessionPO {
    private WebDriver driver;
    private WebDriverWait wait;

    // Page elements
    private static final By PAGE_TITLE = By.xpath("//h2[contains(text(), 'Join an in-person Game Session')]");
    private static final By BACK_TO_HOME_BUTTON = By.id("back-to-home-button");
    
    // Game Session Card elements
    private static final By GAME_SESSION_CARD_CONTAINER = By.cssSelector("[data-testid='game-session-card-container']");
    private static final By GAME_SESSION_NAME = By.cssSelector("[data-testid='game-session-name']");
    private static final By GAME_STATUS_TAG = By.cssSelector("[data-testid='game-status-tag']");
    private static final By JOIN_GAME_BUTTON = By.cssSelector("[data-testid='join-game-button']");
    private static final By NEXT_GAME_LABEL = By.cssSelector("[data-testid='next-game-label']");
    
    // No game session elements
    private static final By NO_GAME_SESSION_CONTAINER = By.cssSelector("[data-testid='no-game-session-container']");
    private static final By NO_GAME_SESSION_MESSAGE = By.cssSelector("[data-testid='no-game-session-message']");
    
    // Loading spinner
    private static final By LOADING_SPINNER = By.cssSelector(".ant-spin");
    
    // Error/Success messages
    private static final By SUCCESS_MESSAGE = By.cssSelector(".ant-message-success");
    private static final By WARNING_MESSAGE = By.cssSelector(".ant-message-warning");
    private static final By ERROR_MESSAGE = By.cssSelector(".ant-message-error");

    public JoinGameSessionPO(WebDriver driver) {
        this.driver = driver;
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }

    /**
     * Check if the Join Game Session page is loaded
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
     * Wait for the page to finish loading (spinner disappears)
     */
    public void waitForPageLoad() {
        try {
            // Wait for spinner to disappear if present
            wait.until(ExpectedConditions.invisibilityOfElementLocated(LOADING_SPINNER));
        } catch (Exception e) {
            // Spinner might not be present, continue
        }
    }

    /**
     * Check if a game session card is visible (meaning a session is available)
     * @return true if a game session card is displayed, false otherwise
     */
    public boolean isGameSessionAvailable() {
        try {
            waitForPageLoad();
            return driver.findElement(GAME_SESSION_CARD_CONTAINER).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if the "no game sessions" message is displayed
     * @return true if no game sessions message is visible, false otherwise
     */
    public boolean isNoGameSessionsMessageVisible() {
        try {
            waitForPageLoad();
            return driver.findElement(NO_GAME_SESSION_CONTAINER).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get the "no game sessions" message text
     * @return the message text or null if not visible
     */
    public String getNoGameSessionsMessageText() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(NO_GAME_SESSION_MESSAGE)).getText();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Get the name of the available game session
     * @return the session name or null if not visible
     */
    public String getGameSessionName() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(GAME_SESSION_NAME)).getText();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Get the status tag text (e.g., "Open", "Joined", "Joining...")
     * @return the status text or null if not visible
     */
    public String getGameStatusText() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(GAME_STATUS_TAG)).getText();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Check if the Join button is visible and enabled
     * @return true if the join button can be clicked
     */
    public boolean isJoinButtonEnabled() {
        try {
            WebElement button = wait.until(ExpectedConditions.visibilityOfElementLocated(JOIN_GAME_BUTTON));
            return button.isEnabled() && !button.getAttribute("class").contains("ant-btn-loading");
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get the text of the Join button (e.g., "Join Game", "Enter", "Joining...")
     * @return the button text or null if not visible
     */
    public String getJoinButtonText() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(JOIN_GAME_BUTTON)).getText();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Click the Join Game button
     */
    public void clickJoinButton() {
        try {
            WebElement button = wait.until(ExpectedConditions.elementToBeClickable(JOIN_GAME_BUTTON));
            button.click();
        } catch (Exception e) {
            throw new RuntimeException("Failed to click Join Game button", e);
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
     * Wait for a success message to appear
     * @return true if success message appeared, false otherwise
     */
    public boolean waitForSuccessMessage() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(SUCCESS_MESSAGE)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Wait for a warning/error message to appear
     * @return true if warning message appeared, false otherwise
     */
    public boolean waitForWarningMessage() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(WARNING_MESSAGE)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Wait for an error message to appear
     * @return true if error message appeared, false otherwise
     */
    public boolean waitForErrorMessage() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(ERROR_MESSAGE)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get the warning message text
     * @return the warning message text or null
     */
    public String getWarningMessageText() {
        try {
            WebElement msg = wait.until(ExpectedConditions.visibilityOfElementLocated(WARNING_MESSAGE));
            return msg.getText();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Join a game session and wait for confirmation
     * This is a complete workflow method
     */
    public void joinGameSession() {
        clickJoinButton();
        // Wait briefly for the API call to complete
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
