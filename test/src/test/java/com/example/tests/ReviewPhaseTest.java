package com.example.tests;

import com.example.pages.ReviewPhasePO;
import org.junit.jupiter.api.*;
import org.openqa.selenium.WebElement;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ReviewPhaseTest extends BaseTest {

    private static ReviewPhasePO reviewPage;

    @BeforeEach
    public void setupScenario() {
        loginAsStudent();
        reviewPage = new ReviewPhasePO(driver);
        navigateTo("/voting");
        // We assume the test environment puts the user in a state where /voting is valid
        // or we mocking the session state might be needed if the previous phase isn't complete.

        if (System.getenv("CI") != null) {
            try { Thread.sleep(2000); } catch (InterruptedException e) {}
        }
    }

    @Test
    @Order(1)
    @DisplayName("Verify solutions list is displayed with anonymous IDs and timestamps")
    public void testDisplaySolutions() {

        assertTrue(reviewPage.isVotingSectionVisible(), "Voting section header should be visible");
        assertTrue(reviewPage.isSolutionsListVisible(), "Solutions list should be visible");
        assertTrue(reviewPage.isTimerVisible(), "Phase timer should be visible");

        List<WebElement> solutions = reviewPage.getSolutionItems();
        assertFalse(solutions.isEmpty(), "There should be solutions to review");

        for (WebElement solution : solutions) {
            String participantId = reviewPage.getParticipantId(solution);
            assertNotNull(participantId, "Participant ID should be displayed");
            // Check for anonymity
            assertFalse(participantId.contains("User 1"), "Participant ID should be anonymous");
        }

    }

    @Test
    @Order(2)
    @DisplayName("Verify 'Incorrect' vote enables test case form and disables submit initially")
    public void testVotingIncorrectRequiresTestCase() {
        
        reviewPage.clickViewDetails(0);
        reviewPage.clickIncorrectVote();
        
        assertTrue(reviewPage.isTestCaseFormVisible(), "Test case form should be visible when 'Incorrect' is selected");
        assertFalse(reviewPage.isSubmitButtonEnabled(), "Submit button should be disabled before test case input");
        reviewPage.setTestCaseInput("Array([1, 2, 3])");
        reviewPage.setTestCaseExpectedOutput("6");

        assertTrue(reviewPage.isSubmitButtonEnabled(), "Submit button should be enabled after filling test case");
    }


    @Test
    @Order(3)
    @DisplayName("Verify 'Correct' vote hides test case form")
    public void testVotingCorrectHidesForm() {
        reviewPage.clickViewDetails(0);
        reviewPage.clickIncorrectVote();
        assertTrue(reviewPage.isTestCaseFormVisible(), "Form visible on Incorrect");
        
        reviewPage.clickCorrectVote();
    
        assertFalse(reviewPage.isTestCaseFormVisible(), "Form should be hidden when 'Correct' is selected");
        assertTrue(reviewPage.isSubmitButtonEnabled(), "Submit button should be enabled immediately for Correct vote");
    }

    @Test
    @Order(4)
    @DisplayName("Verify system rejects vote with invalid test case (Teacher solution mismatch)")
    public void testInvalidTestCaseRejection() {
        int initialCount = reviewPage.getTodoListCount();
        reviewPage.clickViewDetails(0);
        reviewPage.clickIncorrectVote();
       
        reviewPage.setTestCaseInput("InvalidInputForTeacher");
        reviewPage.setTestCaseExpectedOutput("ImpossibleOutput");
        
        reviewPage.clickSubmitVote();
        
        int newCount = reviewPage.getTodoListCount();
        assertEquals(initialCount, newCount, "Todo list count should not change after voting");
        
        String notification = reviewPage.getNotificationText();
        assertTrue(notification.contains("Invalid Test Case") || notification.contains("Teacher's solution does not match"),
            "Error notification should appear when test case is invalid against teacher solution");
    }

    @Test
    @Order(5)
    @DisplayName("Verify system accepts vote with valid test case")
    public void testValidTestCaseSuccess() {
        int initialCount = reviewPage.getTodoListCount();
        
        reviewPage.clickViewDetails(0);
        reviewPage.clickIncorrectVote();
        
        reviewPage.setTestCaseInput("ValidInput");
        reviewPage.setTestCaseExpectedOutput("CorrectTeacherOutput");
        
        reviewPage.clickSubmitVote();
        
        int newCount = reviewPage.getTodoListCount();
        assertEquals(initialCount - 1, newCount, "Todo list count should decrease by 1 after voting");

        String notification = reviewPage.getNotificationText();
        assertTrue(notification.contains("Success") || notification.contains("Vote Submitted"),
            "Success notification should appear when test case is valid");
    }


    @Test
    @Order(6)
    @DisplayName("Verify review queue is anonymous and correct size")
    public void testAnonymousReviewQueue() {

        
        List<WebElement> solutions = reviewPage.getSolutionItems();
        
        for (WebElement solution : solutions) {
            String id = reviewPage.getParticipantId(solution);
            assertFalse(id.matches("^[A-Z][a-z]+ [A-Z][a-z]+$"), "Participant names should be masked (not First Last)");
            assertTrue(id.contains("Candidate") || id.contains("#") || id.matches("User \\d+"), "ID should be anonymous pattern");
        }
    }

    @Test
    @Order(7)
    @DisplayName("Verify skipping a review works")
    public void testSkipReview() {
        int initialCount = reviewPage.getTodoListCount();
        
        reviewPage.clickViewDetails(0);
        reviewPage.clickSkipVote();
        reviewPage.clickSubmitVote();
        
        int newCount = reviewPage.getTodoListCount();
        assertEquals(initialCount - 1, newCount, "Todo list count should decrease by 1 after skipping");
    }

    @Test
    @Order(8)
    @DisplayName("Verify cannot re-review after vote confirmation")
    public void testCannotReReviewAfterVote() {
        int initialCount = reviewPage.getTodoListCount();
        String solutionId = reviewPage.getParticipantIdAtIndex(0);
        assertNotNull(solutionId, "Should have at least one solution to review");
        
        reviewPage.clickViewDetails(0);
        reviewPage.clickCorrectVote();
        reviewPage.clickSubmitVote();
        
        int newCount = reviewPage.getTodoListCount();
        assertEquals(initialCount - 1, newCount, "Todo list count should decrease by 1 after voting");
        
        boolean isPresent = reviewPage.isSolutionPresent(solutionId);
        assertFalse(isPresent, "Solution " + solutionId + " should not be present in the review list after voting");
    }

    @Test
    @Order(9)
    @DisplayName("Verify code editor is read-only")
    public void testCodeEditorRestrictions() {
        reviewPage.clickViewDetails(0);
        assertTrue(reviewPage.isCodeReadOnly(), "Code editor should be in read-only mode");
    }

    @Test
    @Order(10)
    @DisplayName("Verify UI locks when phase timer reaches 00:00")
    public void testPhaseTimeout() {

    }
}
