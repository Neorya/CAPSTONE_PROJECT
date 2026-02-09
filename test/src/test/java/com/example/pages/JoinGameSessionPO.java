package com.example.pages;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class JoinGameSessionPO {
    private WebDriver driver;
    private WebDriverWait wait;
    
    private static final String PAGE_TITLE_XPATH = "//h2[contains(@class, 'ant-typography')]";
    private static final String BACK_TO_HOME_BUTTON_ID = "//*[@id='back-to-home-button']";
    
    private static final String GAME_SESSION_CARD_XPATH = "//div[contains(@class, 'game-session-card')]";
    private static final String JOIN_BUTTON_XPATH = "//button[contains(., 'Join Game') or contains(., 'Enter')]";
    private static final String GAME_SESSION_NAME_XPATH = "//div[contains(@class, 'game-session-card')]//h4 | //div[contains(@class, 'game-session-card')]//span[contains(@class, 'ant-typography')]";
    
    private static final String LOADING_SPINNER_XPATH = "//span[contains(@class, 'ant-spin')]";
    private static final String EMPTY_STATE_XPATH = "//div[contains(@class, 'ant-empty')]";
    
    private static final String ACTIVE_GAME_BANNER_ID = "//*[@id='active-game-reentry-banner']";
    private static final String CONTINUE_SESSION_BUTTON_ID = "//*[@id='active-game-reentry-button']";

    public JoinGameSessionPO(WebDriver driver) {
        this.driver = driver;
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }
    
    public WebElement getPageTitle() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(PAGE_TITLE_XPATH)));
    }
    
    public WebElement getBackToHomeButton() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(BACK_TO_HOME_BUTTON_ID)));
    }
    
    public boolean isPageLoaded() {
        try {
            return getPageTitle().isDisplayed() && 
                   getPageTitle().getText().contains("Join");
        } catch (Exception e) {
            return false;
        }
    }
    
    public void waitForLoadingComplete() {
        try {
            wait.until(ExpectedConditions.invisibilityOfElementLocated(By.xpath(LOADING_SPINNER_XPATH)));
        } catch (Exception e) {
        }
    }
    
    public boolean isGameSessionAvailable() {
        try {
            waitForLoadingComplete();
            return driver.findElements(By.xpath(GAME_SESSION_CARD_XPATH)).size() > 0 ||
                   driver.findElements(By.xpath(JOIN_BUTTON_XPATH)).size() > 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isNoSessionAvailable() {
        try {
            waitForLoadingComplete();
            return driver.findElements(By.xpath(EMPTY_STATE_XPATH)).size() > 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    public WebElement getJoinButton() {
        return wait.until(ExpectedConditions.elementToBeClickable(By.xpath(JOIN_BUTTON_XPATH)));
    }
    
    public void clickJoinButton() {
        getJoinButton().click();
    }
    
    public String getGameSessionName() {
        try {
            WebElement nameElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(GAME_SESSION_NAME_XPATH)));
            return nameElement.getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public boolean hasActiveGameBanner() {
        try {
            return driver.findElements(By.xpath(ACTIVE_GAME_BANNER_ID)).size() > 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    public void clickContinueSession() {
        WebElement continueButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(CONTINUE_SESSION_BUTTON_ID)));
        continueButton.click();
    }
    
    public boolean waitForLobbyRedirect() {
        try {
            wait.until(ExpectedConditions.urlContains("/lobby"));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean waitForSessionAvailable(int timeoutSeconds) {
        long startTime = System.currentTimeMillis();
        long timeout = timeoutSeconds * 1000L;
        
        while (System.currentTimeMillis() - startTime < timeout) {
            waitForLoadingComplete();
            if (isGameSessionAvailable()) {
                return true;
            }
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return false;
            }
            driver.navigate().refresh();
        }
        return false;
    }
    
    public boolean isGameSessionAvailableByName(String sessionName) {
        try {
            waitForLoadingComplete();
            return driver.findElements(By.xpath("//*[contains(text(), '" + sessionName + "')]")).size() > 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    public void clickJoinButtonForSession(String sessionName) {
        // Find the card or row containing the session name and click its join button
        WebElement joinButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//*[contains(text(), '" + sessionName + "')]/ancestor::div[contains(@class, 'ant-card') or contains(@class, 'game-session')]//button[contains(., 'Join') or contains(., 'Enter')] | //tr[contains(., '" + sessionName + "')]//button[contains(., 'Join') or contains(., 'Enter')]")
        ));
        joinButton.click();
    }
    
    public boolean waitForSessionAvailableByName(String sessionName, int timeoutSeconds) {
        long startTime = System.currentTimeMillis();
        long timeout = timeoutSeconds * 1000L;
        
        while (System.currentTimeMillis() - startTime < timeout) {
            waitForLoadingComplete();
            if (isGameSessionAvailableByName(sessionName)) {
                return true;
            }
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return false;
            }
            driver.navigate().refresh();
        }
        return false;
    }
}
