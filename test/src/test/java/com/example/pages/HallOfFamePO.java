package com.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.List;
import java.util.ArrayList;

/**
 * Page Object for Hall of Fame / Leaderboard
 * 
 * Provides methods to interact with the leaderboard table,
 * verify rankings, check medal icons, and interact with the
 * personal rank drawer.
 * 
 * IMPROVED: Uses ID-based selectors for better test stability
 */
public class HallOfFamePO {
    private WebDriver driver;
    private WebDriverWait wait;

    // Page elements - Using IDs for unique elements
    private static final By PAGE_TITLE = By.id("page-title");
    private static final By PAGE_SUBTITLE = By.id("page-subtitle");
    
    // Table elements
    private static final By LEADERBOARD_CARD = By.id("leaderboard-card");
    private static final By LEADERBOARD_TABLE = By.id("leaderboard-table");
    private static final By RANKINGS_TITLE = By.id("rankings-title");
    private static final By TABLE_ROW_XPATH = By.xpath("//tbody/tr");
    
    // Table cell selectors (relative to row)
    private static final String RANK_CELL_XPATH = ".//td[1]";
    private static final String PLAYER_CELL_XPATH = ".//td[2]";
    private static final String SCORE_CELL_XPATH = ".//td[3]";
    
    // Medal icons - Using data-testid for repeated elements
    private static final By GOLD_MEDAL = By.cssSelector("[data-testid='medal-gold']");
    private static final By SILVER_MEDAL = By.cssSelector("[data-testid='medal-silver']");
    private static final By BRONZE_MEDAL = By.cssSelector("[data-testid='medal-bronze']");
    private static final By RANK_NUMBER = By.cssSelector("[data-testid='rank-number']");
    
    // Current user highlighting
    private static final By HIGHLIGHTED_ROW = By.cssSelector("tr.current-user-row");
    
    // Buttons
    private static final By FLOATING_RANK_BUTTON = By.id("floating-rank-button");
    private static final By WHERE_AM_I_BUTTON = By.id("where-am-i-button");
    
    // Drawer elements
    private static final By DRAWER_OVERLAY = By.id("drawer-overlay");
    private static final By RANK_DRAWER = By.id("rank-drawer");
    private static final String DRAWER_OPEN_CLASS = "open";
    private static final By DRAWER_TITLE = By.id("drawer-title");
    private static final By DRAWER_CLOSE_BUTTON = By.id("drawer-close-button");
    
    // Drawer content
    private static final By DRAWER_RANK_VALUE = By.id("drawer-rank-value");
    private static final By DRAWER_SCORE_VALUE = By.id("drawer-score-value");
    private static final By DRAWER_NEXT_RANK = By.id("rank-item-next-rank");
    private static final By DRAWER_POINTS_NEEDED = By.id("drawer-points-needed");
    private static final By DRAWER_WHERE_AM_I_BUTTON = By.id("drawer-where-am-i-button");
    
    // Pagination
    private static final By PAGINATION = By.cssSelector("ul.ant-pagination");
    private static final By PAGINATION_TOTAL = By.cssSelector("li.ant-pagination-total-text");

