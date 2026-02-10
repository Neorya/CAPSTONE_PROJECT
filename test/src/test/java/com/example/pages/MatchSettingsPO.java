package com.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;
import org.openqa.selenium.Keys;

public class MatchSettingsPO {
    private WebDriver driver;
    private WebDriverWait wait;

    private static final String PAGE_TITLE_ID = "page-title";
    private static final String TABLE_ROWS_XPATH = "//tbody[@class='ant-table-tbody']//tr";
    private static final String EDIT_BUTTONS_XPATH = "//button[starts-with(@id, 'btn-edit-')]";
    private static final String POPCONFIRM_OK_XPATH = "//div[contains(@class, 'ant-popover-buttons')]//button[contains(@class, 'ant-btn-primary')]";

    public MatchSettingsPO(WebDriver driver) {
        this.driver = driver;
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }

    public boolean isPageLoaded() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(PAGE_TITLE_ID))).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void waitForTableData() {
        try {
            wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.xpath(TABLE_ROWS_XPATH)));
        } catch (Exception e) {
            System.out.println("Warning: Timeout waiting for table rows or table is empty.");
        }
    }

    public String getFirstMatchSettingId() {
        try {
            WebElement firstEditButton = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath(EDIT_BUTTONS_XPATH)));
            String buttonId = firstEditButton.getAttribute("id");
            // IDs are like "btn-edit-1", extract "1"
            return buttonId.replace("btn-edit-", "");
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Clicks the edit button for the given match setting ID.
     * This navigates to /match-settings/{id}/edit (the full edit page),
     * NOT a modal.
     */
    public void clickEditButton(String id) {
        WebElement editBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("btn-edit-" + id)));
        editBtn.click();
    }

    /**
     * Waits for the edit page to load after clicking edit.
     * The edit page reuses the CreateMatchSetting component,
     * so we look for its heading and editor.
     */
    public boolean isEditPageLoaded() {
        try {
            // The edit page shows "Edit Match Setting" in an h2
            By editHeading = By.xpath("//h2[text()='Edit Match Setting']");
            wait.until(ExpectedConditions.visibilityOfElementLocated(editHeading));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Checks that the current URL matches the edit page pattern.
     */
    public boolean isOnEditPage(String id) {
        String currentUrl = driver.getCurrentUrl();
        return currentUrl.contains("/match-settings/" + id + "/edit");
    }

    /**
     * Waits for the URL to contain the edit path.
     */
    public boolean waitForEditPageNavigation(String id) {
        try {
            wait.until(ExpectedConditions.urlContains("/match-settings/" + id + "/edit"));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void clickCloneButton(String id) {
        WebElement cloneBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("btn-clone-" + id)));
        cloneBtn.click();
        confirmPopconfirm();
    }

    public void clickDeleteButton(String id) {
        WebElement deleteBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("btn-delete-" + id)));
        deleteBtn.click();
        confirmPopconfirm();
    }

    public void confirmPopconfirm() {
        By popconfirmOkBtn = By.xpath("//div[contains(@class, 'ant-popover') or contains(@class, 'ant-popconfirm')]//button[span[text()='Yes']]");
        
        try {
            WebElement okBtn = wait.until(ExpectedConditions.elementToBeClickable(popconfirmOkBtn));
            okBtn.click();
        } catch (Exception e) {
            WebElement okBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[span[text()='Yes']]")));
            okBtn.click();
        }
    }
}