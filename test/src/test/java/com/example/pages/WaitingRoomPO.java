package com.example.pages;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class WaitingRoomPO {
    private WebDriver driver;
    private WebDriverWait wait;
    private static final String GAME_OBJ_NAME       = "//*[@class=\"header-top\"]/h2";
    private static final String GAME_TIMER_XPATH    = "//div[@class='timer-display']//span[@class='ant-typography css-dev-only-do-not-override-hofb1t']/strong";
    private static final String STUDENT_LIST_TITLE  =  "//div[@id='root']/div[@class='App']/div[@class='pre-start-session-container']/div[@class='ant-card ant-card-bordered session-card css-dev-only-do-not-override-hofb1t']/div[@class='ant-card-body']/div[2]/span[1]/strong";
    private static final String UNORDERED_LIST      = "//ul[@class='ant-list-items']";
    private static final String START_GAME_BUTTON   = "//*[@id='start_game_button']";
    private static final String BACK_TO_HOME_BUTTON_ID = "//*[@id=\"back-to-home-button\"]";

    public WaitingRoomPO (WebDriver driver) {
        this.driver = driver;
        // Use longer timeout in CI environments
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }

    public WebElement getGameObjName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(GAME_OBJ_NAME)));
    }

    public WebElement getGameTimer() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(GAME_TIMER_XPATH)));
    }

    public WebElement getStudentListTitle() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(STUDENT_LIST_TITLE)));
    }

    public WebElement getUnorderedList() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(UNORDERED_LIST)));
    }
    
    public WebElement getStartGameButton() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(START_GAME_BUTTON)));
    }
    
    public WebElement getGoBackButton() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(BACK_TO_HOME_BUTTON_ID)));
    }

    public boolean isPageLoaded() {
        try {
            return getGameObjName().isDisplayed() && 
                   getGameObjName().getText().equals("Welcome to Match Management System");
        } catch (Exception e) {
            return false;
        }
    }
}
