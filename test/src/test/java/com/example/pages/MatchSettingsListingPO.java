package com.example.pages;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class MatchSettingsListingPO {
    
    private WebDriver driver;
    private WebDriverWait wait;
    
    // Locators for Page Header
    private By backToHomeButton = By.id("back-to-home-button");
    private By pageTitle = By.id("page-title");
    
    // Locators for Subheader
    private By subheaderText = By.xpath("//span[contains(@class, 'ant-typography-secondary') and contains(text(), 'Browse, clone, edit, delete')]");
    
    // Locators for Filter Bar
    private By filterLabel = By.xpath("//*[contains(normalize-space(.), 'Filter')]");
    private By filterAllRadio = By.xpath("//input[@type='radio' and @value='All']");
    private By filterReadyRadio = By.xpath("//input[@type='radio' and @value='Ready']");
    private By filterDraftRadio = By.xpath("//input[@type='radio' and @value='Draft']");
    private By allRadioLabel = By.xpath("//label[contains(@class, 'ant-radio-button-wrapper')]//span[text()='All']");
    private By readyRadioLabel = By.xpath("//label[contains(@class, 'ant-radio-button-wrapper')]//span[text()='Ready']");
    private By draftRadioLabel = By.xpath("//label[contains(@class, 'ant-radio-button-wrapper')]//span[text()='Draft']");
    
    // Locators for Table
    private By matchSettingsTable = By.xpath("//div[contains(@class, 'match-settings-table')]");
    private By tableHeaders = By.xpath("//thead[@class='ant-table-thead']//th");
    private By nameColumnHeader = By.xpath("//thead[contains(@class,'ant-table-thead')]//th[contains(normalize-space(.), 'Name')]");
    private By statusColumnHeader = By.xpath("//thead[contains(@class,'ant-table-thead')]//th[contains(normalize-space(.), 'Status')]");
    private By detailsColumnHeader = By.xpath("//thead[contains(@class,'ant-table-thead')]//th[contains(normalize-space(.), 'Details')]");
    private By tableRows = By.xpath("//tbody[@class='ant-table-tbody']//tr");
    
    // Locators for Table Cells
    private By settingNames = By.xpath("//tbody[@class='ant-table-tbody']//td[1]//strong");
    private By statusTags = By.xpath("//tbody[@class='ant-table-tbody']//td[2]//span[contains(@class, 'ant-tag')]");
    
    // Locators for Pagination
    private By previousPageButtonParent = By.xpath("//li[contains(@class, 'ant-pagination-prev')]");
    private By nextPageButton = By.xpath("//li[contains(@class, 'ant-pagination-next')]//button");
    private By currentPageNumber = By.xpath("//li[contains(@class, 'ant-pagination-item-active')]");
    
    // Locators for View Details Button (dynamic ID pattern: btn-view-{id})
    private By detailsButtons = By.xpath("//button[starts-with(@id, 'btn-view-')]");
    
    // Locators for Details Popup/Modal
    private By modal = By.xpath("//div[contains(@class, 'ant-modal-content')]");
    private By modalHeader = By.id("popup-header-title");
    private By modalCloseButton = By.xpath("//button[@aria-label='Close']");
    private By modalStatusTag = By.id("popup-status-tag");
    private By modalDescriptionText = By.id("popup-description-text");
    private By modalDescriptionTable = By.id("popup-description-table");
    private By modalReferenceSolutionTable = By.id("popup-reference-solution-table");
    private By modalReferenceSolutionText = By.id("popup-reference-solution-text");
    
    // Locators for Public Tests Section
    private By publicTestsSection = By.xpath("//div[@class='tests-section'][.//h4[text()='Public Tests']]");
    private By publicTestCards = By.xpath("//div[starts-with(@id, 'public-test-card-')]");
    
    // Locators for Private Tests Section  
    private By privateTestsSection = By.xpath("//div[@class='tests-section'][.//h4[text()='Private Tests']]");
    
    // Constructor
    public MatchSettingsListingPO(WebDriver driver) {
        this.driver = driver;
        // Use longer timeout in CI environments
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }
    
    // Page Header Methods
    public void clickBackToHomeButton() {
        wait.until(ExpectedConditions.elementToBeClickable(backToHomeButton)).click();
    }
    
    public boolean isBackToHomeButtonDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(backToHomeButton)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getPageTitle() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(pageTitle)).getText();
    }
    
    public boolean isPageTitleDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(pageTitle)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    // Subheader Methods
    public String getSubheaderText() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(subheaderText)).getText();
    }
    
    public boolean isSubheaderDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(subheaderText)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    // Filter Methods
    public void selectAllFilter() {
        wait.until(ExpectedConditions.elementToBeClickable(allRadioLabel)).click();
    }
    
    public void selectReadyFilter() {
        wait.until(ExpectedConditions.elementToBeClickable(readyRadioLabel)).click();
    }
    
    public void selectDraftFilter() {
        wait.until(ExpectedConditions.elementToBeClickable(draftRadioLabel)).click();
    }
    
    public boolean isAllFilterSelected() {
        return driver.findElement(filterAllRadio).isSelected();
    }
    
    public boolean isReadyFilterSelected() {
        return driver.findElement(filterReadyRadio).isSelected();
    }
    
    public boolean isDraftFilterSelected() {
        return driver.findElement(filterDraftRadio).isSelected();
    }
    
    public boolean isFilterLabelDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(filterLabel)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    // Table Methods
    public boolean isTableDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(matchSettingsTable)).isDisplayed();
    }
    
    public List<WebElement> getTableHeaders() {
        return driver.findElements(tableHeaders);
    }
    
    public int getTableHeaderCount() {
        return getTableHeaders().size();
    }
    
    public boolean isNameColumnHeaderDisplayed() {
        return driver.findElement(nameColumnHeader).isDisplayed();
    }
    
    public boolean isStatusColumnHeaderDisplayed() {
        return driver.findElement(statusColumnHeader).isDisplayed();
    }

    public boolean isDetailsColumnHeaderDisplayed() {
        try {
            return driver.findElement(detailsColumnHeader).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public List<WebElement> getTableRows() {
        return wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(tableRows));
    }
    
    public int getTableRowCount() {
        return getTableRows().size();
    }
    
    public List<WebElement> getSettingNames() {
        return driver.findElements(settingNames);
    }
    
    public List<WebElement> getStatusTags() {
        return driver.findElements(statusTags);
    }
    
    public String getSettingNameByIndex(int index) {
        List<WebElement> names = getSettingNames();
        if (index >= 0 && index < names.size()) {
            return names.get(index).getText();
        }
        return null;
    }
    
    public String getStatusByIndex(int index) {
        List<WebElement> statuses = getStatusTags();
        if (index >= 0 && index < statuses.size()) {
            return statuses.get(index).getText();
        }
        return null;
    }
    
    public WebElement getRowBySettingName(String settingName) {
        By rowLocator = By.xpath("//tbody[@class='ant-table-tbody']//tr[.//strong[text()='" + settingName + "']]");
        return wait.until(ExpectedConditions.presenceOfElementLocated(rowLocator));
    }
    
    public String getStatusBySettingName(String settingName) {
        By statusLocator = By.xpath("//tbody[@class='ant-table-tbody']//tr[.//strong[text()='" + settingName + "']]//td[2]//span[contains(@class, 'ant-tag')]");
        return driver.findElement(statusLocator).getText();
    }
    
    public boolean isSettingNamePresent(String settingName) {
        try {
            getRowBySettingName(settingName);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public int countSettingsByStatus(String status) {
        By statusLocator = By.xpath("//tbody[@class='ant-table-tbody']//span[contains(@class, 'ant-tag') and text()='" + status + "']");
        return driver.findElements(statusLocator).size();
    }
    
    // Pagination Methods
    public void clickPreviousPage() {
        WebElement prevButton = driver.findElement(previousPageButtonParent);
        if (prevButton.isEnabled()) {
            prevButton.click();
        }
    }
    
    public void clickNextPage() {
        WebElement nextButton = driver.findElement(nextPageButton);
        if (nextButton.isEnabled()) {
            nextButton.click();
        }
    }
    
    public boolean ispreviousPageButtonParentEnabled() {
        WebElement prevButton = driver.findElement(previousPageButtonParent);
        return !prevButton.getAttribute("class").contains("ant-pagination-disabled");
    }
    
    public boolean isNextPageButtonEnabled() {
        WebElement nextButton = driver.findElement(nextPageButton);
        return !nextButton.getAttribute("class").contains("ant-pagination-disabled");
    }
    
    public String getCurrentPageNumber() {
        return driver.findElement(currentPageNumber).getText();
    }
    
    // Details Button Methods
    public List<WebElement> getDetailsButtons() {
        return driver.findElements(detailsButtons);
    }
    
    public void clickDetailsButtonByIndex(int index) {
        List<WebElement> buttons = getDetailsButtons();
        if (index >= 0 && index < buttons.size()) {
            // Get the button ID to create a proper By locator for fresh element lookup
            String buttonId = buttons.get(index).getAttribute("id");
            By buttonLocator = By.id(buttonId);
            wait.until(ExpectedConditions.elementToBeClickable(buttonLocator)).click();
        }
    }
    
    public void clickDetailsButtonById(String buttonId) {
        By buttonLocator = By.id(buttonId);
        wait.until(ExpectedConditions.elementToBeClickable(buttonLocator)).click();
    }
    
    public void clickFirstDetailsButton() {
        clickDetailsButtonByIndex(0);
    }
    
    public boolean isDetailsButtonDisplayedByIndex(int index) {
        try {
            List<WebElement> buttons = getDetailsButtons();
            return index >= 0 && index < buttons.size() && buttons.get(index).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    // Modal/Popup Methods
    public boolean isModalDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(modal)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public void waitForModalToAppear() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(modal));
    }
    
    public void waitForModalToDisappear() {
        wait.until(ExpectedConditions.invisibilityOfElementLocated(modal));
    }
    
    public void closeModal() {
        wait.until(ExpectedConditions.elementToBeClickable(modalCloseButton)).click();
    }
    
    public String getModalTitle() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(modalHeader)).getText();
    }
    
    public boolean isModalTitleDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(modalHeader)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getModalStatus() {
        return driver.findElement(modalStatusTag).getText();
    }
    
    public boolean isModalStatusTagDisplayed() {
        try {
            return driver.findElement(modalStatusTag).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getModalDescription() {
        return driver.findElement(modalDescriptionText).getText();
    }
    
    public boolean isModalDescriptionDisplayed() {
        try {
            return driver.findElement(modalDescriptionText).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isModalDescriptionTableDisplayed() {
        try {
            return driver.findElement(modalDescriptionTable).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getModalReferenceSolution() {
        return driver.findElement(modalReferenceSolutionText).getText();
    }
    
    public boolean isModalReferenceSolutionDisplayed() {
        try {
            return driver.findElement(modalReferenceSolutionText).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isModalReferenceSolutionTableDisplayed() {
        try {
            return driver.findElement(modalReferenceSolutionTable).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isPublicTestsSectionDisplayed() {
        try {
            return driver.findElement(publicTestsSection).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isPrivateTestsSectionDisplayed() {
        try {
            return driver.findElement(privateTestsSection).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public List<WebElement> getPublicTestCards() {
        return driver.findElements(publicTestCards);
    }
    
    public int getPublicTestCardsCount() {
        return getPublicTestCards().size();
    }
    
    public String getPublicTestInput(int testIndex) {
        By inputLocator = By.id("public-test-" + testIndex + "-input");
        return driver.findElement(inputLocator).getText();
    }
    
    public String getPublicTestOutput(int testIndex) {
        By outputLocator = By.id("public-test-" + testIndex + "-output");
        return driver.findElement(outputLocator).getText();
    }
    
    public boolean isPublicTestCardDisplayed(int testIndex) {
        try {
            By cardLocator = By.id("public-test-card-" + testIndex);
            return driver.findElement(cardLocator).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isModalCloseButtonDisplayed() {
        try {
            return driver.findElement(modalCloseButton).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean verifyModalElements() {
        return isModalTitleDisplayed() 
            && isModalStatusTagDisplayed() 
            && isModalDescriptionTableDisplayed() 
            && isModalReferenceSolutionTableDisplayed()
            && isPublicTestsSectionDisplayed() 
            && isPrivateTestsSectionDisplayed()
            && isModalCloseButtonDisplayed();
    }
    
    // Verification Methods
    public boolean isPageLoaded() {
        try {
            // Wait for the page title first
            wait.until(ExpectedConditions.visibilityOfElementLocated(pageTitle));
            
            // Wait for back button to be visible
            wait.until(ExpectedConditions.visibilityOfElementLocated(backToHomeButton));
            
            // Wait for the table container (even if empty)
            wait.until(ExpectedConditions.presenceOfElementLocated(matchSettingsTable));
            
            // Additional check to ensure back button is interactive
            wait.until(ExpectedConditions.elementToBeClickable(backToHomeButton));
            
            return true;
        } catch (Exception e) {
            System.err.println("Page load failed: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean verifyPageElements() {
        return isBackToHomeButtonDisplayed() 
            && isPageTitleDisplayed() 
            && isSubheaderDisplayed() 
            && isFilterLabelDisplayed() 
            && isTableDisplayed();
    }



}
