package com.example.pages;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginPO {
    private WebDriver driver;
    private WebDriverWait wait;
    
    // Selectors based on Login.js
    private static final String LOGIN_TITLE = "//h2[contains(@class, 'login-title')]"; // "Codify"
    // The skip login button is rendered when showDevButton is true. 
    // It has text "Skip Login (Dev Only)"
    private static final String SKIP_LOGIN_BTN = "//button[contains(text(), 'Skip Login')]";
    
    // Google sign in button for reference, though we won't click it in automated tests usually
    private static final String GOOGLE_SIGNIN_BTN = "//button[contains(text(), 'Sign in with Google')]";

    public LoginPO(WebDriver driver) {
        this.driver = driver;
        // Use longer timeout in CI environments
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }

    /**
     * Checks if we are on the login page by looking for the title
     */
    public boolean isLoginPage() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(LOGIN_TITLE)));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Clicks the "Skip Login (Dev Only)" button to authenticate as a dev user.
     * This relies on the frontend running in development mode.
     */
    public void loginAsDev() {
        WebElement skipBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(SKIP_LOGIN_BTN)));
        skipBtn.click();
    }
}
