package com.example;


//import static org.junit.Assert.assertTrue;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

/**
 * Unit test for simple App.
 */
public class MatchAddTest 
{

    private WebDriver driver;
    private matchAddPO matchAddPage;
    //private final String matchAddXpath = "//h4[contains(text(),'Create New Match')]";

    @BeforeAll 
    public static void setupClass() {
        System.setProperty("webdriver.chrome.driver", "YOUR_PATH");
    }
    
    @BeforeEach
    public void setupTest() throws InterruptedException {
        
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--no-sandbox"); 
        options.addArguments("--disable-dev-shm-usage"); 
        driver = new ChromeDriver();
        matchAddPage = new matchAddPO(driver);
        //Thread.sleep(500);
        //matchAddPage.findElementByXPath(matchAddXpath).click();
    }   

    @Test
    public void testPageLoads() {
        assert(matchAddPage.MatchSetListIsPresent() == true);
    }

    @Test
    public void titleIsCorrect() {
        String expectedTitle = "React App"; //why???
        assert(driver.getTitle().equals(expectedTitle));
    }

    @Test
    public void checkCreateButton() {
        assert(matchAddPage.getCreateButton().isDisplayed() && !matchAddPage.getCreateButton().isEnabled());
    }

    @Test
    public void checkDeleteButton() {
        assert(matchAddPage.getCancelButton().isDisplayed() && matchAddPage.getCancelButton().isEnabled());
    }

    @Test
    public void testSetDifficultyLevel() {
        String difficultyLevelToSelect = "Medium";
        matchAddPage.setDifficultyLevel(difficultyLevelToSelect);
        String value = matchAddPage.getDifficultyLevel().getAttribute("title");
        assert(value.equals(difficultyLevelToSelect));
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
        WebElement element = matchAddPage.getMatchSettingsAtIndex(rowToClick);
        assert(element.isSelected() == false);
        element.click();
        assert(element.isSelected() == true);
        // Further assertions can be added here based on expected behavior after clicking
    }


    /*@Test
    public void createMatchSettingInvalidValues() {
        matchAddPage.setRevNumber(0);
        matchAddPage.setDurationFirst(-5);
        matchAddPage.setDurationSecond(0);
        //matchAddPage.clickCreateButton();
        assert(matchAddPage.getRevNumberErr().isDisplayed());
        assert(matchAddPage.getDurationFirstErr().isDisplayed());
        assert(matchAddPage.getDurationSecondErr().isDisplayed());
        assert(!matchAddPage.getCreateButton().isEnabled());

    }*/

    @Test
    public void testCreateMatchSetting() {
        int rowMatchsettingToClick = 1;
        matchAddPage.setDifficultyLevel("Hard");
        matchAddPage.setRevNumber(2);
        matchAddPage.setDurationFirst(15);
        matchAddPage.setDurationSecond(10);
        //matchAddPage.getMatchSetListAtPos(rowMatchsettingToClick).click();
        matchAddPage.clickMatchSettingsAtIndex(rowMatchsettingToClick);
        matchAddPage.clickCreateButton();
        assert(matchAddPage.MatchSetListIsPresent()); //??
    }


    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @AfterAll
    public static void tearDownClass() {
        // Add any cleanup code that needs to run once after all tests
    }

}
