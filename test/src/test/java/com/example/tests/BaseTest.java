package com.example.tests;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import java.time.Duration;

/**
 * Base test class that handles WebDriver lifecycle management.
 * All test classes should extend this class to inherit common setup and teardown functionality.
 */
public abstract class BaseTest {
    
    protected static WebDriver driver;
    protected static final String BASE_URL = "http://localhost:3000";
    
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
        
        // Set longer timeouts for CI environments
        if ("true".equals(headless) || System.getenv("CI") != null) {
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
            driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(30));
        } else {
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(20));
        }
    }
    
    @AfterAll
    public static void tearDown() {
        // Close the browser and quit the driver
        if (driver != null) {
            driver.quit();
        }
    }
    
    /**
     * Get the WebDriver instance
     * @return WebDriver instance
     */
    protected WebDriver getDriver() {
        return driver;
    }
    
    /**
     * Navigate to a specific path relative to the base URL
     * @param path the relative path to navigate to
     */
    protected void navigateTo(String path) {
        driver.get(BASE_URL + path);
    }

    /**
     * Injects a JWT token into localStorage
     * @param token The JWT token to inject
     */
    protected void injectAuthToken(String token) {
        org.openqa.selenium.JavascriptExecutor js = (org.openqa.selenium.JavascriptExecutor) driver;
        js.executeScript("window.localStorage.setItem('token', arguments[0]);", token);
    }

    /**
     * Simulates a login as a Student (ID: 1, Name: Sam Smith)
     * Generates a basic JWT and injects it.
     */
    protected void loginAsStudent() {
        // Token signed with 'test-jwt-secret-key-for-ci-testing-only'
        // Payload: {"sub":"100000000000000000001","role":"student","iat":1516239022,"exp":1999999999}
        String token = "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAiMTAwMDAwMDAwMDAwMDAwMDAwMDAxIiwgInJvbGUiOiAic3R1ZGVudCIsICJpYXQiOiAxNTE2MjM5MDIyLCAiZXhwIjogMTk5OTk5OTk5OX0.t3x5Y1NPzyDYizXhUN0L8a8-_JEFpHWy7RjOXv6Y4TE";

        // Navigate to home first to set localstorage domain context
        driver.get(BASE_URL);
        injectAuthToken(token);
    }

    /**
     * Simulates a login as a Teacher (ID: 9, Name: Amy Adams)
     */
    protected void loginAsTeacher() {
        // Token signed with 'test-jwt-secret-key-for-ci-testing-only'
        // Payload: {"sub":"100000000000000000009","role":"teacher","iat":1516239022,"exp":1999999999}
        String token = "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAiMTAwMDAwMDAwMDAwMDAwMDAwMDA5IiwgInJvbGUiOiAidGVhY2hlciIsICJpYXQiOiAxNTE2MjM5MDIyLCAiZXhwIjogMTk5OTk5OTk5OX0.CNuLNHOXbU6EoK9IWjQi08OKzCDqsBziCRxfueZyTXc";

        // Navigate to home first to set localstorage domain context
        driver.get(BASE_URL);
        injectAuthToken(token);
    }
}
