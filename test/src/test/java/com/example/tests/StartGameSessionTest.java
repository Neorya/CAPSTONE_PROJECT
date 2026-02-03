package com.example.tests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Duration;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.example.pages.StartGamePO;
import com.example.pages.WaitingRoomPO;
import com.example.pages.LoginPO;
import com.example.pages.MatchSettingsListingPO;

public class StartGameSessionTest extends BaseTest {
    private static StartGamePO      startGamePO;
    private static WaitingRoomPO    waitingRoomPO;
    private static LoginPO loginPO;

    @BeforeAll
    public static void setUpTest() {
        // BaseTest.setUp() is automatically called by JUnit due to @BeforeAll in parent class
        // Just initialize Page Object here
        loginPO = new LoginPO(driver);
        startGamePO     = new StartGamePO(driver);
        waitingRoomPO   = new WaitingRoomPO(driver);
    }
    
    @BeforeEach
    public void navigateToPage() {
        // Login as Teacher
        navigateTo("/login");
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("window.localStorage.clear();");
        driver.navigate().refresh();
        loginPO.loginAsPreconfiguredTeacher();
        
        // Navigate to the settings listing page before each test
        navigateTo("/pre-start-game-session/1");
        
        // Give extra time for page to load in CI environments
        if (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) {
            try {
                Thread.sleep(5000); // Increased from default
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        waitingRoomPO.getStartGameButton().click();
        startGamePO.isPageLoaded();
    }
    
    @Test
    @Order(1)
    @DisplayName("Check The Page Value")
    public void checkPage() {
        assertTrue(startGamePO.getLessonName().getText().equals("Spring Semester Game Session"));
        assertTrue(startGamePO.getJoinStudent().getText().equals("5 of 5 students answered"));
        assertEquals(startGamePO.getDivListStudent().findElements(By.className("ant-list-item")).size(), 5);
    } 

    @Test
    @Order(2)
    @DisplayName("Go Back To The Home Page") 
    public void gotToTheHomePage() {
        startGamePO.getGoBackButton().click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));     
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("/html/body/div/div/div/div/div/h2")));
        assertEquals(driver.findElement(By.xpath("/html/body/div/div/div/div/div/h2")).getText(), "Welcome to Match Management System" );
    }
}
