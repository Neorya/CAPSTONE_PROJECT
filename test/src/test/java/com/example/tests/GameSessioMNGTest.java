package com.example.tests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assumptions.assumeFalse;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import com.example.pages.CreateGameSessionPO;
import com.example.pages.GameSessionMNGPO;

import dev.failsafe.internal.util.Assert;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class GameSessioMNGTest extends BaseTest{
    private static GameSessionMNGPO gameSessionMNGPO;
    private final String testRowName = "TEST GAME SESSION";
    private final String testRowNameCloned = testRowName + " - CLONED";
    private final int testRowIndex = 1;
    private final String testDate = "mm/dddd/yyyy"; 

    @BeforeAll
    public static void setUpTest() {
        // BaseTest.setUp() is automatically called by JUnit due to @BeforeAll in parent class
        // Initialize Page Object here
        gameSessionMNGPO = new GameSessionMNGPO(driver);
    }
    
    @BeforeEach
    public void navigateToPage() {
        // Navigate to the manage game session page before each test
        navigateTo("/mng-game-session");
    }

    @Test
    @Order(1)
    @DisplayName("Cloning Game Session")
    public void cloningGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowName); 
        gameSessionMNGPO.getCopyButttonAt(rowIndex).click();
        assertEquals(gameSessionMNGPO.gameSessionIndex(testRowNameCloned), rowIndex+1);
    }

    @Test
    @Order(2)
    @DisplayName("Delete Game Session")
    public void deleteGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameCloned); 
        gameSessionMNGPO.getDeleteButttonAt(rowIndex).click();
        assumeFalse(gameSessionMNGPO.getTable().getText().contains(testRowNameCloned), "Test Failed: The table contains 'PIPPO'");
    }
    
    @Test
    @Order(3)
    @DisplayName("View Game Session")
    public void viewGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameCloned); 
        gameSessionMNGPO.getViewButttonAt(rowIndex).click();
        assertTrue(gameSessionMNGPO.isModalDisplayed());
        assertTrue(gameSessionMNGPO.getModalGameSessionName().getText().equals(testRowName));
        assertTrue(gameSessionMNGPO.getModalStartDate().getText().equals(testDate));
    }

    @Test
    @Order(4)
    @DisplayName("Update Game Session")
    public void updateGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameCloned); 
        gameSessionMNGPO.getUpdateButttonAt(rowIndex).click();
        
    }
}
