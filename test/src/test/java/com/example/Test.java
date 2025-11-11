package com.example;

import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SettingListingTest {
    
    private static WebDriver driver;
    private static settingListingPO settingListingPage;
    private static final String BASE_URL = "http://localhost:3000"; // Update with your actual URL
    
    @BeforeAll
    public static void setUp() {
        // Setup ChromeDriver options
        ChromeOptions options = new ChromeOptions();
        
        // Check if running in CI/headless environment
        String headless = System.getProperty("headless", "false");
        if ("true".equals(headless) || System.getenv("CI") != null) {
            options.addArguments("--headless=new");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");
            options.addArguments("--disable-gpu");
            options.addArguments("--window-size=1920,1080");
        } else {
            options.addArguments("--start-maximized");
        }
        
        options.addArguments("--disable-blink-features=AutomationControlled");
        
        // Initialize WebDriver
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        
        // Initialize Page Object
        settingListingPage = new settingListingPO(driver);
    }
    
    @AfterAll
    public static void tearDown() {
        // Close the browser and quit the driver
        if (driver != null) {
            driver.quit();
        }
    }
}
