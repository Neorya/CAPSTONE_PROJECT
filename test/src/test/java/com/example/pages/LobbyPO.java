package com.example.pages;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LobbyPO {
    private WebDriver driver;
    private WebDriverWait wait;
    
    private static final String PAGE_TITLE_XPATH = "//h2[contains(@class, 'ant-typography')]";
    private static final String BACK_TO_HOME_BUTTON_ID = "//*[@id='back-to-home-button']";
    private static final String WAITING_TEXT_XPATH = "//span[contains(text(), 'Waiting for the game to start')]";
    private static final String GAME_SESSION_NAME_XPATH = "//div[contains(@class, 'ant-card-head')]//span";
    private static final String STATUS_TAG_XPATH = "//span[contains(@class, 'ant-tag')]";
    
    public LobbyPO(WebDriver driver) {
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
    
    public WebElement getWaitingText() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(WAITING_TEXT_XPATH)));
    }
    
    public WebElement getGameSessionName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(GAME_SESSION_NAME_XPATH)));
    }
    
    public WebElement getStatusTag() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(STATUS_TAG_XPATH)));
    }
    
    public boolean isPageLoaded() {
        try {
            return getPageTitle().isDisplayed() && 
                   getPageTitle().getText().equals("Lobby");
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean waitForRedirectToPhaseOne(int timeoutSeconds) {
        try {
            WebDriverWait redirectWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
            redirectWait.until(ExpectedConditions.urlContains("/phase-one"));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean waitForRedirectToPhaseOne() {
        return waitForRedirectToPhaseOne(60);
    }
    
    public boolean isOnLobbyPage() {
        return driver.getCurrentUrl().contains("/lobby");
    }
}
