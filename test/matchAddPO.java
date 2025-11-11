package com.example;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class matchAddPO {
    private WebDriver driver;   

    private String CreateButtonXPathR    = "//button[@type='submit']";
    private String DifficultyLevelBoxXPathR = "//input[@id='difficulty']";
    private String DifficultyLevelXPathR = "//span[@class='ant-select-selection-item']";
    private String RevNumberXPathR     = "//input[@id='reviewers']";
    private String DurationFirstXPathR  = "//input[@id='firstPhaseDuration']";
    private String DurationSecondXPathR = "//input[@id='secondPhaseDuration']";
    private String MatchSetListXPathR = "//div[@class='ant-space css-dev-only-do-not-override-hofb1t ant-space-vertical ant-space-gap-row-small ant-space-gap-col-small']";
    private String cancelButtonXPathR = "//span[contains(text(),'Cancel')]";
    private String RevNumberErrXPathR = "//div[@id='reviewers_help']";
    //private String DifficultyLevelErrXPathR = "//div[@id='difficulty_help']"; //drop down menu couldn't receive wrong keys
    private String DurationFirstErrXPathR = "//div[@id='firstPhaseDuration_help']";
    private String DurationSecondErrXPathR = "//div[@id='secondPhaseDuration_help']";

    
    private final String MatchCreateURL = "http://localhost:3000/create-match";
    


    public matchAddPO(WebDriver driver) {
        this.driver = driver;
        driver.get(MatchCreateURL);
    }

    public WebElement findElementByXPath(String Xpath) {
        return driver.findElement(By.xpath(Xpath));
    }

    public void clickCreateButton() {
        getCreateButton().click();
    }

    public void clickCancelButton() {
        getCancelButton().click();
    }

    public void clickMatchSettingsAtIndex(int i) {
        getMatchSettingsAtIndex(i).click();
    }

    public void setDifficultyLevel(String level) {
        /*
        WebElement dropdownElement = getDifficultyLevel();
        Select difficultySelect = new Select(dropdownElement);
        difficultySelect.selectByValue(level);
         */
        getDifficultyLevelBox().click();
        getDifficultyDropDownAt(level).click();

        
    }

    public void setRevNumber(int revNumber) {
        String revStr = Integer.toString(revNumber);
        getRevNumber().sendKeys(revStr);
    }

    public void setDurationFirst(int duration) {
        String durStr = Integer.toString(duration);
        getDurationFirst().sendKeys(durStr);
    }

    public void setDurationSecond(int duration) {
        String durStr = Integer.toString(duration);
        getDurationSecond().sendKeys(durStr);
    }

    public boolean MatchSetListIsPresent() {
        return driver.findElement(By.xpath(MatchSetListXPathR)).isDisplayed();
    }

    public WebElement getMatchSettingsAtIndex(int i) {
    String xpath = "//body/div[@id='root']/div[@class='App']/div[@class='create-match-container']" +
                   "/div[contains(@class, 'create-match-card')]/div[@class='ant-card-body']" +
                   "/div[@class='form-layout']/div[@class='match-settings-column']" +
                   "/div[@class='match-settings-scrollable']/div[contains(@class, 'match-settings-radio-group')]" +
                   "/div[contains(@class, 'ant-space')]/div[" + i + "]/label/span/input";
                   
    return driver.findElement(By.xpath(xpath));
    }   



    /*public WebElement getMatchSetListAtPos(int row) {
        List<WebElement> MatchSetList = driver.findElements(By.xpath(MatchSetListXPathR));
        WebElement elementAtRow = null; // Default value if not found not sure it's correct
        if (MatchSetList.size() >= row) {
            elementAtRow = MatchSetList.get(row-1);
        }
        return elementAtRow;
    }*/

    public WebElement getElementById(String id) { //not neede anymore
        return driver.findElement(By.id(id));
    }

    public WebElement getElementByXPath(String xpath) { //not neede anymore
        return driver.findElement(By.xpath(xpath));
    }

    private String getIdByXpath (String xpath) {
        return driver.findElement(By.xpath(xpath)).getAttribute("id");
    }

    public String getPageTitle() {
        return driver.getTitle();
    }

    public WebElement getCreateButton() {
        return getElementByXPath(CreateButtonXPathR);
    }

    public WebElement getCancelButton() {
        return getElementByXPath(cancelButtonXPathR);
    }

    public WebElement getDifficultyLevelBox() {
        return getElementByXPath(DifficultyLevelBoxXPathR);
    }

    public WebElement getDifficultyLevel() {
        return getElementByXPath(DifficultyLevelXPathR);
    }

    private WebElement getDifficultyDropDownAt(String level) {
        return driver.findElement(By.xpath(buildXpathForDifficultyDropDown(level)));
    }

    private String buildXpathForDifficultyDropDown(String level) {
        return "//div[@class='ant-select-item-option-content' and text()='" + level + "']";
        //div[@class='ant-select-item-option-content'][contains(text(),'Medium')]
    }

    public WebElement getRevNumber() {
        return getElementByXPath(RevNumberXPathR);
    }

    public WebElement getRevNumberErr() {
        return getElementByXPath(RevNumberErrXPathR);
    }

    public WebElement getDurationFirst() {
        return getElementByXPath(DurationFirstXPathR);
    }

    public WebElement getDurationFirstErr() {
        return getElementByXPath(DurationFirstErrXPathR);
    }

    public WebElement getDurationSecond() {
        return getElementByXPath(DurationSecondXPathR);
    }

    public WebElement getDurationSecondErr() {
        return getElementByXPath(DurationSecondErrXPathR);
    }

    public WebElement getMatchSetList() {
        return getElementByXPath(MatchSetListXPathR);
    }
}