    public HallOfFamePO(WebDriver driver) {
        this.driver = driver;
        int waitTimeout = (System.getenv("CI") != null || "true".equals(System.getProperty("headless"))) ? 30 : 10;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeout));
    }

    // ========== Page Navigation ==========
    
    public void navigateToHallOfFame(String baseUrl) {
        driver.get(baseUrl + "/hall-of-fame");
    }

    public boolean isPageLoaded() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(PAGE_TITLE)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    // ========== Table Interaction ==========
    
    public boolean isLeaderboardTableVisible() {
        try {
            return driver.findElement(LEADERBOARD_TABLE).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public List<WebElement> getTableRows() {
        wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(TABLE_ROW_XPATH));
        return driver.findElements(TABLE_ROW_XPATH);
    }

    public int getTableRowCount() {
        return getTableRows().size();
    }

    /**
     * Get player data from a specific row
     * @param rowIndex 0-based index
     * @return PlayerData object containing rank, name, and score
     */
    public PlayerData getPlayerDataAtRow(int rowIndex) {
        List<WebElement> rows = getTableRows();
        if (rowIndex >= 0 && rowIndex < rows.size()) {
            WebElement row = rows.get(rowIndex);
            String rankText = row.findElement(By.xpath(RANK_CELL_XPATH)).getText().trim();
            String playerName = row.findElement(By.xpath(PLAYER_CELL_XPATH)).getText().trim();
            String scoreText = row.findElement(By.xpath(SCORE_CELL_XPATH)).getText().trim();
            
            return new PlayerData(rankText, playerName, scoreText);
        }
        return null;
    }

    /**
     * Find a player by name and return their data
     */
    public PlayerData getPlayerDataByName(String playerName) {
        List<WebElement> rows = getTableRows();
        for (WebElement row : rows) {
            String name = row.findElement(By.xpath(PLAYER_CELL_XPATH)).getText().trim();
            if (name.equals(playerName)) {
                String rankText = row.findElement(By.xpath(RANK_CELL_XPATH)).getText().trim();
                String scoreText = row.findElement(By.xpath(SCORE_CELL_XPATH)).getText().trim();
                return new PlayerData(rankText, name, scoreText);
            }
        }
        return null;
    }

    /**
     * Get the rank of a player by name
     */
    public String getPlayerRank(String playerName) {
        PlayerData data = getPlayerDataByName(playerName);
        return data != null ? data.getRank() : null;
    }

    /**
     * Get the score of a player by name
     */
    public String getPlayerScore(String playerName) {
        PlayerData data = getPlayerDataByName(playerName);
        return data != null ? data.getScore() : null;
    }

    // ========== Sorting Verification ==========
    
    /**
     * Verify that the leaderboard is sorted by score in descending order
     */
    public boolean isScoreSortedDescending() {
        List<WebElement> rows = getTableRows();
        double previousScore = Double.MAX_VALUE;
        
        for (WebElement row : rows) {
            String scoreText = row.findElement(By.xpath(SCORE_CELL_XPATH)).getText().trim();
            double currentScore = Double.parseDouble(scoreText);
            
            if (currentScore > previousScore) {
                return false;
            }
            previousScore = currentScore;
        }
        return true;
    }

    // ========== Medal Icons ==========
    
    public boolean hasGoldMedal() {
        try {
            return driver.findElement(GOLD_MEDAL).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean hasSilverMedal() {
        try {
            return driver.findElement(SILVER_MEDAL).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean hasBronzeMedal() {
        try {
            return driver.findElement(BRONZE_MEDAL).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if a specific row has a medal icon
     */
    public boolean rowHasMedal(int rowIndex) {
        List<WebElement> rows = getTableRows();
        if (rowIndex >= 0 && rowIndex < rows.size()) {
            WebElement row = rows.get(rowIndex);
            try {
                row.findElement(By.cssSelector("[data-testid^='medal-']"));
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

    /**
     * Check if a specific row has a numeric rank (no medal)
     */
    public boolean rowHasNumericRank(int rowIndex) {
        List<WebElement> rows = getTableRows();
        if (rowIndex >= 0 && rowIndex < rows.size()) {
            WebElement row = rows.get(rowIndex);
            try {
                row.findElement(By.cssSelector("[data-testid='rank-number']"));
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

    // ========== Current User Highlighting ==========
    
    public boolean isCurrentUserHighlighted() {
        try {
            return driver.findElement(HIGHLIGHTED_ROW).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getHighlightedPlayerName() {
        try {
            WebElement highlightedRow = driver.findElement(HIGHLIGHTED_ROW);
            return highlightedRow.findElement(By.xpath(PLAYER_CELL_XPATH)).getText().trim();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Check if a specific player's row is highlighted
     */
    public boolean isPlayerHighlighted(String playerName) {
        try {
            WebElement highlightedRow = driver.findElement(HIGHLIGHTED_ROW);
            String name = highlightedRow.findElement(By.xpath(PLAYER_CELL_XPATH)).getText().trim();
            return name.equals(playerName);
        } catch (Exception e) {
            return false;
        }
    }

    // ========== Floating Button ==========
    
    public boolean isFloatingButtonVisible() {
        try {
            return driver.findElement(FLOATING_RANK_BUTTON).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void clickFloatingButton() {
        wait.until(ExpectedConditions.elementToBeClickable(FLOATING_RANK_BUTTON)).click();
    }

    // ========== Where Am I Button ==========
    
    public boolean isWhereAmIButtonVisible() {
        try {
            return driver.findElement(WHERE_AM_I_BUTTON).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void clickWhereAmIButton() {
        wait.until(ExpectedConditions.elementToBeClickable(WHERE_AM_I_BUTTON)).click();
    }

    // ========== Drawer Interaction ==========
    
    public boolean isDrawerOpen() {
        try {
            WebElement drawer = driver.findElement(RANK_DRAWER);
            String classes = drawer.getAttribute("class");
            return classes != null && classes.contains(DRAWER_OPEN_CLASS);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isDrawerOverlayVisible() {
        try {
            WebElement overlay = driver.findElement(DRAWER_OVERLAY);
            String classes = overlay.getAttribute("class");
            return classes != null && classes.contains(DRAWER_OPEN_CLASS);
        } catch (Exception e) {
            return false;
        }
    }

    public void closeDrawer() {
        wait.until(ExpectedConditions.elementToBeClickable(DRAWER_CLOSE_BUTTON)).click();
    }

    public void closeDrawerByOverlay() {
        wait.until(ExpectedConditions.elementToBeClickable(DRAWER_OVERLAY)).click();
    }
    
    /**
     * Wait for drawer to reach expected state (open or closed)
     * @param shouldBeOpen true if waiting for drawer to open, false if waiting for it to close
     */
    public void waitForDrawerState(boolean shouldBeOpen) {
        wait.until(driver -> {
            try {
                WebElement drawer = driver.findElement(RANK_DRAWER);
                String classes = drawer.getAttribute("class");
                boolean isOpen = classes != null && classes.contains(DRAWER_OPEN_CLASS);
                return isOpen == shouldBeOpen;
            } catch (Exception e) {
                return false;
            }
        });
    }

    // ========== Drawer Content ==========
    
    public String getDrawerRank() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(DRAWER_RANK_VALUE)).getText().trim();
        } catch (Exception e) {
            return null;
        }
    }

    public String getDrawerScore() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(DRAWER_SCORE_VALUE)).getText().trim();
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isNextRankSectionVisible() {
        try {
            return driver.findElement(DRAWER_NEXT_RANK).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getPointsToNextRank() {
        try {
            return driver.findElement(DRAWER_POINTS_NEEDED).getText().trim();
        } catch (Exception e) {
            return null;
        }
    }

    public void clickDrawerWhereAmIButton() {
        wait.until(ExpectedConditions.elementToBeClickable(DRAWER_WHERE_AM_I_BUTTON)).click();
    }

    // ========== Pagination ==========
    
    public boolean isPaginationVisible() {
        try {
            return driver.findElement(PAGINATION).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getTotalStudentsText() {
        try {
            return driver.findElement(PAGINATION_TOTAL).getText().trim();
        } catch (Exception e) {
            return null;
        }
    }

    // ========== Helper Classes ==========
    
    /**
     * Data class to hold player information
     */
    public static class PlayerData {
        private String rank;
        private String name;
        private String score;

        public PlayerData(String rank, String name, String score) {
            this.rank = rank;
            this.name = name;
            this.score = score;
        }

        public String getRank() {
            return rank;
        }

        public String getName() {
            return name;
        }

        public String getScore() {
            return score;
        }

        public int getRankAsInt() {
            // Handle medal emojis - extract numeric rank if present
            String numericRank = rank.replaceAll("[^0-9]", "");
            return numericRank.isEmpty() ? 0 : Integer.parseInt(numericRank);
        }

        public double getScoreAsDouble() {
            return Double.parseDouble(score);
        }
    }
}
