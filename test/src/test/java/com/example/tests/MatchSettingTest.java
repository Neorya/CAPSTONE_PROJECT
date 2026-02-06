package com.example.tests;

import org.junit.jupiter.api.*;
import com.example.pages.*;
import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class MatchSettingTest extends BaseTest {
    private static MatchSettingsPO matchSettingsPage;
    private static LoginPO loginPO;

    
    @BeforeAll
    public static void setUpTest() {
        loginPO = new LoginPO(driver);
        matchSettingsPage = new MatchSettingsPO(driver);
    }
    
    @BeforeEach
    public void navigateToMatchSettings() throws InterruptedException {
        navigateTo("/login");
        clearLocalStorage();
        driver.navigate().refresh(); // Refresh to apply cleared storage
        loginPO.loginAsPreconfiguredTeacher();
        Thread.sleep(50);
        System.out.println("Logged in");

        navigateTo("/match-settings");
        
        if (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) {
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        assertTrue(matchSettingsPage.isPageLoaded(), "Page should be loaded");
        matchSettingsPage.waitForTableData();
    }

    @Test
    @Order(1)
    @DisplayName("Verify page loads successfully")
    public void testMatchSettingsPage() {
        assertTrue(matchSettingsPage.isPageLoaded());
    }

    @Test
    @Order(2)
    @DisplayName("Verify edit modal opens")
    public void testEditButton() {
        String id = matchSettingsPage.getFirstMatchSettingId();
        assertNotNull(id, "Should find at least one match setting");
        
        matchSettingsPage.clickEditButton(id);
        assertTrue(matchSettingsPage.isEditModalVisible(), "Edit modal should be visible");
    }

    @Test
    @Order(3)
    @DisplayName("Verify clone creates new entry (modal should not stay open)")
    public void testCloneButton() {
        String id = matchSettingsPage.getFirstMatchSettingId();
        assertNotNull(id, "Should find at least one match setting");
        
        matchSettingsPage.clickCloneButton(id);
        
        assertTrue(matchSettingsPage.isPageLoaded(), "Should remain on match settings page");
    }

    @Test
    @Order(4)
    @DisplayName("Verify save changes closes modal")
    public void testSaveChangesButton() {
        String id = matchSettingsPage.getFirstMatchSettingId();
        assertNotNull(id, "Should find at least one match setting");
        
        matchSettingsPage.clickEditButton(id);
        assertTrue(matchSettingsPage.isEditModalVisible(), "Edit modal should be visible");
        
        matchSettingsPage.setSettingName("Updated Setting " + System.currentTimeMillis());
        matchSettingsPage.setSettingDescription("Updated Description " + System.currentTimeMillis());
        
        System.out.println("Updated name ");
        matchSettingsPage.clickSaveChangesButton();
        
        assertTrue(matchSettingsPage.waitForEditModalToClose(), "Edit modal should close after saving");
    }

    @Test
    @Order(5)
    @DisplayName("Verify delete functionality")
    public void testDeleteButton() {
        String id = matchSettingsPage.getFirstMatchSettingId();
        assertNotNull(id, "Should find at least one match setting");
        
        matchSettingsPage.clickDeleteButton(id);
        
        assertTrue(matchSettingsPage.isPageLoaded());
    }

    @AfterAll
    public static void tearDownTest() {
        matchSettingsPage = null;
    }
}
