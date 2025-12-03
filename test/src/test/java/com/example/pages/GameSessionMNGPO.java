package com.example.pages;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class GameSessionMNGPO {
    private WebDriver driver;
    private WebDriverWait wait;
    private static final String PAGE_TITLE_XPATH = "";
    private static final String PAGE_TITLE = "";
    private static final String ANTD_DIV_TABLE_XPATH = "";
    private static final String TABLE_BODY_XPATH = ANTD_DIV_TABLE_XPATH + "";
    private static final String BUTTON_XPATH = "";
    private static final String SUCCESS_MESSAGE_XPATH = "";
    private static final String WARNING_MESSAGE_XPATH = "";
    private static final String COPY_BUTTON = "//button[.//span[@aria-label='copy']]";
    private static final String DELETE_BUTTON = "//button[.//span[@aria-label='delete']]";
    private static final String VIEW_BUTTON = "//button[.//span[@aria-label='eye']]";
    private static final String UPDATE_BUTTON = "//button[.//span[@aria-label='edit']]";
    private By modal = By.xpath("//div[@class='ant-modal-content']");
    private static final String modalViewInputGameSessionName = "//*[@id='game-session-name']"; 
    private static final String modalViewInputStartDate = "//*[@id='game-session-start-date']";
    
    
    public GameSessionMNGPO(WebDriver driver) {
        this.driver = driver;
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
 
    }

    public boolean isPageLoaded() {
        wait.until(ExpectedConditions.visibilityOf(getPageTitle()));
        return getPageTitle().isDisplayed() && getPageTitle().getText().equals(PAGE_TITLE);
    }

    public WebElement getPageTitle() {
        return driver.findElement(By.xpath(PAGE_TITLE_XPATH));
    }
    
    private WebElement getElementAt(int row, int col) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TABLE_BODY_XPATH + "/tr[" + Integer.toString(row) + "]/td[" + Integer.toString(col) + "]")));
    }

    public WebElement getCopyButttonAt(int row) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TABLE_BODY_XPATH + "/tr[" +  Integer.toString(row) + "]" + COPY_BUTTON)));
    }

    public WebElement getDeleteButttonAt(int row) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TABLE_BODY_XPATH + "/tr[" +  Integer.toString(row) + "]" + DELETE_BUTTON)));
    }

    public WebElement getViewButttonAt(int row) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TABLE_BODY_XPATH + "/tr[" +  Integer.toString(row) + "]" + VIEW_BUTTON)));
    }


    public WebElement getUpdateButttonAt(int row) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TABLE_BODY_XPATH + "/tr[" +  Integer.toString(row) + "]" + UPDATE_BUTTON)));
    }

    public WebElement takeRow(String gameSessionName) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TABLE_BODY_XPATH + "//tr[contains(., " + gameSessionName + ")]")));
    }

    public List<WebElement> getRows() {
        return wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.xpath(TABLE_BODY_XPATH + "/tr")));
    }

    public WebElement getTable() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TABLE_BODY_XPATH)));

    }

    public int gameSessionIndex(String gameSessionName) {
        return (driver.findElements(By.xpath("//tr[contains(.,  "+ gameSessionName+  ")]/preceding-sibling::tr"))).size() + 1;
    }

    public boolean isModalDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(modal)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public WebElement getModalGameSessionName() {
        return driver.findElement(By.xpath(modalViewInputGameSessionName));
    }

    public WebElement getModalStartDate() {
        return driver.findElement(By.xpath(modalViewInputStartDate));
    }

}
