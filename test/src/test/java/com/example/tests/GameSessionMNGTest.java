package com.example.tests;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.example.pages.GameSessionMNGPO;



@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class GameSessionMNGTest extends BaseTest{
    private GameSessionMNGPO gameSessionMNGPO;
    private final String testRowName = "Spring Semester Game Session";
    
    private final String testRowNameMOD = "Spring Semester Game Session MOD";
    private final String testDateMOD = "2028-12-16 23:00";
    
    
    private final String testRowNameCloned = testRowName + " - Copy 1";
    private final int testRowIndex = 1;
    private final String testDate = "2028-01-15 09:00"; 
    private final String viewModalName = "Game Session Details";
    private final String updtModalName = "Edit Game Session";
    private final String addMatch      = "Variable Declarations - Section A";
    
    @BeforeEach
    public void navigateToPage() {
        // Initialize Page Object with the driver from BaseTest
        gameSessionMNGPO = new GameSessionMNGPO(driver);
        
        // Navigate to the manage game session page before each test
        navigateTo("/game-sessions");
    }

    @Test
    @Order(1)
    @DisplayName("View Game Session")
    public void viewGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowName); 
        gameSessionMNGPO.getViewButtonAt(rowIndex).click();
        assertTrue(gameSessionMNGPO.isModalDisplayed());
        assertEquals(gameSessionMNGPO.getModalNAME(), viewModalName);
        assertTrue(gameSessionMNGPO.getModalGameSessionName().getAttribute("value").equals(testRowName));
        assertTrue(gameSessionMNGPO.getModalStartDate().getAttribute("value").equals(testDate));
    }

    @Test
    @Order(2)
    @DisplayName("Clone Game Session")
    public void cloneGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowName);
        gameSessionMNGPO.getCopyButtonAt(rowIndex).click();
        gameSessionMNGPO.getYesClonePOPUP().click();
        
        gameSessionMNGPO.waitForRow(testRowNameCloned);
        assertTrue(gameSessionMNGPO.getTable().getText().contains(testRowNameCloned), "Test Failed: Cloned session not found in table");
    }
    

    @Test
    @Order(3)
    @DisplayName("Update Game Session")
    public void updateGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameCloned); 
        WebElement gameSessionName;
        WebElement gameStartDate  ;

        gameSessionMNGPO.getUpdateButtonAt(rowIndex).click();

        assertTrue(gameSessionMNGPO.isModalDisplayed());
        gameSessionName = gameSessionMNGPO.getModalGameSessionName();
        gameStartDate   = gameSessionMNGPO.getModalStartDate();
        
        assertEquals(gameSessionMNGPO.getModalNAME(), updtModalName);

        assertTrue(gameSessionName.getAttribute("value").equals(testRowNameCloned));
        assertTrue(gameStartDate.getAttribute("value").equals(testDate));
        gameSessionName.sendKeys(Keys.CONTROL + "a"); 
        gameSessionName.sendKeys(Keys.DELETE);   
        gameSessionName.sendKeys(testRowNameMOD);
        
        
        gameStartDate.click();
        gameStartDate.sendKeys(Keys.CONTROL + "a"); 
        gameStartDate.sendKeys(Keys.DELETE);  
        gameStartDate.sendKeys(testDateMOD);
        
        
        gameSessionMNGPO.getOkButtonCalendar().click();
        
        gameSessionMNGPO.getModalBtnSave().click();
        gameSessionMNGPO.waitForRow(testRowNameMOD);
        assertTrue(gameSessionMNGPO.getTable().getText().contains(testRowNameMOD), "Test Failed: Updated name not found in table");
    }


    @Test
    @Order(4)
    @DisplayName("Update Game Session With No Name")
    public void updateNoNameGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameMOD); 
        WebElement gameSessionName;
        WebElement gameStartDate  ;

        gameSessionMNGPO.getUpdateButtonAt(rowIndex).click();

        assertTrue(gameSessionMNGPO.isModalDisplayed());
        gameSessionName = gameSessionMNGPO.getModalGameSessionName();
        gameStartDate   = gameSessionMNGPO.getModalStartDate();
        
        assertEquals(gameSessionMNGPO.getModalNAME(), updtModalName);
        assertTrue(gameSessionName.getAttribute("value").equals(testRowNameMOD));
        assertTrue(gameStartDate.getAttribute("value").equals(testDateMOD));
        gameSessionName.sendKeys(Keys.CONTROL + "a"); 
        gameSessionName.sendKeys(Keys.DELETE);   
        gameSessionMNGPO.getModalBtnSave().click();
        assertTrue(gameSessionMNGPO.checkEmptyErrorInputName(), "Test Failed: Empty name error not shown");
        gameSessionMNGPO.getModalBtnClose().click();
        gameSessionMNGPO.waitForModalToDisappear();
    }

    @Test
    @Order(5)
    @DisplayName("Update Game Session With No Start Date")
    public void updateNoStartDateGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameMOD); 
        WebElement gameSessionName;
        WebElement gameStartDate;

        gameSessionMNGPO.getUpdateButtonAt(rowIndex).click();

        assertTrue(gameSessionMNGPO.isModalDisplayed());
        gameSessionName = gameSessionMNGPO.getModalGameSessionName();
        gameStartDate   = gameSessionMNGPO.getModalStartDate();
        
        assertEquals(gameSessionMNGPO.getModalNAME(), updtModalName);
        assertTrue(gameSessionName.getAttribute("value").equals(testRowNameMOD));
        assertTrue(gameStartDate.getAttribute("value").equals(testDateMOD));
        gameStartDate.sendKeys(Keys.CONTROL + "a"); 
        gameStartDate.sendKeys(Keys.DELETE);  
        driver.findElement(By.cssSelector(".ant-picker-clear")).click(); 
        gameSessionMNGPO.getModalBtnSave().click();
        assertTrue(gameSessionMNGPO.checkEmptyErrorStartDateName(), "Test Failed: Empty start date error not shown");
        gameSessionMNGPO.getModalBtnClose().click();
        gameSessionMNGPO.waitForModalToDisappear();
    }

    @Test
    @Order(6)
    @DisplayName("Go From View Model To Update Model")
    public void goFromViewToUpdate() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameMOD); 
        gameSessionMNGPO.getViewButtonAt(rowIndex).click();
        
        assertTrue(gameSessionMNGPO.isModalDisplayed());
        assertEquals(gameSessionMNGPO.getModalNAME(), viewModalName);
        gameSessionMNGPO.getModalBtnEdit().click();
        
        assertEquals(gameSessionMNGPO.getModalNAME(), updtModalName);
        gameSessionMNGPO.getModalBtnClose().click();
        gameSessionMNGPO.waitForModalToDisappear();
    }

    @Test
    @Order(7)
    @DisplayName("ADD Match to game session")
    public void addMatchToGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameMOD); 
        gameSessionMNGPO.getUpdateButtonAt(rowIndex).click();

        assertTrue(gameSessionMNGPO.isModalDisplayed());
        assertEquals(gameSessionMNGPO.getModalNAME(),updtModalName);
        rowIndex = gameSessionMNGPO.gameSessionIndex(addMatch);

        assertEquals(rowIndex, 5);
        gameSessionMNGPO.getCheckButtonAt(rowIndex).click();
        gameSessionMNGPO.getModalBtnSave().click();
        gameSessionMNGPO.waitForModalToDisappear();

        rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameMOD); 
        gameSessionMNGPO.getViewButtonAt(rowIndex).click();

        assertEquals(gameSessionMNGPO.getModalNAME(),viewModalName);
        assertTrue(gameSessionMNGPO.checkIfMatchIsSelected(addMatch));
        gameSessionMNGPO.getModalBtnClose().click();
        gameSessionMNGPO.waitForModalToDisappear();
    }

    @Test
    @Order(8)
    @DisplayName("Remove Match to game session")
    public void rmMatchToGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameMOD); 
        gameSessionMNGPO.getUpdateButtonAt(rowIndex).click();

        assertTrue(gameSessionMNGPO.isModalDisplayed());
        assertEquals(gameSessionMNGPO.getModalNAME(),updtModalName);
        rowIndex = gameSessionMNGPO.gameSessionIndex(addMatch);

        assertEquals(rowIndex, 5);
        gameSessionMNGPO.getCheckButtonAt(rowIndex).click();
        gameSessionMNGPO.getModalBtnSave().click();
        gameSessionMNGPO.waitForModalToDisappear();

        rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameMOD); 
        gameSessionMNGPO.getViewButtonAt(rowIndex).click();

        assertEquals(gameSessionMNGPO.getModalNAME(),viewModalName);
        assertFalse(gameSessionMNGPO.checkIfMatchIsSelected(addMatch));
        gameSessionMNGPO.getModalBtnClose().click();
        gameSessionMNGPO.waitForModalToDisappear();
    }
    

    @Test
    @Order(9)
    @DisplayName("Delete Game Session")
    public void deleteGameSession() {
        int rowIndex = gameSessionMNGPO.gameSessionIndex(testRowNameMOD); 
        gameSessionMNGPO.getDeleteButtonAt(rowIndex).click();
        gameSessionMNGPO.getYesDeletePOPUP().click();
        assertFalse(gameSessionMNGPO.getTable().getText().contains(testRowNameMOD), "Test Failed: The row was not deleted");
    }
    
    @Test
    @Order(10)
    @DisplayName("Go Back Home")
    public void goBackHome() {
        gameSessionMNGPO.getHomeButton().click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));     
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h2[contains(text(), 'Welcome to Match Management System')]")));
        assertEquals(driver.findElement(By.xpath("//h2[contains(text(), 'Welcome to Match Management System')]")).getText(), "Welcome to Match Management System" );
    }
}
