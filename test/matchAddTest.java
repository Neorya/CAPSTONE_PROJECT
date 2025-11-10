package com.example;


//import static org.junit.Assert.assertTrue;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

/**
  Not tested yet due to the switch to Ant framework, to do asap
 */
public class MatchAddTest 
{

    private WebDriver driver;
    private matchAddPO matchAddPage;

    @BeforeAll 
    public static void setupClass() {
        System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
    }
    
    @BeforeEach
    public void setupTest() {
        driver = new ChromeDriver();
        matchAddPage = new matchAddPO(driver);
    }

    @Test
    public void testPageLoads() {
        assert(matchAddPage.MatchSetListIsPresent() == true);
    }

    @Test
    public void titleIsCorrect() {
        String expectedTitle = "Create Match Setting";
        assert(driver.getTitle().equals(expectedTitle));
    }

    @Test
    public void checkCreateButton() {
        assert(matchAddPage.getCreateButton().isDisplayed() && matchAddPage.getCreateButton().isEnabled());
    }

    @Test
    public void testSetDifficultyLevel() {
        matchAddPage.setDifficultyLevel(2);
        String value = matchAddPage.getDifficultyLevel().getAttribute("value");
        assert(value.equals("2"));
    }

    @Test
    public void testSetRevNumber() {
        matchAddPage.setRevNumber(3);
        String value = matchAddPage.getRevNumber().getAttribute("value");
        assert(value.equals("3"));
    }

    @Test
    public void testSetDurationFirst() {
        matchAddPage.setDurationFirst(15);
        String value = matchAddPage.getDurationFirst().getAttribute("value");
        assert(value.equals("15"));
    }

    @Test
    public void testSetDurationSecond() {
        matchAddPage.setDurationSecond(10);
        String value = matchAddPage.getDurationSecond().getAttribute("value");
        assert(value.equals("10"));
    }

    @Test 
    public void clickMatchSetting() {
        int rowToClick = 2;
        WebElement element = matchAddPage.getMatchSetListAtPos(rowToClick);
        assert(element.isEnabled() && element.isSelected() == false);
        element.click();
        assert(element.isSelected() == true);
        // Further assertions can be added here based on expected behavior after clicking
    }

    //NB the following assertions are not based on requirement or frontEnd, they need to be checked before,
    @Test
    public void createMatchSettingEmpty() {
        matchAddPage.clickCreateButton();
        Alert alert = driver.switchTo().alert();
        String alertText = alert.getText(); // get content of the alert box if bis
        assert(alertText.equals("Please fill all required fields"));
    }

    @Test
    public void createMatchSettingInvalidValues() {
        matchAddPage.setDifficultyLevel(-1);
        matchAddPage.setRevNumber(0);
        matchAddPage.setDurationFirst(-5);
        matchAddPage.setDurationSecond(0);
        matchAddPage.clickCreateButton();
        Alert alert = driver.switchTo().alert();
        String alertText = alert.getText(); // get content of the alert box if it is displayed
        assert(alertText.equals("Please enter valid values"));
    }

    @Test
    public void testCreateMatchSetting() {
        int rowMatchsettingToClick = 1;
        matchAddPage.setDifficultyLevel(3);
        matchAddPage.setRevNumber(2);
        matchAddPage.setDurationFirst(15);
        matchAddPage.setDurationSecond(10);
        matchAddPage.getMatchSetListAtPos(rowMatchsettingToClick).click();
        matchAddPage.clickCreateButton();
        assert(matchAddPage.MatchSetListIsPresent()); 
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @AfterAll
    public static void tearDownClass() {
        // Add any cleanup code that needs to run once after all tests if needed
    }

}
