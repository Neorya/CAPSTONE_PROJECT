package com.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import java.util.*;

public class CreateGameSessionPO {
    private WebDriver driver;
    private static final String PAGE_TITLE_XPATH = "//*[@id=\"page_title\"]";
    private static final String ANTD_DIV_TABLE_XPATH = "//*[@id=\"game-session-creation-table\"]";
    private static final String TABLE_BODY_XPATH = ANTD_DIV_TABLE_XPATH + "/div/div/table/tbody";
    private static final String BUTTON_XPATH = "//*[@id=\"create-game-session-button\"]/button";

    public CreateGameSessionPO(WebDriver driver) {
        this.driver = driver;
    }

    public boolean isPageLoaded() {
        try {
            return getPageTitle().isDisplayed() && 
                   getPageTitle().getText().equals("Create Game Session");
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isTablePresent() {
        return driver.findElement(By.tagName("table")).isDisplayed();
    }

    public WebElement getPageTitle() {
        return driver.findElement(By.xpath(PAGE_TITLE_XPATH));
    }

    private WebElement getElementAt(int row, int col) {
        return driver.findElement(By.xpath(TABLE_BODY_XPATH+"/tr["+Integer.toString(row)+"]/td["+Integer.toString(col) +"]")); 
    }

    public List<WebElement> getRows() {
        return driver.findElements(By.xpath(TABLE_BODY_XPATH+"/tr"));
    }

    public WebElement getCheckBox(int row) {
        return getElementAt(row, 2);
    }

    public WebElement getButton() {
        return driver.findElement(By.xpath(BUTTON_XPATH));
    }
}
