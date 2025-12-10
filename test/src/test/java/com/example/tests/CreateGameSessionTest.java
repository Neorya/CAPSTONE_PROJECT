package com.example.tests;

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
import org.openqa.selenium.WebElement;

import com.example.pages.CreateGameSessionPO;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CreateGameSessionTest extends BaseTest  {
    private CreateGameSessionPO createGameSessionPage;
    
    @BeforeEach
    public void navigateToPage() {
        // Initialize Page Object with the driver from BaseTest
        createGameSessionPage = new CreateGameSessionPO(driver);
        
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
    public void testTablePresent() {
        assertTrue(createGameSessionPage.isTablePresent(), 
            "Create Game Session page should load successfully");
    }
    
    @Test
    @Order(3)
    @DisplayName("Verify that the game session creates successfully")
    public void testGameSessionCreationSucceed() {
        String sessionName = "Test Session Full";
        String startDate = "2125-12-11 21:09";
        
        createGameSessionPage.fillSessionName(sessionName);
        createGameSessionPage.fillStartDate(startDate);

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
        
        assertEquals(alert.getText(), "The game session has been created successfully!");
    }

    @Test
    @Order(4)
    @DisplayName("Verify that the game session creation fails without selecting any match")
    public void testGameSessionCreationFails() {
        WebElement c1 = createGameSessionPage.getCheckBox(1).findElement(By.tagName("input"));
        WebElement c2 = createGameSessionPage.getCheckBox(2).findElement(By.tagName("input"));
        assertFalse(c1.isSelected());
        assertFalse(c2.isSelected());
        assertFalse(createGameSessionPage.getButton().isEnabled(), "Button should be disabled");
    }
}
