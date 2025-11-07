package com.example;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class test {
    public static void main(String[] args) {
        System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
        WebDriver driver = new ChromeDriver();
        settingListintPO slp = new settingListintPO(driver);
      
        // Example move at the first 
        // row and check if the status value 
        // is correct
        String idString = slp.getIdStatusAt(1);
        assert (driver.findElement(idString).getText() == "expected result");
    }
}
