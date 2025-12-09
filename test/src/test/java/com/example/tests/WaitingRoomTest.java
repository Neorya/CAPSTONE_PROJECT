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

public class WaitingRoomTest extends BaseTest {
    private static StartGamePO      startGamePO;
    private static WaitingRoomPO    waitingRoomPO;
    
    @BeforeAll
    public static void setUpTest() {
        // BaseTest.setUp() is automatically called by JUnit due to @BeforeAll in parent class
        // Just initialize Page Object here
        waitingRoomPO   = new WaitingRoomPO(driver);
        startGamePO     = new StartGamePO(driver);
    }
    
    @BeforeEach
    public void navigateToPage() {
        // Navigate to the settings listing page before each test
        navigateTo("/pre-start-game-session");
        
        // Give extra time for page to load in CI environments
        if (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) {
            try {
                Thread.sleep(5000); // Increased from default
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        waitingRoomPO.isPageLoaded();
    }

    @Test
    @Order(1)
    @DisplayName("Go To The Start Game Room") 
    public void goToStartGameRoom() {
        waitingRoomPO.getStartGameButton().click();
        assertTrue(startGamePO.isPageLoaded());
    }

    @Test
    @Order(2)
    @DisplayName("Check If The Page Is Correct") 
    public void checkTest() {
        assertTrue(waitingRoomPO.getGameObjName().getText().equals("Game Session"), "Game Session");
        assertTrue(waitingRoomPO.getGameTimer().getText().equals("00:00"));
        assertTrue(waitingRoomPO.getStudentListTitle().getText().equals("5 students joined"), "Student List");
        assertEquals(waitingRoomPO.getUnorderedList().findElements(By.tagName("li")).size(), 5);
        assertEquals(waitingRoomPO.getMatchList().findElements(By.className("match-item")).size(), 3);
    }

    

    @Test
    @Order(3)
    @DisplayName("Go Back To The Home Page") 
    public void gotToTheHomePage() {
        waitingRoomPO.getGoBackButton().click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));     
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("/html/body/div/div/div/div/div/h2")));
        assertEquals(driver.findElement(By.xpath("/html/body/div/div/div/div/div/h2")).getText(), "Welcome to Match Management System" );
    }
}
