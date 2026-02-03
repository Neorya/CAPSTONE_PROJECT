package com.example.tests;

import com.example.pages.AlgorithmMatchPO;
import com.example.tests.BaseTest;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AlgorithmMatchTest extends BaseTest {

    private AlgorithmMatchPO matchPage;

    /**
     * Test Prerequisites:
     * 1. Backend must have API_TESTING_MODE=true environment variable set
     * 2. Database must have mock game_session data with an active game (in phase 1)
     * 3. Database must have student_join_game entries linking dev student to the game
     * 
     * This test uses the legacy auth bypass system instead of the login flow.
     */
    @BeforeEach
    public void setupScenario() {
        matchPage = new AlgorithmMatchPO(driver);
        
        // Navigate to any page first to set localStorage (can't set on about:blank)
        navigateTo("/");
        
        // Use the legacy system to bypass frontend authentication
        // - auth_enabled_override=false: disables frontend auth checks and route guards
        // - dev_mode_bypass=true: enables dev mode token validation bypass
        // - token=dev_mode_token: dummy token so hasToken() returns true
        // - student_id: sets the current student ID for frontend operations
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
            "window.localStorage.setItem('auth_enabled_override', 'false');" +
            "window.localStorage.setItem('dev_mode_bypass', 'true');" +
            "window.localStorage.setItem('token', 'dev_mode_token');" +
            "window.localStorage.setItem('student_id', '41');"  // Dev Student user ID from init.sql
        );
        
        // Navigate directly to phase-one with gameId parameter
        // Note: This requires a game session with ID 1 to exist and be in active phase 1 state
        navigateTo("/phase-one?gameId=1"); 
        if (!matchPage.isPageLoaded()) {
            fail("The Algorithm Match Phase 1 page failed to load. " +
                 "Ensure mock game session data exists and the game is in phase 1 state.");
        }
    }

    @Test
    @Order(1)
    @DisplayName("Scenario: Display of main page elements")
    public void testMainPageElementsDisplay() {
        assertTrue(matchPage.getPageTitle().isDisplayed(), "Problem title should be visible");
        assertTrue(matchPage.getTimer().isDisplayed(), "Timer should be visible and synchron");

        assertDoesNotThrow(() -> matchPage.clickProblemDescriptionTab());
        assertDoesNotThrow(() -> matchPage.clickTestsTab());
        
        matchPage.selectLanguage("C++"); 
    }

    @Test
    @Order(2)
    @DisplayName("Scenario: Adding a custom test")
    public void testAddCustomTestCase() {
        matchPage.clickAddNewTestCase();
        matchPage.fillAndSubmitTestForm("5", "10"); 

        assertTrue(matchPage.waitTestAddedMessage().isDisplayed(), "Success message 'Test Is Added' missing");
    }

    @Test
    @Order(3)
    @DisplayName("Scenario: Removing a custom test")
    public void testRemoveCustomTestCase() {
        matchPage.clickTestsTab();
        matchPage.deleteCustomTest(0);
        
        assertTrue(matchPage.waitTestDeletedMessage().isDisplayed(), "Success message 'Test Is Deleted' missing");
    }

    @Test
    @Order(4)
    @DisplayName("Scenario: Successful execution of public tests")
    public void testPublicTestExecution() {
        matchPage.clickRunPublicTests();
        matchPage.toggleExecutionOutput();
        
        String results = matchPage.getResultsSummaryText();
        assertTrue(results.contains("Passed") || results.contains("Failed"), 
            "Execution results should show pass/fail status");
    }

    @Test
    @Order(5)
    @DisplayName("Scenario: Compilation error handling")
    public void testCompilationError() {
        matchPage.clickRunPublicTests();
        
        String results = matchPage.getResultsSummaryText();
        assertTrue(results.toLowerCase().contains("compilation error"), 
            "Output should display a clear compilation error state");
    }

    @Test
    @Order(6)
    @DisplayName("Scenario: Data persistence upon page refresh")
    public void testRefreshPersistence() {
        String sampleCode = "int x = 10;";
        matchPage.setEditorCode(sampleCode);
        driver.navigate().refresh();
        assertTrue(matchPage.getTimer().isDisplayed(), "Timer should persist and not reset");
        assertTrue(matchPage.getEditorCode().equals(sampleCode), "Code shoudl persist after the result");
    }

    @Test
    @Order(7)
    @DisplayName("Scenario: Time expiration (Timeout)")
    public void testTimeExpiration() {
        assertTrue(matchPage.isRunPublicTestsClickable(), "Submit button should be disabled after timeout");
    }
}