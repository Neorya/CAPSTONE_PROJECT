package com.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.List;

public class settingListingPO {
    
    private WebDriver driver;
    private WebDriverWait wait;
    
    // Locators for Page Header
    private By backToHomeButton = By.id("back-to-home-button");
    private By pageTitle = By.cssSelector("h2.page-title");
    
    // Locators for Subheader
    private By subheaderText = By.cssSelector("span.ant-typography-secondary");
    
    // Locators for Filter Bar
    private By filterLabel = By.cssSelector(".filter-bar strong");
    private By filterAllRadio = By.cssSelector("input[type='radio'][value='All']");
    private By filterReadyRadio = By.cssSelector("input[type='radio'][value='Ready']");
    private By filterDraftRadio = By.cssSelector("input[type='radio'][value='Draft']");
    private By allRadioLabel = By.cssSelector("label.ant-radio-button-wrapper:has(input[value='All'])");
    private By readyRadioLabel = By.cssSelector("label.ant-radio-button-wrapper:has(input[value='Ready'])");
    private By draftRadioLabel = By.cssSelector("label.ant-radio-button-wrapper:has(input[value='Draft'])");
    
    // Locators for Table
    private By matchSettingsTable = By.className("match-settings-table");
    private By tableHeaders = By.cssSelector("thead.ant-table-thead th");
    private By nameColumnHeader = By.cssSelector("thead.ant-table-thead th:nth-child(1)");
    private By statusColumnHeader = By.cssSelector("thead.ant-table-thead th:nth-child(2)");
    private By tableRows = By.cssSelector("tbody.ant-table-tbody tr");
    
    // Locators for Table Cells
    private By settingNames = By.cssSelector("tbody.ant-table-tbody td:first-child strong");
    private By statusTags = By.cssSelector("tbody.ant-table-tbody td:nth-child(2) span.ant-tag");
    
    // Locators for Pagination
    private By previousPageButtonParent = By.cssSelector("li.ant-pagination-prev");
    private By nextPageButton = By.cssSelector("li.ant-pagination-next button");
    private By currentPageNumber = By.cssSelector("li.ant-pagination-item-active");
    
    // Constructor
    public settingListingPO(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }
    
    // Page Header Methods
    public void clickBackToHomeButton() {
        wait.until(ExpectedConditions.elementToBeClickable(backToHomeButton)).click();
    }
    
    public boolean isBackToHomeButtonDisplayed() {
        return driver.findElement(backToHomeButton).isDisplayed();
    }
    
    public String getPageTitle() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(pageTitle)).getText();
    }
    
    public boolean isPageTitleDisplayed() {
        return driver.findElement(pageTitle).isDisplayed();
    }
    
    // Subheader Methods
    public String getSubheaderText() {
        return driver.findElement(subheaderText).getText();
    }
    
    public boolean isSubheaderDisplayed() {
        return driver.findElement(subheaderText).isDisplayed();
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
        return driver.findElement(filterLabel).isDisplayed();
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
        // XPath needed here for text matching within nested elements
        By rowLocator = By.xpath("//tbody[@class='ant-table-tbody']//tr[.//strong[text()='" + settingName + "']]");
        return wait.until(ExpectedConditions.presenceOfElementLocated(rowLocator));
    }
    
    public String getStatusBySettingName(String settingName) {
        // XPath needed here for text matching
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
        // XPath needed here for text matching within span elements
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
    
    // Verification Methods
    public boolean isPageLoaded() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(pageTitle));
            wait.until(ExpectedConditions.visibilityOfElementLocated(matchSettingsTable));
            return true;
        } catch (Exception e) {
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
