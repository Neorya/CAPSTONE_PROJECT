package com.example.tests;

import org.junit.jupiter.api.*;
import org.openqa.selenium.WebElement;
import java.util.List;
import com.example.pages.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for Match Settings Listing page functionality.
 * Extends BaseTest to inherit WebDriver lifecycle management.
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SettingListingTest extends BaseTest {
    
    private static settingListingPO settingListingPage;
    
    @BeforeAll
    public static void setUpTest() {
        // BaseTest.setUp() is automatically called by JUnit due to @BeforeAll in parent class
        // Just initialize Page Object here
        settingListingPage = new settingListingPO(driver);
    }
    
    @BeforeEach
    public void navigateToPage() {
        // Navigate to the settings listing page before each test
        navigateTo("/match-settings");
        
        // Give extra time for page to load in CI environments
        if (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
    
    @Test
    @Order(1)
    @DisplayName("Verify page loads successfully")
    public void testPageLoads() {
        assertTrue(settingListingPage.isPageLoaded(), 
            "Settings listing page should load successfully");
    }
    
    @Test
    @Order(2)
    @DisplayName("Verify all page elements are displayed")
    public void testAllPageElementsDisplayed() {
        assertTrue(settingListingPage.verifyPageElements(), 
            "All main page elements should be displayed");
    }
    
    @Test
    @Order(3)
    @DisplayName("Verify page title is correct")
    public void testPageTitle() {
        assertEquals("Match Settings", settingListingPage.getPageTitle(), 
            "Page title should be 'Match Settings'");
    }
    
    @Test
    @Order(4)
    @DisplayName("Verify subheader text is displayed")
    public void testSubheaderText() {
        String subheaderText = settingListingPage.getSubheaderText();
        assertTrue(subheaderText.contains("Browse existing match settings"), 
            "Subheader should contain correct text");
    }
    
    @Test
    @Order(5)
    @DisplayName("Verify Back to Home button is displayed and clickable")
    public void testBackToHomeButton() {
        assertTrue(settingListingPage.isBackToHomeButtonDisplayed(), 
            "Back to Home button should be displayed");
    }
    
    @Test
    @Order(6)
    @DisplayName("Verify table is displayed")
    public void testTableDisplayed() {
        assertTrue(settingListingPage.isTableDisplayed(), 
            "Match settings table should be displayed");
    }
    
    @Test
    @Order(7)
    @DisplayName("Verify table has correct number of headers")
    public void testTableHeaders() {
        assertEquals(2, settingListingPage.getTableHeaderCount(), 
            "Table should have 2 headers (Name and Status)");
        assertTrue(settingListingPage.isNameColumnHeaderDisplayed(), 
            "Name column header should be displayed");
        assertTrue(settingListingPage.isStatusColumnHeaderDisplayed(), 
            "Status column header should be displayed");
    }
    
    @Test
    @Order(8)
    @DisplayName("Verify table contains data rows")
    public void testTableHasRows() {
        int rowCount = settingListingPage.getTableRowCount();
        assertTrue(rowCount > 0, 
            "Table should contain at least one row of data");
    }
    
    @Test
    @Order(9)
    @DisplayName("Verify All filter is selected by default")
    public void testDefaultFilterSelection() {
        assertTrue(settingListingPage.isAllFilterSelected(), 
            "All filter should be selected by default");
    }
    
    @Test
    @Order(10)
    @DisplayName("Test selecting Ready filter")
    public void testSelectReadyFilter() {
        settingListingPage.selectReadyFilter();
        
        assertTrue(settingListingPage.isReadyFilterSelected(), 
            "Ready filter should be selected after clicking");
    }
    
    @Test
    @Order(11)
    @DisplayName("Test selecting Draft filter")
    public void testSelectDraftFilter() {
        settingListingPage.selectDraftFilter();
        
        assertTrue(settingListingPage.isDraftFilterSelected(), 
            "Draft filter should be selected after clicking");
    }
    
    @Test
    @Order(12)
    @DisplayName("Test selecting All filter")
    public void testSelectAllFilter() {
        // First select a different filter
        settingListingPage.selectReadyFilter();
        
        // Then select All filter
        settingListingPage.selectAllFilter();

        assertTrue(settingListingPage.isAllFilterSelected(), 
            "All filter should be selected after clicking");
    }
    
    @Test
    @Order(13)
    @DisplayName("Verify setting names are displayed")
    public void testSettingNamesDisplayed() {
        List<WebElement> settingNames = settingListingPage.getSettingNames();
        assertFalse(settingNames.isEmpty(), 
            "Setting names list should not be empty");
        
        for (WebElement name : settingNames) {
            assertFalse(name.getText().trim().isEmpty(), 
                "Each setting should have a non-empty name");
        }
    }
    
    @Test
    @Order(14)
    @DisplayName("Verify status tags are displayed")
    public void testStatusTagsDisplayed() {
        List<WebElement> statusTags = settingListingPage.getStatusTags();
        assertFalse(statusTags.isEmpty(), 
            "Status tags list should not be empty");
        
        for (WebElement status : statusTags) {
            String statusText = status.getText();
            assertTrue(statusText.equals("Ready") || statusText.equals("Draft"), 
                "Status should be either 'Ready' or 'Draft'");
        }
    }
    
    @Test
    @Order(15)
    @DisplayName("Verify specific setting name can be retrieved by index")
    public void testGetSettingNameByIndex() {
        String firstSettingName = settingListingPage.getSettingNameByIndex(0);
        assertNotNull(firstSettingName, 
            "First setting name should not be null");
        assertFalse(firstSettingName.trim().isEmpty(), 
            "First setting name should not be empty");
    }
    
    @Test
    @Order(16)
    @DisplayName("Verify specific status can be retrieved by index")
    public void testGetStatusByIndex() {
        String firstStatus = settingListingPage.getStatusByIndex(0);
        assertNotNull(firstStatus, 
            "First status should not be null");
        assertTrue(firstStatus.equals("Ready") || firstStatus.equals("Draft"), 
            "First status should be either 'Ready' or 'Draft'");
    }
    
    @Test
    @Order(17)
    @DisplayName("Verify row count matches data")
    public void testRowCount() {
        int rowCount = settingListingPage.getTableRowCount();
        int nameCount = settingListingPage.getSettingNames().size();
        int statusCount = settingListingPage.getStatusTags().size();
        
        assertEquals(rowCount, nameCount, 
            "Row count should match the number of setting names");
        assertEquals(rowCount, statusCount, 
            "Row count should match the number of status tags");
    }
    
    @Test
    @Order(18)
    @DisplayName("Verify finding setting by name")
    public void testFindSettingByName() {
        // Get the first setting name
        String firstSettingName = settingListingPage.getSettingNameByIndex(0);
        
        if (firstSettingName != null) {
            assertTrue(settingListingPage.isSettingNamePresent(firstSettingName), 
                "Should be able to find setting by its name");
            
            String status = settingListingPage.getStatusBySettingName(firstSettingName);
            assertNotNull(status, 
                "Should be able to get status for the setting");
        }
    }
    
    @Test
    @Order(19)
    @DisplayName("Verify counting settings by status")
    public void testCountSettingsByStatus() {
        int readyCount = settingListingPage.countSettingsByStatus("Ready");
        int draftCount = settingListingPage.countSettingsByStatus("Draft");
        int totalRows = settingListingPage.getTableRowCount();
        
        assertEquals(totalRows, readyCount + draftCount, 
            "Total of Ready and Draft counts should equal total row count");
    }
    
    @Test
    @Order(20)
    @DisplayName("Verify Ready filter shows only Ready settings")
    public void testReadyFilterShowsOnlyReadySettings() {
        settingListingPage.selectReadyFilter();

        List<WebElement> statusTags = settingListingPage.getStatusTags();
        
        for (WebElement status : statusTags) {
            assertEquals("Ready", status.getText(), 
                "When Ready filter is selected, all visible settings should have 'Ready' status");
        }
    }
    
    @Test
    @Order(21)
    @DisplayName("Verify Draft filter shows only Draft settings")
    public void testDraftFilterShowsOnlyDraftSettings() {
        settingListingPage.selectDraftFilter();

        List<WebElement> statusTags = settingListingPage.getStatusTags();
        
        for (WebElement status : statusTags) {
            assertEquals("Draft", status.getText(), 
                "When Draft filter is selected, all visible settings should have 'Draft' status");
        }
    }
    
    @Test
    @Order(22)
    @DisplayName("Verify pagination previous button state")
    public void testPaginationPreviousButton() {
        // On first page, previous button should be disabled
        assertFalse(settingListingPage.ispreviousPageButtonParentEnabled(), 
            "Previous page button should be disabled on first page");
    }
    
    @Test
    @Order(23)
    @DisplayName("Verify current page number")
    public void testCurrentPageNumber() {
        String currentPage = settingListingPage.getCurrentPageNumber();
        assertEquals("1", currentPage, 
            "Current page should be 1 on initial load");
    }
    
    @Test
    @Order(24)
    @DisplayName("Verify filter label is displayed")
    public void testFilterLabelDisplayed() {
        assertTrue(settingListingPage.isFilterLabelDisplayed(), 
            "Filter label should be displayed");
    }
    
    @Test
    @Order(25)
    @DisplayName("Verify navigating between filters maintains page state")
    public void testFilterNavigationMaintainsState() {
        // Select Ready filter
        settingListingPage.selectReadyFilter();
        assertTrue(settingListingPage.isReadyFilterSelected(), 
            "Ready filter should be selected");
        
        // Select Draft filter
        settingListingPage.selectDraftFilter();
        assertTrue(settingListingPage.isDraftFilterSelected(), 
            "Draft filter should be selected");
        assertFalse(settingListingPage.isReadyFilterSelected(), 
            "Ready filter should no longer be selected");
        
        // Select All filter
        settingListingPage.selectAllFilter();
        assertTrue(settingListingPage.isAllFilterSelected(), 
            "All filter should be selected");
        assertFalse(settingListingPage.isDraftFilterSelected(), 
            "Draft filter should no longer be selected");
    }
    
    @Test
    @Order(26)
    @DisplayName("Verify table data integrity")
    public void testTableDataIntegrity() {
        int rowCount = settingListingPage.getTableRowCount();
        
        for (int i = 0; i < rowCount; i++) {
            String name = settingListingPage.getSettingNameByIndex(i);
            String status = settingListingPage.getStatusByIndex(i);
            
            assertNotNull(name, "Setting name at index " + i + " should not be null");
            assertNotNull(status, "Status at index " + i + " should not be null");
            assertFalse(name.trim().isEmpty(), "Setting name at index " + i + " should not be empty");
            assertTrue(status.equals("Ready") || status.equals("Draft"), 
                "Status at index " + i + " should be either 'Ready' or 'Draft'");
        }
    }
    
    @AfterAll
    public static void tearDownTest() {
        // BaseTest.tearDown() is automatically called by JUnit due to @AfterAll in parent class
        // No need to call it explicitly here
    }
}
