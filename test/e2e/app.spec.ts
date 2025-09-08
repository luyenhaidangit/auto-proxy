import { test, expect } from '@playwright/test';

test.describe('Auto Proxy Application', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await expect(page.locator('h1')).toContainText('Auto Proxy');
  });

  test('should display navigation tabs', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('button:has-text("Proxy Settings")')).toBeVisible();
    await expect(page.locator('button:has-text("File Manager")')).toBeVisible();
    await expect(page.locator('button:has-text("Settings")')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/');
    
    // Click on File Manager tab
    await page.click('button:has-text("File Manager")');
    
    // Should show file manager content
    await expect(page.locator('h2:has-text("File Manager")')).toBeVisible();
    
    // Click on Settings tab
    await page.click('button:has-text("Settings")');
    
    // Should show settings content
    await expect(page.locator('h2:has-text("Application Settings")')).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    
    // Click theme toggle button
    await page.click('button:has-text("System")');
    
    // Should change theme (this would need to be verified with actual theme changes)
    // For now, just verify the button text changes
    await expect(page.locator('button:has-text("Light")')).toBeVisible();
  });

  test('should show proxy settings by default', async ({ page }) => {
    await page.goto('/');
    
    // Should show proxy settings content by default
    await expect(page.locator('h2:has-text("Proxy Configuration")')).toBeVisible();
  });
});
