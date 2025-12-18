package com.example.pages;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class StartGamePO {
    private WebDriver driver;
    private WebDriverWait wait;
    private static String LESSON_NAME       =   "//div[@class='header-top']/h2";
    private static String GAME_TIMER        =   "//div[@class='header-top']/div[@class='timer-large']";
    private static String JOIN_STUDENT      =   "//*[@id=\"student-answered\"]";
    private static String LIST_STUDENT      =   "//*[@id=\"student-list\"]";
    private static String LIST_STUDENT_NAME =   "//*[@id=\"student-list\"]/span/strong";
    private static String DIV_LIST_STUDENT  =   "//*[@id=\"student-list\"]/div";
    private static final String BACK_TO_HOME_BUTTON_ID = "//*[@id=\"back-to-home-button\"]";

    public StartGamePO (WebDriver driver) {
        this.driver = driver;
        // Use longer timeout in CI environments
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }

    public WebElement getLessonName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(LESSON_NAME)));
    }

    public WebElement getGameTimer() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(GAME_TIMER)));
    }

    public WebElement getJoinStudent() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(JOIN_STUDENT)));
    }

    public WebElement getListStudent() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(LIST_STUDENT)));
    }

    public WebElement getListStudentName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(LIST_STUDENT_NAME)));
    }

    public WebElement getDivListStudent() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(DIV_LIST_STUDENT)));
    }
    
    public WebElement getGoBackButton() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(BACK_TO_HOME_BUTTON_ID)));
    }


    public boolean isPageLoaded() {
        try {
            return getLessonName().isDisplayed() && 
                   getLessonName().getText().equals("Spring Semester Game Session");
        } catch (Exception e) {
            return false;
        }
    }
}