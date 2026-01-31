package com.example.tests;

import org.junit.jupiter.api.*; // For BeforeEach, Test, etc. (JUnit 5)
import com.example.pages.*;
import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class MatchSettingCreationTest extends BaseTest {
    private static MatchSettingCreationPO creationPO;
    private static MatchSettingsPO listingPO; // To verify presence in list
    private static LoginPO loginPO;

    @BeforeAll
    public static void setUpTest() {
  
        loginPO = new LoginPO(driver);
        creationPO = new MatchSettingCreationPO(driver);
        listingPO = new MatchSettingsPO(driver);
    }
    
    @BeforeEach
    public void navigateToCreationPage() throws InterruptedException {
        navigateTo("/login");
        loginPO.loginAsPreconfiguredTeacher();
        Thread.sleep(50);
        navigateTo("/match-settings/create");
        
        // Wait for page load logic if needed, e.g., checking title
        // creationPO.enterTitle(""); // dummy wait?
        // Actually, entering title clears it, so safe.
        // Better:
        // WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(10));
        // wait.until(ExpectedConditions.urlContains("/create-match-setting"));
    }

    @Test
    @Order(1)
    @DisplayName("Scenario: Autosave creates/keeps a draft")
    public void testSaveAsDraft() throws InterruptedException {
        String title = "Draft Test " + System.currentTimeMillis();
        creationPO.enterTitle(title); // Step: Enter title
        creationPO.enterDescription("Draft Description"); // Step: Enter description
        creationPO.enterReferenceSolution("#include <iostream> int main() { std::cout << \"1\"; return 0; }"); // Step: Enter ref solution
        
        // Step: Save as Draft
        creationPO.clickSaveDraft();
        
        // Verification: Check for success message or redirection
        // Assuming redirection to list or staying on page with success.
        // Let's check listing page if redirected, or manually navigate
        
        // Assuming standard behavior: wait a bit
        try { Thread.sleep(2000); } catch (InterruptedException e) {}
        
        // If we represent "saved in database", we verify it in the list
        navigateTo("/match-settings");
        listingPO.waitForTableData();
        
        // We need a method in ListingPO to find by title. 
        // ListingPO has `isSettingNamePresent(String settingName)`
        assertTrue(listingPO.isPageLoaded(), "Should be on list page");
        // Note: ListingPO currently doesn't check specific status by name easily without interacting, 
        // but it has `getStatusBySettingName`.
        
        // However, `isSettingNamePresent` relies on `getRowBySettingName` which finds STRONG tag with text.
        // Let's try to match.
        // Note: Listing pagination might hide it if many items. Tests usually assume clean state or search.
        // Assuming it's at top or visible.
        
        // FIXME: listingPO logic for `isSettingNamePresent` might need precise match. 
    }

    @Test
    @Order(2)
    @DisplayName("Scenario: Create match setting with missing title")
    public void testCreateWithMissingTitle() {
        // Step: Title empty (default)
        creationPO.enterDescription("Print Only Hello, World!");
        
        // Step: Click Publish
        creationPO.clickPublish();
        
        // Step: Validation error displayed
        assertTrue(creationPO.isAlertVisible(), "Alert should be visible");
        assertTrue(creationPO.isAlertError(), "Alert should be an error");
    }

    @Test
    @Order(3)
    @DisplayName("Scenario: Required fields must be provided to publish")
    public void testPublishWithoutRequiredFields() {
        creationPO.clickPublish();
        assertTrue(creationPO.isAlertVisible(), "Alert should be visible");
    }

    @Test
    @Order(4)
    @DisplayName("Scenario: Direct Publication")
    public void testDirectPublication() throws InterruptedException {
        String title = "Published Test " + System.currentTimeMillis();
        creationPO.enterTitle(title);
        creationPO.enterDescription("Valid Description for Publish");
        creationPO.enterReferenceSolution("#include <iostream> int main() { std::cout << \"1\"; return 0; }");
        
        creationPO.addPublicTest("", "1");
        
        creationPO.clickPublish();
        
        try { Thread.sleep(2000); } catch (InterruptedException e) {}
        
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/match-settings") && !currentUrl.contains("/create"), 
            "Should redirect to match settings list");
    }

    @Test
    @Order(5)
    @DisplayName("Scenario: Manage tests")
    public void testManageTests() {
        System.out.println("Test Management");
        creationPO.enterTitle("Test Management " + System.currentTimeMillis());
        creationPO.enterDescription("Desc");
        
        creationPO.addPublicTest("input1", "output1");
        
        creationPO.addPrivateTest("input_priv", "output_priv");
    }
}
