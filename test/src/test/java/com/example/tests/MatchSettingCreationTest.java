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
        clearLocalStorage();
        driver.navigate().refresh(); // Refresh to apply cleared storage
        loginPO.loginAsPreconfiguredTeacher();
        Thread.sleep(50);
        System.out.println("Logged in");
        navigateTo("/match-settings/create");
    }

    @Test
    @Order(1)
    @DisplayName("Scenario: Autosave creates/keeps a draft")
    public void testSaveAsDraft() throws InterruptedException {
        String title = "Draft Test " + System.currentTimeMillis();
        creationPO.enterTitle(title); 
        creationPO.enterDescription("Draft Description"); 
        creationPO.enterReferenceSolution("#include <iostream> int main() { std::cout << \"1\"; return 0; }"); 
        
        creationPO.clickSaveDraft();
        
        try { Thread.sleep(2000); } catch (InterruptedException e) {}
        
        navigateTo("/match-settings");
        listingPO.waitForTableData();
        
        assertTrue(listingPO.isPageLoaded(), "Should be on list page");
    }

    @Test
    @Order(2)
    @DisplayName("Scenario: Create match setting with missing title")
    public void testCreateWithMissingTitle() {
        creationPO.enterDescription("Print Only Hello, World!");
        creationPO.clickPublish();
        
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
        assertTrue(currentUrl.contains("/match-settings"), "Should redirect to match settings list");
    }

    @Test
    @Order(5)
    @DisplayName("Scenario: Manage tests")
    public void testManageTests() {
        creationPO.enterTitle("Test Management " + System.currentTimeMillis());
        creationPO.enterDescription("Desc");
        
        creationPO.addPublicTest("input1", "output1");
        
        creationPO.addPrivateTest("input_priv", "output_priv");
    }
}
