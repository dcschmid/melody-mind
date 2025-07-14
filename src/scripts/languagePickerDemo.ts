/**
 * LanguagePicker Demo Script
 *
 * This script demonstrates the enhanced LanguagePicker functionality
 * and can be used for testing and validation purposes.
 *
 * Usage: Include this script in the browser console to test features
 */

// Demo function to test LanguagePicker performance and features
function demoLanguagePicker() {
  console.log("🚀 LanguagePicker Demo Starting...");

  // Initialize with performance monitoring
  const startTime = performance.now();
  const picker = (window as any).LanguagePicker?.init();
  const endTime = performance.now();

  console.log(`⏱️  Initialization time: ${(endTime - startTime).toFixed(2)}ms`);

  // Get performance metrics
  const metrics = picker?.getPerformanceMetrics();
  console.log("📊 Performance Metrics:", metrics);

  // Test language switching (if element exists)
  const selectElement = document.getElementById("language-select") as HTMLSelectElement;
  if (selectElement) {
    console.log("🌍 Current language:", selectElement.value);
    console.log(
      "📋 Available languages:",
      Array.from(selectElement.options).map((opt: HTMLOptionElement) => opt.value)
    );
  }

  // Memory usage monitoring
  if (metrics?.memoryUsage !== null) {
    console.log(`💾 Memory usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB`);
  }

  // Test cleanup functionality
  setTimeout(() => {
    console.log("🧹 Testing cleanup...");
    picker?.cleanup();

    const postCleanupMetrics = picker?.getPerformanceMetrics();
    console.log("📊 Post-cleanup metrics:", postCleanupMetrics);

    console.log("✅ LanguagePicker Demo Complete!");
  }, 3000);

  return picker;
}

// Auto-run demo if LanguagePicker is available
if (typeof (window as any).LanguagePicker !== "undefined") {
  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demoLanguagePicker);
  } else {
    demoLanguagePicker();
  }
} else {
  console.log("⚠️  LanguagePicker not found. Make sure the utility is loaded.");
}

// Export for manual testing
(window as any).demoLanguagePicker = demoLanguagePicker;
