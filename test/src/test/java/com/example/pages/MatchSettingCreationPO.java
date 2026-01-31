package com.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.List;

public class MatchSettingCreationPO {
    private WebDriver driver;
    private WebDriverWait wait;
    private Actions actions;

    // Locators
    private By titleInput = By.xpath("//label[contains(text(),'Match Title')]/following-sibling::input");
    private By descriptionInput = By.xpath("//label[contains(text(),'Description')]/following-sibling::textarea");
    
    // Monaco Editors (using a generic strategy to find them by order or context if possible)
    // Assuming Reference Solution is the first editor, Student Code is the second
    private By editors = By.cssSelector(".monaco-editor");
    
    // Config Locators
    private By functionNameInput = By.xpath("//label[contains(text(),'Function Name')]/following-sibling::input");
    private By functionTypeSelect = By.xpath("//label[contains(text(),'Function Type')]/following-sibling::select");
    
    // Buttons
    private By saveDraftButton = By.xpath("//button[contains(text(), 'Save as Draft')]");
    private By publishButton = By.xpath("//button[contains(text(), 'Publish')]");
    
    // Alerts
    private By alertMessage = By.className("alert-message");
    
    // Test Cases
    private By addPublicTestBtn = By.xpath("//button[contains(text(), 'Add Public Row')]");
    private By addPrivateTestBtn = By.xpath("//button[contains(text(), 'Add Private Row')]");

    public MatchSettingCreationPO(WebDriver driver) {
        this.driver = driver;
        this.actions = new Actions(driver);
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }

    public void enterTitle(String title) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(titleInput));
        input.clear();
        input.sendKeys(title);
    }

    public void enterDescription(String description) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(descriptionInput));
        input.clear();
        input.sendKeys(description);
    }

    public void enterReferenceSolution(String code) throws InterruptedException {

        List<WebElement> editorList = driver.findElements(editors);
        if (!editorList.isEmpty()) {
            WebElement refEditor = editorList.get(0);
            actions.moveToElement(refEditor).click().perform();
            
            try { Thread.sleep(200); } catch (InterruptedException e) {}
            actions.keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL).sendKeys(Keys.BACK_SPACE).perform();
     
            for (char c : code.toCharArray()) {
                actions.sendKeys(String.valueOf(c)).perform();
                Thread.sleep(50); 
            }

        }
    }
    
    public void enterStudentCode(String code) {
        // Find the second editor (Student Code), it might be inside Professor Config
        // Ensure Professor Config is expanded if not visible?
        // Assuming it's visible or expanded by default
        
        List<WebElement> editorList = driver.findElements(editors);
        if (editorList.size() > 1) {
            WebElement studentEditor = editorList.get(1);
            actions.moveToElement(studentEditor).click().perform();
            
            try { Thread.sleep(200); } catch (InterruptedException e) {}
            
            actions.keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL).sendKeys(Keys.BACK_SPACE).perform();
            actions.sendKeys(code).perform();
        }
    }

    public void setFunctionName(String name) {
        // Ensure Professor Config is expanded
        expandProfessorConfigIfNeeded();
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(functionNameInput));
        input.clear();
        input.sendKeys(name);
    }

    public void setFunctionType(String type) {
        expandProfessorConfigIfNeeded();
        WebElement selectElem = wait.until(ExpectedConditions.visibilityOfElementLocated(functionTypeSelect));
        Select select = new Select(selectElem);
        select.selectByValue(type);
    }

    private void expandProfessorConfigIfNeeded() {
        try {
            // Check if input is visible, if not click header
            if (!driver.findElement(functionNameInput).isDisplayed()) {
                driver.findElement(By.xpath("//h3[contains(text(), 'Professor Configuration')]")).click();
            }
        } catch (Exception e) {
            // ignore
        }
    }

    public void clickSaveDraft() {
        wait.until(ExpectedConditions.elementToBeClickable(saveDraftButton)).click();
    }

    public void clickPublish() {
        wait.until(ExpectedConditions.elementToBeClickable(publishButton)).click();
    }

    public boolean isAlertVisible() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(alertMessage)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getAlertText() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(alertMessage)).getText();
    }
    
    public boolean isAlertError() {
         WebElement alert = wait.until(ExpectedConditions.visibilityOfElementLocated(alertMessage));
         return alert.getAttribute("class").contains("error");
    }

    public void addPublicTest(String input, String expectedOutput) {
        wait.until(ExpectedConditions.elementToBeClickable(addPublicTestBtn)).click();
        
        // Find the last row in public tests
        List<WebElement> rows = driver.findElements(By.xpath("//div[contains(., 'Public Test Cases')]//tbody//tr"));
        int lastIndex = rows.size() - 1; // 0-based
        
        By inputLocator = By.xpath("(//div[contains(@class, 'test-case-section')])[1]//tbody//tr[" + (lastIndex + 1) + "]//td[1]//input");
        By outputLocator = By.xpath("(//div[contains(@class, 'test-case-section')])[1]//tbody//tr[" + (lastIndex + 1) + "]//td[2]//input");
        
        WebElement inputField = wait.until(ExpectedConditions.visibilityOfElementLocated(inputLocator));
        inputField.sendKeys(input);
        
        WebElement outputField = wait.until(ExpectedConditions.visibilityOfElementLocated(outputLocator));
        outputField.sendKeys(expectedOutput);
    }

    public void addPrivateTest(String input, String expectedOutput) {
        wait.until(ExpectedConditions.elementToBeClickable(addPrivateTestBtn)).click();
        
        // Find the last row in private tests (2nd section)
        List<WebElement> rows = driver.findElements(By.xpath("//div[contains(., 'Private Test Cases')]//tbody//tr"));
        int lastIndex = rows.size() - 1; 
        
        // Assuming Private Test Cases is the second section
        By inputLocator = By.xpath("(//div[contains(@class, 'test-case-section')])[1]//tbody//tr[" + (1) + "]//td[1]//input");
        By outputLocator = By.xpath("(//div[contains(@class, 'test-case-section')])[1]//tbody//tr[" + (1) + "]//td[2]//input");
        
        WebElement inputField = wait.until(ExpectedConditions.visibilityOfElementLocated(inputLocator));
        inputField.sendKeys(input);
        
        WebElement outputField = wait.until(ExpectedConditions.visibilityOfElementLocated(outputLocator));
        outputField.sendKeys(expectedOutput);
    }
}

