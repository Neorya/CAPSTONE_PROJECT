package com.example.tests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import com.example.pages.CreateGameSessionPO;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CreateGameSession extends BaseTest  {
    private static CreateGameSessionPO createGameSessionPage;

    @BeforeAll
    public static void setUpTest() {
        // BaseTest.setUp() is automatically called by JUnit due to @BeforeAll in parent class
        // Initialize Page Object here
        createGameSessionPage = new CreateGameSessionPO(driver);
    }
    
    @BeforeEach
    public void navigateToPage() {
        // Navigate to the create game session page before each test
        navigateTo("/create-game-session");
    }

    @Test
    @Order(1)
    @DisplayName("Verify page loads successfully")
    public void testCorrectPageLoads() {
        assertTrue((createGameSessionPage.isPageLoaded() && createGameSessionPage.getPageTitle().getText().equals("Create Game Session") )
        , "Create Game Session page should load successfully");
    }


    @Test
    @Order(2)
    @DisplayName("Verify that table is present")
    public void testTable() {
        assertTrue(createGameSessionPage.isTablePresent(), 
            "Create Game Session page should load successfully");
    }

    @Test
    @Order(3)
    @DisplayName("Verify page loads successfully")
    public void testCheckBotton() {
        assertEquals(8, createGameSessionPage.getRows().size());
    }
    
    @Test
    @Order(4)
    @DisplayName("Acceptance Criteria 1")
    public void acceptanceCriteria1() {
        WebElement c1 = createGameSessionPage.getCheckBox(1).findElement(By.tagName("input"));
        WebElement c2 = createGameSessionPage.getCheckBox(2).findElement(By.tagName("input"));
        assertFalse(c1.isSelected());
        assertFalse(c2.isSelected());
        c1.click();
        assertTrue(c1.isSelected());
        assertFalse(c2.isSelected());
        c2.click();
        assertTrue(c2.isSelected());
        createGameSessionPage.getButton().click();

        WebElement alert = createGameSessionPage.waitSuccessAlert();
        assertEquals(alert.getText(), "The game session has been created");
    }

    @Test
    @Order(5)
    @DisplayName("Acceptance Criteria 2")
    public void acceptanceCriteria2() {
        WebElement c1 = createGameSessionPage.getCheckBox(1).findElement(By.tagName("input"));
        WebElement c2 = createGameSessionPage.getCheckBox(2).findElement(By.tagName("input"));
        assertFalse(c1.isSelected());
        assertFalse(c2.isSelected());
        createGameSessionPage.getButton().click();
        WebElement alert = createGameSessionPage.waitErrorAlert();
        assertEquals(alert.getText(), "You should select at least a match to create a game session");
    }
    
}
