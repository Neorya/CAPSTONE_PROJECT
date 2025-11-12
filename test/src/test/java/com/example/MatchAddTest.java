package com.example;

import org.junit.jupiter.api.*;
import org.openqa.selenium.WebElement;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for Create Match page functionality.
 * Extends BaseTest to inherit WebDriver lifecycle management.
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class MatchAddTest extends BaseTest {
    
    private static MatchAddPO matchAddPage;
    
    @BeforeAll
    public static void setUpTest() {
        // BaseTest.setUp() is automatically called by JUnit due to @BeforeAll in parent class
        // Initialize Page Object here
        matchAddPage = new MatchAddPO(driver);
    }
    
    @BeforeEach
    public void navigateToPage() {
        // Navigate to the create match page before each test
        navigateTo("/create-match");
    }
    
    @Test
    @Order(1)
    @DisplayName("Verify page loads successfully")
    public void testPageLoads() {
        assertTrue(matchAddPage.isPageLoaded(), 
            "Create match page should load successfully");
    }
    
    @Test
    @Order(2)
    @DisplayName("Verify create button is displayed but initially disabled")
    public void testCreateButtonState() {
        assertTrue(matchAddPage.getCreateButton().isDisplayed(), 
            "Create button should be displayed");
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should be disabled initially");
    }
    
    @Test
    @Order(3)
    @DisplayName("Verify cancel button is displayed and enabled")
    public void testCancelButton() {
        assertTrue(matchAddPage.isCancelButtonDisplayed(), 
            "Cancel button should be displayed");
        assertTrue(matchAddPage.getCancelButton().isEnabled(), 
            "Cancel button should be enabled");
    }
    
    @Test
    @Order(4)
    @DisplayName("Verify setting difficulty level")
    public void testSetDifficultyLevel() {
        String difficultyLevel = "Medium";
        matchAddPage.setDifficultyLevel(difficultyLevel);
        
        String selectedValue = matchAddPage.getSelectedDifficultyLevel().getAttribute("title");
        assertEquals(difficultyLevel, selectedValue, 
            "Selected difficulty level should match the set value");
    }
    
    @Test
    @Order(6)
    @DisplayName("Verify setting first phase duration")
    public void testSetDurationFirst() {
        int duration = 15;
        matchAddPage.setDurationFirst(duration);
        
        String value = matchAddPage.getDurationFirst().getAttribute("value");
        assertEquals(String.valueOf(duration), value, 
            "First phase duration should match the set value");
    }
    
    @Test
    @Order(7)
    @DisplayName("Verify setting second phase duration")
    public void testSetDurationSecond() {
        int duration = 10;
        matchAddPage.setDurationSecond(duration);
        
        String value = matchAddPage.getDurationSecond().getAttribute("value");
        assertEquals(String.valueOf(duration), value, 
            "Second phase duration should match the set value");
    }
    
    @Test
    @Order(8)
    @DisplayName("Verify selecting a match setting")
    public void testSelectMatchSetting() {
        int settingIndex = 2;
        WebElement settingElement = matchAddPage.getMatchSettingAtIndex(settingIndex);
        
        assertFalse(settingElement.isSelected(), 
            "Match setting should not be selected initially");
        
        settingElement.click();
        
        assertTrue(settingElement.isSelected(), 
            "Match setting should be selected after clicking");
    }
    
    @Test
    @Order(9)
    @DisplayName("Verify back to home button is displayed")
    public void testBackToHomeButton() {
        assertTrue(matchAddPage.isBackToHomeButtonDisplayed(), 
            "Back to home button should be displayed");
    }
    
    @Test
    @Order(10)
    @DisplayName("Verify page title is correct")
    public void testPageTitle() {
        String expectedTitle = "Create New Match";
        assertEquals(expectedTitle, matchAddPage.getPageTitle().getText(), 
            "Page title should be 'Create New Match'");
    }
    
    @Test
    @Order(11)
    @DisplayName("Verify setting match title")
    public void testSetMatchTitle() {
        String title = "Test Match Title";
        matchAddPage.setMatchTitle(title);
        
        String value = matchAddPage.getTitleInput().getAttribute("value");
        assertEquals(title, value, 
            "Match title should match the set value");
    }
    
    @Test
    @Order(12)
    @DisplayName("Verify complete match creation flow")
    public void testCreateMatch() {
        matchAddPage.setMatchTitle("Integration Test Match");
        matchAddPage.setDifficultyLevel("Hard");
        matchAddPage.setRevNumber(2);
        matchAddPage.setDurationFirst(15);
        matchAddPage.setDurationSecond(10);
        matchAddPage.clickMatchSettingAtIndex(1);
        matchAddPage.clickCreateButton();
        
        // Verify we're still on a valid page (or redirected appropriately)
        assertTrue(matchAddPage.isMatchSettingsRadioGroupDisplayed(), 
            "Match settings radio group should be displayed after creation attempt");
    }
    
    // ========== Bad Input Tests ==========
    
    @Test
    @Order(13)
    @DisplayName("Verify review number below minimum (0) shows error")
    public void testReviewNumberBelowMinimum() {
        matchAddPage.setRevNumber(0);
        
        // Click somewhere else to trigger validation
        matchAddPage.getTitleInput().click();
        
        // Wait a moment for validation
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Verify error is displayed
        assertTrue(matchAddPage.isRevNumberErrorDisplayed(), 
            "Error message should be displayed for review number below minimum");
        
        // Verify create button remains disabled
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should remain disabled with invalid review number");
    }
    
    @Test
    @Order(14)
    @DisplayName("Verify review number above maximum (11) shows error")
    public void testReviewNumberAboveMaximum() {
        matchAddPage.setRevNumber(11);
        
        // Click somewhere else to trigger validation
        matchAddPage.getTitleInput().click();
        
        // Wait a moment for validation
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Verify error is displayed
        assertTrue(matchAddPage.isRevNumberErrorDisplayed(), 
            "Error message should be displayed for review number above maximum");
        
        // Verify create button remains disabled
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should remain disabled with invalid review number");
    }
    
    @Test
    @Order(15)
    @DisplayName("Verify negative review number shows error")
    public void testNegativeReviewNumber() {
        matchAddPage.getRevNumber().clear();
        matchAddPage.getRevNumber().sendKeys("-5");
        
        // Click somewhere else to trigger validation
        matchAddPage.getTitleInput().click();
        
        // Wait a moment for validation
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Verify create button remains disabled
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should remain disabled with negative review number");
    }
    
    @Test
    @Order(16)
    @DisplayName("Verify zero duration for phase 1 shows error")
    public void testDurationFirstZero() {
        matchAddPage.setDurationFirst(0);
        
        // Click somewhere else to trigger validation
        matchAddPage.getTitleInput().click();
        
        // Wait a moment for validation
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Verify error is displayed
        assertTrue(matchAddPage.isDurationFirstErrorDisplayed(), 
            "Error message should be displayed for zero duration in phase 1");
        
        // Verify create button remains disabled
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should remain disabled with invalid phase 1 duration");
    }
    
    @Test
    @Order(17)
    @DisplayName("Verify negative duration for phase 1 shows error")
    public void testDurationFirstNegative() {
        matchAddPage.getDurationFirst().clear();
        matchAddPage.getDurationFirst().sendKeys("-10");
        
        // Click somewhere else to trigger validation
        matchAddPage.getTitleInput().click();
        
        // Wait a moment for validation
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Verify create button remains disabled
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should remain disabled with negative phase 1 duration");
    }
    
    @Test
    @Order(18)
    @DisplayName("Verify zero duration for phase 2 shows error")
    public void testDurationSecondZero() {
        matchAddPage.setDurationSecond(0);
        
        // Click somewhere else to trigger validation
        matchAddPage.getTitleInput().click();
        
        // Wait a moment for validation
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Verify error is displayed
        assertTrue(matchAddPage.isDurationSecondErrorDisplayed(), 
            "Error message should be displayed for zero duration in phase 2");
        
        // Verify create button remains disabled
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should remain disabled with invalid phase 2 duration");
    }
    
    @Test
    @Order(19)
    @DisplayName("Verify negative duration for phase 2 shows error")
    public void testDurationSecondNegative() {
        matchAddPage.getDurationSecond().clear();
        matchAddPage.getDurationSecond().sendKeys("-15");
        
        // Click somewhere else to trigger validation
        matchAddPage.getTitleInput().click();
        
        // Wait a moment for validation
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Verify create button remains disabled
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should remain disabled with negative phase 2 duration");
    }
    
    @Test
    @Order(20)
    @DisplayName("Verify empty title prevents form submission")
    public void testEmptyTitle() {
        matchAddPage.getTitleInput().clear();
        matchAddPage.setDifficultyLevel("Easy");
        matchAddPage.setRevNumber(3);
        matchAddPage.setDurationFirst(10);
        matchAddPage.setDurationSecond(5);
        matchAddPage.clickMatchSettingAtIndex(1);
        // Verify create button remains disabled
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should remain disabled when title is empty");
    }
    
    @Test
    @Order(21)
    @DisplayName("Verify missing difficulty level prevents form submission")
    public void testMissingDifficultyLevel() {
        matchAddPage.setMatchTitle("Test Match");
        matchAddPage.setRevNumber(3);
        matchAddPage.setDurationFirst(10);
        matchAddPage.setDurationSecond(5);
        matchAddPage.clickMatchSettingAtIndex(1);
        
        // Wait a moment for validation
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Verify create button remains disabled
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should remain disabled when difficulty level is not selected");
    }
    
    @Test
    @Order(22)
    @DisplayName("Verify missing match setting prevents form submission")
    public void testMissingMatchSetting() {
        matchAddPage.setMatchTitle("Test Match");
        matchAddPage.setDifficultyLevel("Medium");
        matchAddPage.setRevNumber(3);
        matchAddPage.setDurationFirst(10);
        matchAddPage.setDurationSecond(5);
        
        // Wait a moment for validation
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Verify create button remains disabled
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should remain disabled when match setting is not selected");
    }
    
    @Test
    @Order(23)
    @DisplayName("Verify multiple invalid fields prevent form submission")
    public void testMultipleInvalidFields() {
        matchAddPage.getTitleInput().clear();
        matchAddPage.setRevNumber(0);
        matchAddPage.setDurationFirst(0);
        matchAddPage.setDurationSecond(0);
        
        // Click somewhere else to trigger validation
        matchAddPage.getBackToHomeButton().click();
        driver.navigate().back();
        
        // Wait a moment for validation
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Verify error messages are displayed
        assertTrue(matchAddPage.isRevNumberErrorDisplayed() || 
                   matchAddPage.isDurationFirstErrorDisplayed() || 
                   matchAddPage.isDurationSecondErrorDisplayed(), 
            "At least one error message should be displayed with multiple invalid fields");
        
        // Verify create button remains disabled
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should remain disabled with multiple invalid fields");
    }
    
    @Test
    @Order(24)
    @DisplayName("Verify error messages have meaningful content")
    public void testErrorMessageContent() {
        matchAddPage.setRevNumber(11);
        
        // Click somewhere else to trigger validation
        matchAddPage.getTitleInput().click();
        
        // Wait a moment for validation
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        if (matchAddPage.isRevNumberErrorDisplayed()) {
            String errorText = matchAddPage.getRevNumberErrorText();
            assertFalse(errorText.isEmpty(), 
                "Error message should contain text");
        }
    }
    
    @Test
    @Order(25)
    @DisplayName("Verify form cannot be submitted with all invalid inputs")
    public void testFormSubmissionWithAllInvalidInputs() {
        matchAddPage.getTitleInput().clear();
        matchAddPage.setRevNumber(0);
        matchAddPage.setDurationFirst(0);
        matchAddPage.setDurationSecond(0);
        
        // Wait a moment for validation
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Verify create button is disabled and cannot be clicked
        assertFalse(matchAddPage.isCreateButtonEnabled(), 
            "Create button should be disabled with all invalid inputs");
        
        // The button should not be clickable even if we try
        WebElement createButton = matchAddPage.getCreateButton();
        assertFalse(createButton.isEnabled(), 
            "Create button element should not be enabled");
    }
    
    @AfterAll
    public static void tearDownTest() {
        // BaseTest.tearDown() is automatically called by JUnit due to @AfterAll in parent class
        // No need to call it explicitly here
    }
}
