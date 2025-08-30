<?php
/**
 * Template Name: Library TRRS Full Page
 * 
 * This template removes WordPress header/footer for a seamless experience
 * Save this file as 'page-library-trrs.php' in your active theme folder
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?></title>
    
    <!-- Favicon from WordPress -->
    <?php wp_head(); ?>
    
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .library-trrs-fullscreen {
            width: 100vw;
            height: 100vh;
            border: none;
            display: block;
        }
        
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .loading-content {
            text-align: center;
            color: white;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error-screen {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f8f9fa;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        }
        
        .error-content {
            max-width: 500px;
        }
        
        .error-content h2 {
            color: #dc3545;
            margin-bottom: 20px;
        }
        
        .retry-btn {
            background: #007cba;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
        }
        
        .retry-btn:hover {
            background: #005a87;
        }
    </style>
</head>
<body>
    <!-- Loading Screen -->
    <div id="loadingScreen" class="loading-screen">
        <div class="loading-content">
            <div class="spinner"></div>
            <h2>Loading Library TRRS...</h2>
            <p>Please wait while we load the management system</p>
        </div>
    </div>
    
    <!-- Error Screen -->
    <div id="errorScreen" class="error-screen">
        <div class="error-content">
            <h2>Unable to Load Library TRRS</h2>
            <p>There was a problem loading the Library Management System. This could be due to:</p>
            <ul style="text-align: left; display: inline-block;">
                <li>Network connectivity issues</li>
                <li>The application server is temporarily unavailable</li>
                <li>Your browser is blocking the content</li>
            </ul>
            <button class="retry-btn" onclick="retryLoad()">Try Again</button>
            <p style="margin-top: 20px;">
                <a href="https://soft-choux-f67865.netlify.app" target="_blank">
                    Open Library TRRS in a new window
                </a>
            </p>
        </div>
    </div>
    
    <!-- Main iframe -->
    <iframe 
        id="libraryFrame"
        src="https://soft-choux-f67865.netlify.app" 
        class="library-trrs-fullscreen"
        title="Library TRRS Management System"
        onload="hideLoading()"
        onerror="showError()">
    </iframe>
    
    <script>
        // Hide loading screen when iframe loads
        function hideLoading() {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }
        
        // Show error screen if iframe fails to load
        function showError() {
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('errorScreen').style.display = 'flex';
        }
        
        // Retry loading
        function retryLoad() {
            document.getElementById('errorScreen').style.display = 'none';
            document.getElementById('loadingScreen').style.display = 'flex';
            document.getElementById('libraryFrame').src = 'https://soft-choux-f67865.netlify.app';
        }
        
        // Auto-hide loading screen after 10 seconds (fallback)
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                hideLoading();
            }
        }, 10000);
        
        // Handle iframe communication (if needed)
        window.addEventListener('message', function(event) {
            // Handle messages from the iframe if needed
            if (event.origin === 'https://soft-choux-f67865.netlify.app') {
                // Handle specific messages from your app
                console.log('Message from Library TRRS:', event.data);
            }
        });
    </script>
    
    <?php wp_footer(); ?>
</body>
</html>