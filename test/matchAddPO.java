package com.example;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class matchAddPO {
    private WebDriver driver;   

    private String IdCreateButton    = "";
    private String IdDifficultyLevel = "";
    private String IdRevNumber     = "";
    private String IdDurationFirst  = "";
    private String IdDurationSecond = "";
    private String IdMatchSetList = "";

    private final String MatchCreateURL = "PIPPO_LINK_LISTING_URL";
    

    public matchAddPO(WebDriver driver) {
        this.driver = driver;
        driver.get(MatchCreateURL);
    }

    public void clickCreateButton() {
        driver.findElement(By.id(IdCreateButton)).click();
    }

    public void setDifficultyLevel(int level) {
        String levelStr = Integer.toString(level);
        driver.findElement(By.id(IdDifficultyLevel)).sendKeys(levelStr);
    }

    public void setRevNumber(int revNumber) {
        String revStr = Integer.toString(revNumber);
        driver.findElement(By.id(IdRevNumber)).sendKeys(revStr);
    }

    public void setDurationFirst(int duration) {
        String durStr = Integer.toString(duration);
        driver.findElement(By.id(IdDurationFirst)).sendKeys(durStr);
    }

    public void setDurationSecond(int duration) {
        String durStr = Integer.toString(duration);
        driver.findElement(By.id(IdDurationSecond)).sendKeys(durStr);
    }

    public boolean MatchSetListIsPresent() {
        return driver.findElement(By.id(IdMatchSetList)).isDisplayed();
    }

    public WebElement getMatchSetListAtPos(int row) {
        List<WebElement> MatchSetList = driver.findElements(By.id(IdMatchSetList));
        WebElement elementAtRow = null; // Default value if not found not sure it's correct
        if (MatchSetList.size() >= row) {
            elementAtRow = MatchSetList.get(row-1);
        }
        return elementAtRow;
    }

    public WebElement getElementById(String id) {
        return driver.findElement(By.id(id));
    }

    private String getIdByXpath (String xpath) {
        return driver.findElement(By.xpath(xpath)).getAttribute("id");
    }

    public String getPageTitle() {
        return driver.getTitle();
    }

    public WebElement getCreateButton() {
        return getElementById(IdCreateButton);
    }

    public WebElement getDifficultyLevel() {
        return getElementById(IdDifficultyLevel);
    }

    public WebElement getRevNumber() {
        return getElementById(IdRevNumber);
    }

    public WebElement getDurationFirst() {
        return getElementById(IdDurationFirst);
    }

    public WebElement getDurationSecond() {
        return getElementById(IdDurationSecond);
    }

    public WebElement getMatchSetList() {
        return getElementById(IdMatchSetList);
    }
}
