package com.example.pages;

import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AdminPagePO {
    private WebDriver driver;
    private WebDriverWait wait;
    
    // Page elements
    private static final By PAGE_TITLE = By.xpath("//h2[contains(text(), 'User Management')]");
    private static final By USER_TABLE = By.cssSelector("[data-testid='user-table']");
    private static final By BACK_TO_HOME_BUTTON = By.id("back-to-home-button");
    
    public AdminPagePO(WebDriver driver) {
        this.driver = driver;
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }
    
    public boolean isPageLoaded() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(PAGE_TITLE)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isUserTableVisible() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(USER_TABLE)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    private WebElement findUserRow(String email) {
        try {
            // Find the row containing the email
            By rowSelector = By.xpath("//td[contains(text(), '" + email + "')]/parent::tr");
            return wait.until(ExpectedConditions.presenceOfElementLocated(rowSelector));
        } catch (Exception e) {
            return null;
        }
    }
    
    public String getUserRole(String email) {
        try {
            By roleTagSelector = By.cssSelector("[data-testid='role-tag-" + email + "']");
            WebElement roleTag = wait.until(ExpectedConditions.visibilityOfElementLocated(roleTagSelector));
            return roleTag.getText();
        } catch (Exception e) {
            return null;
        }
    }
    
    public void clickPromoteButton(String email) {
        try {
            By promoteButtonSelector = By.cssSelector("[data-testid='promote-button-" + email + "']");
            WebElement promoteButton = wait.until(ExpectedConditions.elementToBeClickable(promoteButtonSelector));
            promoteButton.click();
        } catch (Exception e) {
            throw new RuntimeException("Failed to click promote button for user: " + email, e);
        }
    }
    
    public void clickDemoteButton(String email) {
        try {
            By demoteButtonSelector = By.cssSelector("[data-testid='demote-button-" + email + "']");
            WebElement demoteButton = wait.until(ExpectedConditions.elementToBeClickable(demoteButtonSelector));
            demoteButton.click();
        } catch (Exception e) {
            throw new RuntimeException("Failed to click demote button for user: " + email, e);
        }
    }
    
    public void confirmRoleChange(String email, boolean isPromote) {
        try {
            String testId = isPromote ? "confirm-promote-" + email : "confirm-demote-" + email;
            By confirmButtonSelector = By.cssSelector("[data-testid='" + testId + "']");
            WebElement confirmButton = wait.until(ExpectedConditions.elementToBeClickable(confirmButtonSelector));
            confirmButton.click();
        } catch (Exception e) {
            throw new RuntimeException("Failed to confirm role change for user: " + email, e);
        }
    }
    
    public boolean waitForRoleUpdate(String email, String expectedRole) {
        try {
            By roleTagSelector = By.cssSelector("[data-testid='role-tag-" + email + "']");
            return wait.until(driver -> {
                try {
                    WebElement roleTag = driver.findElement(roleTagSelector);
                    String currentRole = roleTag.getText();
                    return currentRole.equals(expectedRole);
                } catch (Exception e) {
                    return false;
                }
            });
        } catch (Exception e) {
            return false;
        }
    }
    
    public void promoteUserToTeacher(String email) {
        clickPromoteButton(email);
        confirmRoleChange(email, true);
    }
    
    public void demoteUserToStudent(String email) {
        clickDemoteButton(email);
        confirmRoleChange(email, false);
    }
}

