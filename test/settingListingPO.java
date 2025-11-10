package com.example;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class settingListingPO {
    private WebDriver driver;   
    private String IdDraftButton        = "";
    private String IdReadyButton        = "";
    private String IdMatchSettingsList  = "";
    private String IdSearchBar          = "";
    private String IdAuthor             = "";
    private String IdStatus              = "";
    private int MatchSettingNamePosition = 1;
    private int AuthorPosition = 2;
    private int StatusPosition = 3;
    
    // This link need to be modified 
    // after the page creation
    private String LinkListingURL = "PIPPO_LINK_LISTING_URL";
    

    //  The constructor function 
    //  that take in input the webdriver
    //  that we use
    public settingListintPO(WebDriver driver) {

        this.driver = driver;
        driver.get(LinkListingURL);
    }
    
    //  Method for simulating the Draft click button
    public void clickDraftButton() {
        driver.findElement(By.id(IdDraftButton)).click();
    }
    
    //  
    public void clickReadyButton() {
        driver.findElement(By.id(IdReadyButton)).click();
    }

    public boolean MatchSettingsListIsPresent() {
        return driver.findElement(By.id(IdMatchSettingsList)).isDisplayed();
    }

    public String getSettingName() {
        return driver.findElement(By.id(IdMatchSettingsList)).getText();
    }

    public String getAuthor() {
        return driver.findElement(By.id(IdAuthor)).getText();
    }

    public String getStatus() {
        return driver.findElement(By.id(IdStatus)).getText();
    }

    private String GetIdAt(int row, int col) {
        String cellXpath = "//*[@id= " + this.IdMatchSettingsList + "]/tbody/tr[" + row + "]/td[" + col + "]";
        WebElement ThisElement= driver.findElement(By.xpath(cellXpath));
        return ThisElement.getAttribute("id");
    }

    public String getIdAutorAt(int row) {
        String result = this.GetIdAt(row, this.AuthorPosition);
        return result;
    }
       
    public String getIdMatchSettingsAt(int row) {
        String result = this.GetIdAt(row, this.MatchSettingNamePosition);
        return result;
    }    

    public String getIdStatusAt(int row) {
        String result = this.GetIdAt(row, this.StatusPosition);
        return result;
    }    
}
