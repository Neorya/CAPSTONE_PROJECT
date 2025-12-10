package com.example.tests;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.openqa.selenium.WebElement;

import com.example.pages.settingListingPO;

/**
 * Test class for Match Settings Listing page functionality.
 * Extends BaseTest to inherit WebDriver lifecycle management.
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SettingListingTest extends BaseTest {
    
    private settingListingPO settingListingPage;
    
    @BeforeEach
    public void navigateToPage() {
        // Initialize Page Object with the driver from BaseTest
        settingListingPage = new settingListingPO(driver);
        
        // Navigate to the settings listing page before each test
        navigateTo("/match-settings");
        
        // Give extra time for page to load in CI environments
        if (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) {
            try {
                Thread.sleep(5000); // Increased from default
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        // Wait for page to be fully loaded by checking if critical element exists
        settingListingPage.isPageLoaded();
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
        assertEquals(3, settingListingPage.getTableHeaderCount(),
            "Table should have 3 headers (Name, Status, and Details)");
        assertTrue(settingListingPage.isNameColumnHeaderDisplayed(),
            "Name column header should be displayed");
        assertTrue(settingListingPage.isStatusColumnHeaderDisplayed(),
            "Status column header should be displayed");
        // Note: Details column may not have a text header, so we don't check for it specifically
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
    
    @Test
    @Order(27)
    @DisplayName("Verify details buttons are displayed")
    public void testDetailsButtonsDisplayed() {
        List<WebElement> buttons = settingListingPage.getDetailsButtons();
        int rowCount = settingListingPage.getTableRowCount();
        
        assertFalse(buttons.isEmpty(), 
            "Details buttons list should not be empty");
        assertEquals(rowCount, buttons.size(), 
            "Number of details buttons should match number of table rows");
    }
    
    @Test
    @Order(28)
    @DisplayName("Verify clicking details button opens modal")
    public void testClickDetailsButtonOpensModal() {
        // Click the first details button
        settingListingPage.clickFirstDetailsButton();
        
        // Wait for modal to appear
        settingListingPage.waitForModalToAppear();
        
        // Verify modal is displayed
        assertTrue(settingListingPage.isModalDisplayed(), 
            "Modal should be displayed after clicking details button");
    }
    
    @Test
    @Order(29)
    @DisplayName("Verify modal contains all required elements")
    public void testModalContainsAllElements() {
        // Click the first details button
        settingListingPage.clickFirstDetailsButton();
        settingListingPage.waitForModalToAppear();
        
        // Verify all modal elements are present
        assertTrue(settingListingPage.verifyModalElements(), 
            "All modal elements should be displayed");
    }
    
    @Test
    @Order(30)
    @DisplayName("Verify modal title is displayed")
    public void testModalTitleDisplayed() {
        settingListingPage.clickFirstDetailsButton();
        settingListingPage.waitForModalToAppear();
        
        assertTrue(settingListingPage.isModalTitleDisplayed(), 
            "Modal title should be displayed");
        
        String title = settingListingPage.getModalTitle();
        assertNotNull(title, "Modal title should not be null");
        assertFalse(title.trim().isEmpty(), "Modal title should not be empty");
    }
    
    @Test
    @Order(31)
    @DisplayName("Verify modal status tag is displayed")
    public void testModalStatusTagDisplayed() {
        settingListingPage.clickFirstDetailsButton();
        settingListingPage.waitForModalToAppear();
        
        assertTrue(settingListingPage.isModalStatusTagDisplayed(), 
            "Modal status tag should be displayed");
        
        String status = settingListingPage.getModalStatus();
        assertNotNull(status, "Modal status should not be null");
        assertTrue(status.equals("Ready") || status.equals("Draft"), 
            "Modal status should be either 'Ready' or 'Draft'");
    }
    
    @Test
    @Order(32)
    @DisplayName("Verify modal description is displayed")
    public void testModalDescriptionDisplayed() {
        settingListingPage.clickFirstDetailsButton();
        settingListingPage.waitForModalToAppear();
        
        assertTrue(settingListingPage.isModalDescriptionTableDisplayed(), 
            "Modal description table should be displayed");
        assertTrue(settingListingPage.isModalDescriptionDisplayed(), 
            "Modal description text should be displayed");
        
        String description = settingListingPage.getModalDescription();
        assertNotNull(description, "Modal description should not be null");
    }
    
    @Test
    @Order(33)
    @DisplayName("Verify modal reference solution is displayed")
    public void testModalReferenceSolutionDisplayed() {
        settingListingPage.clickFirstDetailsButton();
        settingListingPage.waitForModalToAppear();
        
        assertTrue(settingListingPage.isModalReferenceSolutionTableDisplayed(), 
            "Modal reference solution table should be displayed");
        assertTrue(settingListingPage.isModalReferenceSolutionDisplayed(), 
            "Modal reference solution text should be displayed");
        
        String referenceSolution = settingListingPage.getModalReferenceSolution();
        assertNotNull(referenceSolution, "Modal reference solution should not be null");
    }
    
    @Test
    @Order(34)
    @DisplayName("Verify modal public tests section is displayed")
    public void testModalPublicTestsDisplayed() {
        settingListingPage.clickFirstDetailsButton();
        settingListingPage.waitForModalToAppear();
        
        assertTrue(settingListingPage.isPublicTestsSectionDisplayed(), 
            "Public tests section should be displayed");
        
        int publicTestCount = settingListingPage.getPublicTestCardsCount();
        assertTrue(publicTestCount > 0, 
            "At least one public test card should be displayed");
    }
    
    @Test
    @Order(35)
    @DisplayName("Verify modal private tests section is displayed")
    public void testModalPrivateTestsDisplayed() {
        settingListingPage.clickFirstDetailsButton();
        settingListingPage.waitForModalToAppear();
        
        assertTrue(settingListingPage.isPrivateTestsSectionDisplayed(), 
            "Private tests section should be displayed");
    }
    
    @Test
    @Order(36)
    @DisplayName("Verify public test card contents")
    public void testPublicTestCardContents() {
        settingListingPage.clickFirstDetailsButton();
        settingListingPage.waitForModalToAppear();
        
        // Verify first public test card
        assertTrue(settingListingPage.isPublicTestCardDisplayed(0), 
            "First public test card should be displayed");
        
        String input = settingListingPage.getPublicTestInput(0);
        String output = settingListingPage.getPublicTestOutput(0);
        
        assertNotNull(input, "Public test input should not be null");
        assertNotNull(output, "Public test output should not be null");
        assertFalse(input.trim().isEmpty(), "Public test input should not be empty");
        assertFalse(output.trim().isEmpty(), "Public test output should not be empty");
    }
    
    @Test
    @Order(37)
    @DisplayName("Verify modal close button is displayed")
    public void testModalCloseButtonDisplayed() {
        settingListingPage.clickFirstDetailsButton();
        settingListingPage.waitForModalToAppear();
        
        assertTrue(settingListingPage.isModalCloseButtonDisplayed(), 
            "Modal close button should be displayed");
    }
    
    @Test
    @Order(38)
    @DisplayName("Verify closing modal with close button")
    public void testCloseModalWithCloseButton() {
        settingListingPage.clickFirstDetailsButton();
        settingListingPage.waitForModalToAppear();
        
        assertTrue(settingListingPage.isModalDisplayed(), 
            "Modal should be displayed before closing");
        
        // Close the modal
        settingListingPage.closeModal();
        settingListingPage.waitForModalToDisappear();
        
        assertFalse(settingListingPage.isModalDisplayed(), 
            "Modal should not be displayed after closing");
    }
    
    @Test
    @Order(39)
    @DisplayName("Verify modal data matches table data")
    public void testModalDataMatchesTableData() {
        // Get data from the first row in the table
        String tableName = settingListingPage.getSettingNameByIndex(0);
        String tableStatus = settingListingPage.getStatusByIndex(0);
        
        // Open the modal
        settingListingPage.clickFirstDetailsButton();
        settingListingPage.waitForModalToAppear();
        
        // Get data from the modal
        String modalTitle = settingListingPage.getModalTitle();
        String modalStatus = settingListingPage.getModalStatus();
        
        // Verify they match
        assertEquals(tableName, modalTitle, 
            "Modal title should match the setting name from the table");
        assertEquals(tableStatus, modalStatus, 
            "Modal status should match the status from the table");
        
        // Close modal for cleanup
        settingListingPage.closeModal();
    }
    
    @Test
    @Order(40)
    @DisplayName("Verify opening different details shows different data")
    public void testDifferentDetailsShowDifferentData() {
        int rowCount = settingListingPage.getTableRowCount();
        
        // Only run if we have at least 2 rows
        if (rowCount < 2) {
            return; // Skip test if not enough data
        }
        
        // Get first setting's name
        String firstName = settingListingPage.getSettingNameByIndex(0);
        settingListingPage.clickDetailsButtonByIndex(0);
        settingListingPage.waitForModalToAppear();
        String firstModalTitle = settingListingPage.getModalTitle();
        assertEquals(firstName, firstModalTitle, 
            "First modal title should match first setting name");
        settingListingPage.closeModal();
        settingListingPage.waitForModalToDisappear();
        
        // Get second setting's name
        String secondName = settingListingPage.getSettingNameByIndex(1);
        settingListingPage.clickDetailsButtonByIndex(1);
        settingListingPage.waitForModalToAppear();
        String secondModalTitle = settingListingPage.getModalTitle();
        assertEquals(secondName, secondModalTitle, 
            "Second modal title should match second setting name");
        settingListingPage.closeModal();
    }
    
}
