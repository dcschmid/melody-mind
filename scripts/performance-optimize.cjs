#!/usr/bin/env node

/**
 * Performance Optimization Script (CommonJS Version)
 *
 * Build-time performance analysis and optimization for MelodyMind
 * Analyzes bundle sizes, identifies performance bottlenecks, and provides recommendations
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class PerformanceOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.distPath = path.join(this.projectRoot, "dist");
    this.reportPath = path.join(this.projectRoot, "performance-report.json");
  }

  /**
   * Analyze bundle sizes
   */
  analyzeBundleSizes() {
    console.log("📊 Analyzing bundle sizes...");

    if (!fs.existsSync(this.distPath)) {
      console.log("❌ Dist folder not found. Run build first.");
      return null;
    }

    const assets = this.getAssetFiles();
    const bundleAnalysis = this.analyzeAssets(assets);

    console.log("📦 Bundle Analysis:");
    console.log(`Total assets: ${bundleAnalysis.totalAssets}`);
    console.log(`Total size: ${this.formatBytes(bundleAnalysis.totalSize)}`);
    console.log(`JavaScript size: ${this.formatBytes(bundleAnalysis.jsSize)}`);
    console.log(`CSS size: ${this.formatBytes(bundleAnalysis.cssSize)}`);
    console.log(`Image size: ${this.formatBytes(bundleAnalysis.imageSize)}`);

    return bundleAnalysis;
  }

  /**
   * Get asset files from dist folder
   */
  getAssetFiles() {
    const assets = [];

    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else {
          assets.push({
            path: filePath,
            size: stat.size,
            relativePath: path.relative(this.distPath, filePath),
          });
        }
      });
    };

    walkDir(this.distPath);
    return assets;
  }

  /**
   * Analyze assets by type
   */
  analyzeAssets(assets) {
    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;
    let imageSize = 0;
    let htmlSize = 0;

    assets.forEach((asset) => {
      totalSize += asset.size;

      if (asset.relativePath.endsWith(".js")) {
        jsSize += asset.size;
      } else if (asset.relativePath.endsWith(".css")) {
        cssSize += asset.size;
      } else if (asset.relativePath.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        imageSize += asset.size;
      } else if (asset.relativePath.endsWith(".html")) {
        htmlSize += asset.size;
      }
    });

    return {
      totalAssets: assets.length,
      totalSize,
      jsSize,
      cssSize,
      imageSize,
      htmlSize,
      assets: assets.sort((a, b) => b.size - a.size).slice(0, 10), // Top 10 largest files
    };
  }

  /**
   * Check for performance issues
   */
  checkPerformanceIssues(bundleAnalysis) {
    if (!bundleAnalysis) return [];

    console.log("\n🔍 Checking for performance issues...");

    const issues = [];

    // Check bundle size
    if (bundleAnalysis.jsSize > 500000) {
      // 500KB
      issues.push({
        type: "bundle-size",
        severity: "high",
        message: `JavaScript bundle is too large: ${this.formatBytes(bundleAnalysis.jsSize)}`,
        recommendation: "Consider code splitting and lazy loading",
      });
    }

    // Check image optimization
    if (bundleAnalysis.imageSize > 1000000) {
      // 1MB
      issues.push({
        type: "image-size",
        severity: "medium",
        message: `Images are too large: ${this.formatBytes(bundleAnalysis.imageSize)}`,
        recommendation: "Optimize images and use WebP format",
      });
    }

    // Check for large individual files
    bundleAnalysis.assets.forEach((asset) => {
      if (asset.size > 100000) {
        // 100KB
        issues.push({
          type: "large-file",
          severity: "medium",
          message: `Large file detected: ${asset.relativePath} (${this.formatBytes(asset.size)})`,
          recommendation: "Consider splitting or optimizing this file",
        });
      }
    });

    return issues;
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(bundleAnalysis, issues) {
    console.log("\n💡 Performance Recommendations:");

    const recommendations = [
      "✅ Use Astro's built-in image optimization",
      "✅ Enable CSS containment for better performance",
      "✅ Use requestAnimationFrame for animations",
      "✅ Implement lazy loading for non-critical resources",
      "✅ Optimize font loading with font-display: swap",
      "✅ Use passive event listeners where possible",
      "✅ Implement proper caching strategies",
      "✅ Consider using a CDN for static assets",
    ];

    if (bundleAnalysis && bundleAnalysis.jsSize > 300000) {
      recommendations.push("⚠️ Consider code splitting for JavaScript bundles");
    }

    if (bundleAnalysis && bundleAnalysis.imageSize > 500000) {
      recommendations.push("⚠️ Optimize images and use modern formats (WebP, AVIF)");
    }

    recommendations.forEach((rec) => console.log(rec));

    return recommendations;
  }

  /**
   * Generate performance report
   */
  generateReport(bundleAnalysis, issues, recommendations) {
    const report = {
      timestamp: new Date().toISOString(),
      bundleAnalysis,
      issues,
      recommendations,
      summary: {
        totalSize: bundleAnalysis ? this.formatBytes(bundleAnalysis.totalSize) : "N/A",
        jsSize: bundleAnalysis ? this.formatBytes(bundleAnalysis.jsSize) : "N/A",
        cssSize: bundleAnalysis ? this.formatBytes(bundleAnalysis.cssSize) : "N/A",
        imageSize: bundleAnalysis ? this.formatBytes(bundleAnalysis.imageSize) : "N/A",
        issueCount: issues.length,
        criticalIssues: issues.filter((i) => i.severity === "high").length,
      },
    };

    fs.writeFileSync(this.reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Performance report saved to: ${this.reportPath}`);

    return report;
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Run full performance analysis
   */
  run() {
    console.log("🚀 MelodyMind Performance Optimization Analysis\n");

    try {
      const bundleAnalysis = this.analyzeBundleSizes();
      const issues = this.checkPerformanceIssues(bundleAnalysis);
      const recommendations = this.generateRecommendations(bundleAnalysis, issues);
      const report = this.generateReport(bundleAnalysis, issues, recommendations);

      console.log("\n🎯 Performance Summary:");
      console.log(`Total bundle size: ${report.summary.totalSize}`);
      console.log(`Issues found: ${report.summary.issueCount}`);
      console.log(`Critical issues: ${report.summary.criticalIssues}`);

      if (report.summary.criticalIssues > 0) {
        console.log("\n⚠️ Critical performance issues detected!");
        process.exit(1);
      } else {
        console.log("\n✅ No critical performance issues detected");
      }
    } catch (error) {
      console.error("❌ Error during performance analysis:", error.message);
      process.exit(1);
    }
  }
}

// Run the optimizer if this script is executed directly
if (require.main === module) {
  const optimizer = new PerformanceOptimizer();
  optimizer.run();
}

module.exports = PerformanceOptimizer;
