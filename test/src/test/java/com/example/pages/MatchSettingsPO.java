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
    private static final String EDIT_MODAL_CLASS = "match-setting-edit-modal";
    private static final String INPUT_TITLE_ID = "title";
    private static final String SAVE_BUTTON_XPATH = "//button[span[text()='Save Changes']]";
    private static final String POPCONFIRM_OK_XPATH = "//div[contains(@class, 'ant-popover-buttons')]//button[contains(@class, 'ant-btn-primary')]";
    private static final String TABLE_ROWS_XPATH = "//tbody[@class='ant-table-tbody']//tr";
    private static final String EDIT_BUTTONS_XPATH = "//button[starts-with(@id, 'btn-edit-')]";

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
            // It's possible the table is empty, which is also a valid state if no data exists
            // But usually we expect data for these tests
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

    public boolean isEditModalVisible() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(By.className(EDIT_MODAL_CLASS))).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean waitForEditModalToClose() {
        try {
            return wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className(EDIT_MODAL_CLASS)));
        } catch (Exception e) {
            return false;
        }
    }

    public void clickEditButton(String id) {
        WebElement editBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("btn-edit-" + id)));
        editBtn.click();
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

    public void setSettingName(String name) {
        WebElement titleInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(INPUT_TITLE_ID)));
        titleInput.click(); // Click first to ensure focus
        titleInput.clear();
        titleInput.sendKeys(Keys.CONTROL + "a");
        titleInput.sendKeys(Keys.BACK_SPACE);
        titleInput.sendKeys(name);
    }
    
    public void setSettingDescription(String description) {
        WebElement descInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("description")));
        descInput.click();
        descInput.clear();
        descInput.sendKeys(Keys.CONTROL + "a");
        descInput.sendKeys(Keys.BACK_SPACE);
        descInput.sendKeys(description);
    }

    public void clickSaveChangesButton() {
        WebElement saveBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(SAVE_BUTTON_XPATH)));
        saveBtn.click();
    }
}