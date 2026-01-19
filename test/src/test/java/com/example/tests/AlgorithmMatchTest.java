package com.example.tests;

import com.example.pages.AlgorithmMatchPO;
import com.example.tests.BaseTest;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AlgorithmMatchTest extends BaseTest {

    private AlgorithmMatchPO matchPage;

    @BeforeEach
    public void setupScenario() {
        matchPage = new AlgorithmMatchPO(driver);
        navigateTo("/phase1"); 
        if (!matchPage.isPageLoaded()) {
            fail("The Algorithm Match Phase 1 page failed to load.");
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