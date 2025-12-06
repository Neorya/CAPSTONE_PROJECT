package com.example.tests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assumptions.assumeFalse;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
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
    
    private final String testRowNameMOD = "TEST GAME SESSION MOD";
    private final String testDateMOD = "2026-12-16 23:00";
    
    
    private final String testRowNameCloned = testRowName + " - Copy 1";
    private final int testRowIndex = 1;
    private final String testDate = "2025-12-16 23:00"; 
    private final String viewModalName = "Game Session Details";
    private final String updtModalName = "Edit Game Session";
    private final String addMatch      = "Variable Declarations - Section A";

    @BeforeAll
    public static void setUpTest() {
        // BaseTest.setUp() is automatically called by JUnit due to @BeforeAll in parent class
        // Initialize Page Object here
        gameSessionMNGPO = new GameSessionMNGPO(driver);
    }
    
    @BeforeEach
    public void navigateToPage() {
        // Navigate to the manage game session page before each test
        navigateTo("/game-sessions");
    }

    @Test
    @Order(1)
    @DisplayName("Cloning Game Session")
    public void cloningGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowName); 
        gameSessionMNGPO.getCopyButttonAt(rowIndex).click();
        gameSessionMNGPO.getYesClonePOPUP().click();
        assertEquals(gameSessionMNGPO.gameSessionIndex(testRowNameCloned), rowIndex);
    }

    @Test
    @Order(2)
    @DisplayName("Delete Game Session")
    public void deleteGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameCloned); 
        gameSessionMNGPO.getDeleteButttonAt(rowIndex).click();
        gameSessionMNGPO.getYesDeletePOPUP().click();
        assertEquals(gameSessionMNGPO.gameSessionIndex(testRowNameCloned), rowIndex);
        assumeFalse(gameSessionMNGPO.getTable().getText().contains(testRowNameCloned), "Test Failed: The table contains 'PIPPO'");
    }
    
    @Test
    @Order(3)
    @DisplayName("View Game Session")
    public void viewGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowName); 
        gameSessionMNGPO.getViewButttonAt(rowIndex).click();
        assertTrue(gameSessionMNGPO.isModalDisplayed());
        assertEquals(gameSessionMNGPO.getModalNAME(), viewModalName);
        assertTrue(gameSessionMNGPO.getModalGameSessionName().getAttribute("value").equals(testRowName));
        assertTrue(gameSessionMNGPO.getModalStartDate().getAttribute("value").equals(testDate));
    }

    @Test
    @Order(4)
    @DisplayName("Update Game Session")
    public void updateGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameCloned); 
        WebElement gameSessionName;
        WebElement gameStartDate  ;

        gameSessionMNGPO.getUpdateButttonAt(rowIndex).click();

        assertTrue(gameSessionMNGPO.isModalDisplayed());
        gameSessionName = gameSessionMNGPO.getModalGameSessionName();
        gameStartDate   = gameSessionMNGPO.getModalStartDate();
        
        assertEquals(gameSessionMNGPO.getModalNAME(), updtModalName);
        assertTrue(gameSessionName.getAttribute("value").equals(testRowName));
        assertTrue(gameStartDate.getAttribute("value").equals(testDate));
        gameSessionName.sendKeys(Keys.CONTROL + "a"); 
        gameSessionName.sendKeys(Keys.DELETE);   
        gameSessionName.sendKeys(testRowNameMOD);
        
        gameStartDate.sendKeys(Keys.CONTROL + "a"); 
        gameStartDate.sendKeys(Keys.DELETE);   
        gameStartDate.sendKeys(testDateMOD);

        gameSessionMNGPO.getModalBtnSave().click();
        assertTrue(gameSessionMNGPO.getTable().getText().contains(testRowNameMOD), "Test Failed: The table contains 'PIPPO'");
    }


    @Test
    @Order(5)
    @DisplayName("Update Game Session With No Name")
    public void updateNoNameGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameCloned); 
        WebElement gameSessionName;
        WebElement gameStartDate  ;

        gameSessionMNGPO.getUpdateButttonAt(rowIndex).click();

        assertTrue(gameSessionMNGPO.isModalDisplayed());
        gameSessionName = gameSessionMNGPO.getModalGameSessionName();
        gameStartDate   = gameSessionMNGPO.getModalStartDate();
        
        assertEquals(gameSessionMNGPO.getModalNAME(), updtModalName);
        assertTrue(gameSessionName.getAttribute("value").equals(testRowName));
        assertTrue(gameStartDate.getAttribute("value").equals(testDate));
        gameSessionName.sendKeys(Keys.CONTROL + "a"); 
        gameSessionName.sendKeys(Keys.DELETE);   
        gameSessionMNGPO.getModalBtnSave().click();
        assertTrue(gameSessionMNGPO.checkEmptyErrorInputName(), "Test Failed: The table contains 'PIPPO'");
    }

    @Test
    @Order(6)
    @DisplayName("Update Game Session With No Start Date")
    public void updateNoStartDateGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameCloned); 
        WebElement gameSessionName;
        WebElement gameStartDate  ;

        gameSessionMNGPO.getUpdateButttonAt(rowIndex).click();

        assertTrue(gameSessionMNGPO.isModalDisplayed());
        gameSessionName = gameSessionMNGPO.getModalGameSessionName();
        gameStartDate   = gameSessionMNGPO.getModalStartDate();
        
        assertEquals(gameSessionMNGPO.getModalNAME(), updtModalName);
        assertTrue(gameSessionName.getAttribute("value").equals(testRowName));
        assertTrue(gameStartDate.getAttribute("value").equals(testDate));
        gameStartDate.sendKeys(Keys.CONTROL + "a"); 
        gameStartDate.sendKeys(Keys.DELETE);  
        driver.findElement(By.cssSelector(".ant-picker-clear")).click(); 
        gameSessionMNGPO.getModalBtnSave().click();
        assertTrue(gameSessionMNGPO.checkEmptyErrorStartDateName(), "Test Failed: The table contains 'PIPPO'");
    }

    @Test
    @Order(7)
    @DisplayName("Go From View Model To Update Model")
    public void goFromViewToUpdate() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowName); 
        gameSessionMNGPO.getViewButttonAt(rowIndex).click();
        
        assertTrue(gameSessionMNGPO.isModalDisplayed());
        assertEquals(gameSessionMNGPO.getModalNAME(), viewModalName);
        gameSessionMNGPO.getModalBtnEdit().click();
        
        assertEquals(gameSessionMNGPO.getModalNAME(), updtModalName);
    }

    @Test
    @Order(8)
    @DisplayName("ADD Match to game session")
    public void addMatchToGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowName); 
        gameSessionMNGPO.getUpdateButttonAt(rowIndex).click();

        assertTrue(gameSessionMNGPO.isModalDisplayed());
        assertEquals(gameSessionMNGPO.getModalNAME(),updtModalName);
        rowIndex = gameSessionMNGPO.gameSessionIndex(addMatch);

        assertEquals(rowIndex, 5);
        gameSessionMNGPO.getCheckButtonAt(rowIndex).click();
        gameSessionMNGPO.getModalBtnSave().click();

        assertEquals(gameSessionMNGPO.getModalNAME(), updtModalName);
        rowIndex = gameSessionMNGPO.gameSessionIndex(testRowName); 
        gameSessionMNGPO.getViewButttonAt(rowIndex).click();

        assertEquals(gameSessionMNGPO.getModalNAME(),viewModalName);
        assertTrue(gameSessionMNGPO.checkIfMatchIsSelected(addMatch));
        gameSessionMNGPO.getModalBtnClose().click();

    }

    @Test
    @Order(9)
    @DisplayName("Remove Match to game session")
    public void rmMatchToGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowName); 
        gameSessionMNGPO.getUpdateButttonAt(rowIndex).click();

        assertTrue(gameSessionMNGPO.isModalDisplayed());
        assertEquals(gameSessionMNGPO.getModalNAME(),updtModalName);
        rowIndex = gameSessionMNGPO.gameSessionIndex(addMatch);

        assertEquals(rowIndex, 5);
        gameSessionMNGPO.getCheckButtonAt(rowIndex).click();
        gameSessionMNGPO.getModalBtnSave().click();

        assertEquals(gameSessionMNGPO.getModalNAME(), updtModalName);
        rowIndex = gameSessionMNGPO.gameSessionIndex(testRowName); 
        gameSessionMNGPO.getViewButttonAt(rowIndex).click();

        assertEquals(gameSessionMNGPO.getModalNAME(),viewModalName);
        assertTrue(!gameSessionMNGPO.checkIfMatchIsSelected(addMatch));
        gameSessionMNGPO.getModalBtnClose().click();
    }
    
    @Test
    @Order(10)
    @DisplayName("Go Back Home")
    public void goBackHome() {
        gameSessionMNGPO.getHomeButton().click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));     
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("/html/body/div/div/div/div/div/h2")));
        assertEquals(driver.findElement(By.xpath("/html/body/div/div/div/div/div/h2")).getText(), "Welcome to Match Management System" );
    }
}
