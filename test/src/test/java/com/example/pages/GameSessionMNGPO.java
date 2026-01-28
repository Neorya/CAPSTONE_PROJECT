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
    private static final String PAGE_TITLE_XPATH = "//h2[text()='Game Sessions']";
    private static final String PAGE_TITLE = "Game Sessions";
    private static final String ANTD_DIV_TABLE_XPATH = "//*[contains(@class, 'ant-table-content')]";
    private static final String TABLE_BODY_XPATH = ANTD_DIV_TABLE_XPATH + "/table/tbody";
    private static final String BUTTON_XPATH = "";
    private static final String SUCCESS_MESSAGE_XPATH = "";
    private static final String WARNING_MESSAGE_XPATH = "";
    private static final String COPY_BUTTON = "//button[@data-testid='clone-session-btn']";
    private static final String DELETE_BUTTON = "//button[@data-testid='delete-session-btn']";
    private static final String VIEW_BUTTON = "//button[@data-testid='view-session-btn']";
    private static final String UPDATE_BUTTON = "//button[@data-testid='edit-session-btn']";
    private static final String BACK_TO_HOME_BUTTON_ID = "//button[@id='back-to-home-button']";

    // POP UP - CLONE 
    private static final String DIV_POP_UP_CLONE = "//div[contains(@class, 'ant-popover-inner')]";
    private static final String NOPE_POP_UP_CLONE = "//div[contains(@class, 'ant-popover')]//button[contains(., 'No')]";
    private static final String YES_POP_UP_CLONE_ = "//div[contains(@class, 'ant-popover')]//button[contains(., 'Yes')]";


    // POP UP - DELETE
    private static final String DIV_POP_UP_DELETE = "//div[contains(@class, 'ant-popover-inner')]";
    private static final String NOPE_POP_UP_DELETE= "//div[contains(@class, 'ant-popover')]//button[contains(., 'No')]";
    private static final String YES_POP_UP_DELETE_ = "//div[contains(@class, 'ant-popover')]//button[contains(., 'Yes')]";

    // MODAL - VIEW / UPDATE 
    private static final String MODAL_ID_NAME = "//*[contains(@class, 'ant-modal-title')]";
    private static final String MODAL_DIV = "//div[contains(@class, 'ant-modal-content')]";
    private static final String MODAL_NAME = "//*[@id=\"name\"]";
    private static final String MODAL_START_DATE = "//*[@id=\"start_date\"]";

    //  MODAL - FOOTER
    private static final String MODAL_FOOTER_ID = "//*[contains(@class, 'ant-modal-footer')]";
    private static final String BUTTON_FOOTER_UPDT_CANCEL = MODAL_FOOTER_ID + "/button[1]";
    private static final String BUTTON_FOOTER_UPDT_SAVE   = MODAL_FOOTER_ID + "/button[2]";
    private static final String BUTTON_FOOTER_VIEW_EDIT   = MODAL_FOOTER_ID + "/button[1]";
    private static final String BUTTON_FOOTER_VIEW_CLOSE  = MODAL_FOOTER_ID + "/button[2]";

    private static final String START_DATE_INPUT_ERROR    = "//*[@id=\"start_date_help\"]/div";
    private static final String ERROR_EMPTY_START_DATE    = "Please select a start date";

    private static final String NAME_INPUT_ERROR          = "//*[@id=\"name_help\"]/div";
    private static final String ERROR_EMPTY_INPUT_NAME    = "Please enter a game session name";
    private static final String ERROR_LESS_INPUT_NAME     = "Game session name must be at least 5 characters";

    // EDIT MODAL - TABLE
    private static final String MODAL_EDIT_TABLE         = "//*[contains(@class, 'ant-table-content')]";
    private static final String OK_BUTTON_CALENDAR       = "//button[contains(@class, 'ant-picker-ok')]/span | //div[contains(@class, 'ant-picker-dropdown')]//button[contains(@class, 'ant-btn-primary')]/span";


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

    public WebElement getCopyButtonAt(int row) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TABLE_BODY_XPATH + "/tr[" +  Integer.toString(row) + "]" + COPY_BUTTON)));
    }

    public WebElement getDeleteButtonAt(int row) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TABLE_BODY_XPATH + "/tr[" +  Integer.toString(row) + "]" + DELETE_BUTTON)));
    }

    public WebElement getViewButtonAt(int row) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TABLE_BODY_XPATH + "/tr[" +  Integer.toString(row) + "]" + VIEW_BUTTON)));
    }


    public WebElement getUpdateButtonAt(int row) {
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

    public WebElement getOkButtonCalendar() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(OK_BUTTON_CALENDAR)));
    }

    public void waitForRow(String rowName) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TABLE_BODY_XPATH + "//tr[contains(., '" + rowName + "')]")));
    }

    // CLONE POP UP
    //  Get the clone pop up that appear when the use press the clone button
    public WebElement getClonePOPUP() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(DIV_POP_UP_CLONE)));
    }

    //  Get the Yes button element inside the clone pop up
    public WebElement getYesClonePOPUP() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(YES_POP_UP_CLONE_)));    
    }

    //  Get the No button element inside the clone pop up
    public WebElement getNoClonePOPUP() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(NOPE_POP_UP_CLONE)));    
    }

    // DELETE POP UP
    //  Get the delete pop up that appear when the use press the clone button
    public WebElement getDeletePOPUP() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(DIV_POP_UP_DELETE)));
    }

    //  Get the Yes button element inside the delete pop up
    public WebElement getYesDeletePOPUP() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(YES_POP_UP_DELETE_)));    
    }

    //  Get the No button element inside the delete pop up
    public WebElement getNoDeletePOPUP() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(NOPE_POP_UP_DELETE)));    
    }

    public int gameSessionIndex(String gameSessionName) {
        return driver.findElements(By.xpath("//tr[contains(., '" + gameSessionName + "')]/preceding-sibling::tr")).size() + 1;
    }


    // MODAL UPDATE / VIEW
    public String getModalNAME() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(MODAL_ID_NAME))).getText();
    }

    public boolean isModalDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(MODAL_DIV))).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void waitForModalToDisappear() {
        try {
            wait.until(ExpectedConditions.invisibilityOfElementLocated(By.xpath(MODAL_DIV)));
        } catch (Exception e) {
        }
    }

    public WebElement getCheckButtonAt(int row) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(TABLE_BODY_XPATH + "/tr[" +  Integer.toString(row) + "]/td[2]/label/span" )));
    }

    public WebElement getModalGameSessionName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(MODAL_NAME)));
    }

    public WebElement getModalStartDate() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(MODAL_START_DATE)));
    }

    public boolean checkEmptyErrorInputName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(NAME_INPUT_ERROR))).getText().equals(ERROR_EMPTY_INPUT_NAME);
    }

    public boolean checkLessErrorInputName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(NAME_INPUT_ERROR))).getText().equals(ERROR_LESS_INPUT_NAME);
    }

    public boolean checkEmptyErrorStartDateName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(START_DATE_INPUT_ERROR))).getText().equals(ERROR_EMPTY_START_DATE);
    }

    public boolean checkIfMatchIsSelected(String matchName) {
        return driver.findElements(By.xpath(MODAL_DIV + "//span[contains(., '" + matchName + "')]")).size() > 0;
    }

    // get the modal save button
    public WebElement getModalBtnSave() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(BUTTON_FOOTER_UPDT_SAVE)));
    }
    
    // get the modal cancel button
    public WebElement getModalBtnCancel() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(BUTTON_FOOTER_UPDT_CANCEL)));
    }

    // get the modal edit button
    public WebElement getModalBtnEdit() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(BUTTON_FOOTER_VIEW_EDIT)));
    }

    // get the modal close button
    public WebElement getModalBtnClose() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(BUTTON_FOOTER_VIEW_CLOSE)));
    }

    public WebElement getHomeButton() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(BACK_TO_HOME_BUTTON_ID)));
    }

}
