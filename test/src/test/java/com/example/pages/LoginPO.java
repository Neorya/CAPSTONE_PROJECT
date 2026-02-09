package com.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import org.openqa.selenium.interactions.Actions;

public class LoginPO {
    private WebDriver driver;
    private WebDriverWait wait;
    private Actions actions;

    private By devStudentButton = By.id("dev-student-btn");
    private By devStudent2Button = By.id("dev-student2-btn");
    private By devTeacherButton = By.id("dev-teacher-btn");
    private By devAdminButton = By.id("dev-admin-btn");
    private By alertMessage = By.className("alert-message");
    
    public LoginPO(WebDriver driver) {
        this.driver = driver;
        this.actions = new Actions(driver);
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }
    
    public boolean isAlertVisible() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(alertMessage)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getAlertText() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(alertMessage)).getText();
    }
    
    public boolean isAlertError() {
         WebElement alert = wait.until(ExpectedConditions.visibilityOfElementLocated(alertMessage));
         return alert.getAttribute("class").contains("error");
    }

    public void loginAsPreconfiguredStudent() {
        wait.until(ExpectedConditions.elementToBeClickable(devStudentButton)).click();
    }
    
    public void loginAsPreconfiguredStudent2() {
        wait.until(ExpectedConditions.elementToBeClickable(devStudent2Button)).click();
    }

    public void loginAsPreconfiguredTeacher() {
        wait.until(ExpectedConditions.elementToBeClickable(devTeacherButton)).click(); 
        wait.until(ExpectedConditions.invisibilityOfElementLocated(devTeacherButton));
    }

    public void loginAsPreconfiguredAdmin() {
        wait.until(ExpectedConditions.elementToBeClickable(devAdminButton)).click(); 
        wait.until(ExpectedConditions.invisibilityOfElementLocated(devAdminButton));
    }
}
