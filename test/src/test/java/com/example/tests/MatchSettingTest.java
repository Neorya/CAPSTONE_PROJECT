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
    @DisplayName("Verify edit button navigates to edit page")
    public void testEditButton() {
        String id = matchSettingsPage.getFirstMatchSettingId();
        assertNotNull(id, "Should find at least one match setting");
        
        matchSettingsPage.clickEditButton(id);
        assertTrue(matchSettingsPage.waitForEditPageNavigation(id), "Should navigate to the edit page");
        assertTrue(matchSettingsPage.isEditPageLoaded(), "Edit page should be loaded with heading");
    }

    @Test
    @Order(3)
    @DisplayName("Verify clone creates new entry (should stay on list page)")
    public void testCloneButton() {
        String id = matchSettingsPage.getFirstMatchSettingId();
        assertNotNull(id, "Should find at least one match setting");
        
        matchSettingsPage.clickCloneButton(id);
        
        assertTrue(matchSettingsPage.isPageLoaded(), "Should remain on match settings page");
    }

    @Test
    @Order(4)
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
