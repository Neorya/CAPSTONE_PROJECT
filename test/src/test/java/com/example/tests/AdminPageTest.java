package com.example.tests;

import com.example.pages.LoginPO;
import com.example.pages.AdminPagePO;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class AdminPageTest extends BaseTest {
    private static LoginPO loginPO;
    private static AdminPagePO adminPagePO;

    private static String testUserEmail = "student13@test.com";

    @BeforeAll
    public static void setUpTest() {
        loginPO = new LoginPO(driver);
        adminPagePO = new AdminPagePO(driver);
    }

    @AfterAll
    public static void tearDownTest() {
        loginPO = null;
        adminPagePO = null;
    }

    @BeforeEach
    public void navigateToAdminPage() throws InterruptedException {
        navigateTo("/login");
        clearLocalStorage();
        driver.navigate().refresh(); // Refresh to apply cleared storage
        loginPO.loginAsPreconfiguredAdmin();
        Thread.sleep(50);

        navigateTo("/admin-dashboard");

        System.out.println("Logged in as Admin");
    }

    @Test
    public void testAdminPageLoads() {
        assertTrue(adminPagePO.isPageLoaded(), "Admin page should load successfully");
    }

    @Test
    public void testAdminPageElements() {
        assertTrue(adminPagePO.isPageLoaded(), "Admin page should load successfully");
        assertTrue(adminPagePO.isUserTableVisible(), "User table should be visible");
    }
    
    @Test
    public void testPromoteStudentToTeacher() throws InterruptedException {
        assertTrue(adminPagePO.isPageLoaded(), "Admin page should be loaded");
        
        String initialRole = adminPagePO.getUserRole(testUserEmail);
        assertEquals("STUDENT", initialRole, "User should initially have Student role");
        
        adminPagePO.promoteUserToTeacher(testUserEmail);
        
        Thread.sleep(1000); // Allow time for the API call and UI update
        
        boolean roleUpdated = adminPagePO.waitForRoleUpdate(testUserEmail, "TEACHER");
        assertTrue(roleUpdated, "User role should be updated to Teacher");
        
        String updatedRole = adminPagePO.getUserRole(testUserEmail);
        assertEquals("TEACHER", updatedRole, "User should now have Teacher role");
        
        System.out.println("Successfully promoted " + testUserEmail + " from Student to Teacher");
    }

    @Test
    public void testDemoteTeacherToStudent() throws InterruptedException {
        assertTrue(adminPagePO.isPageLoaded(), "Admin page should be loaded");
        
        String initialRole = adminPagePO.getUserRole(testUserEmail);
        assertEquals("TEACHER", initialRole, "User should initially have Teacher role");
        
        adminPagePO.demoteUserToStudent(testUserEmail);

        Thread.sleep(1000);

        boolean roleUpdated = adminPagePO.waitForRoleUpdate(testUserEmail, "STUDENT");
        assertTrue(roleUpdated, "User role should be updated to Student");
        
        String updatedRole = adminPagePO.getUserRole(testUserEmail);
        assertEquals("STUDENT", updatedRole, "User should now have Student role");
        
        System.out.println("Successfully demoted " + testUserEmail + " from Teacher to Student");
    }
}
