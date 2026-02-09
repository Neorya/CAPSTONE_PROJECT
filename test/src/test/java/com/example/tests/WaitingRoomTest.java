package com.example.tests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Duration;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.example.pages.CreateGameSessionPO;
import com.example.pages.GameSessionMNGPO;
import com.example.pages.LoginPO;
import com.example.pages.StartGamePO;
import com.example.pages.WaitingRoomPO;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class WaitingRoomTest extends BaseTest {
    private static StartGamePO startGamePO;
    private static WaitingRoomPO waitingRoomPO;
    private static LoginPO loginPO;
    private static CreateGameSessionPO createGameSessionPO;
    private static GameSessionMNGPO gameSessionMNGPO;
    
    private static final String TEST_SESSION_NAME = "WaitingRoom Test Session";
    private static final String TEST_START_DATE = "2028-12-15 09:00";
    private static boolean testDataCreated = false;
    private static int createdGameSessionId = -1;
    
    @BeforeAll
    public static void setUpTest() {
        loginPO = new LoginPO(driver);
        waitingRoomPO = new WaitingRoomPO(driver);
        startGamePO = new StartGamePO(driver);
        createGameSessionPO = new CreateGameSessionPO(driver);
        gameSessionMNGPO = new GameSessionMNGPO(driver);
    }
    
    @BeforeEach
    public void navigateToPage() {
        navigateTo("/login");
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("window.localStorage.clear();");
        driver.navigate().refresh();
        loginPO.loginAsPreconfiguredTeacher();
        
        // Give extra time for page to load in CI environments
        if (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) {
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        // Create test game session if not already created
        if (!testDataCreated) {
            createTestGameSession();
            testDataCreated = true;
        }
        
        // Navigate to the pre-start page for the created game session
        if (createdGameSessionId > 0) {
            navigateTo("/pre-start-game-session/" + createdGameSessionId);
        } else {
            navigateTo("/pre-start-game-session/1");
        }
        
        // Give extra time for page to load in CI environments
        if (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) {
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        waitingRoomPO.isPageLoaded();
    }
    
    private void createTestGameSession() {
        navigateTo("/game-sessions");
        
        // Check if session already exists
        if (gameSessionMNGPO.gameSessionExists(TEST_SESSION_NAME)) {
            // Get the game session ID from the existing session
            createdGameSessionId = getGameSessionIdByName(TEST_SESSION_NAME);
            return;
        }
        
        // Create new game session
        navigateTo("/create-game-session");
        createGameSessionPO.fillSessionName(TEST_SESSION_NAME);
        createGameSessionPO.fillStartDate(TEST_START_DATE);
        createGameSessionPO.fillDurationPhaseOne("30");
        createGameSessionPO.fillDurationPhaseTwo("30");
        
        // Select first match using Ant Design checkbox
        createGameSessionPO.clickCheckBox(1);
        
        createGameSessionPO.getButton().click();
        createGameSessionPO.waitSuccessAlert();
        
        // Get the created game session ID
        navigateTo("/game-sessions");
        createdGameSessionId = getGameSessionIdByName(TEST_SESSION_NAME);
    }
    
    private int getGameSessionIdByName(String name) {
        // Default to 1 if we can't determine the ID
        // In a real scenario, you might extract the ID from the table or URL
        return 1;
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
    @DisplayName("Check If The Page Has Expected Elements") 
    public void checkTest() throws InterruptedException {
        assertTrue(waitingRoomPO.getGameObjName().getText().equals("Game Session"), "Game Session title should be displayed");
        assertTrue(waitingRoomPO.getGameTimer().isDisplayed(), "Timer should be displayed");
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
