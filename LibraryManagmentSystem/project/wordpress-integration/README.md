# WordPress Integration Guide for Library TRRS

Your Library TRRS Management System is now live at: **https://soft-choux-f67865.netlify.app**

## 🚀 Quick Start (Recommended)

### Method 1: Simple Shortcode Integration

1. **Add to your theme's `functions.php`:**
```php
// Add Library TRRS Shortcode
function library_trrs_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '800px',
        'width' => '100%'
    ), $atts);
    
    return '<div style="width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . '; border: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <iframe src="https://soft-choux-f67865.netlify.app" 
                width="100%" 
                height="100%" 
                frameborder="0" 
                style="border-radius: 8px;"
                title="Library TRRS Management System">
        </iframe>
    </div>';
}
add_shortcode('library_trrs', 'library_trrs_shortcode');
```

2. **Use in any page/post:**
```
[library_trrs]
```

## 📋 All Integration Methods

### Method 1: Shortcode (Easiest) ⭐
- **File:** Copy code above to `functions.php`
- **Usage:** `[library_trrs]` or `[library_trrs height="600px"]`
- **Best for:** Quick integration, blog posts, pages

### Method 2: WordPress Plugin (Professional) 🔧
- **File:** `library-trrs-plugin.php`
- **Installation:** Upload to `/wp-content/plugins/library-trrs/`
- **Features:** Admin settings, customizable options
- **Best for:** Professional sites, multiple configurations

### Method 3: Full Page Template (Seamless) 🎯
- **File:** `custom-page-template.php`
- **Installation:** Save as `page-library-trrs.php` in your theme
- **Features:** No WordPress header/footer, full-screen experience
- **Best for:** Dedicated library management page

### Method 4: Widget (Sidebar) 📱
- **File:** `widget-embed.php`
- **Installation:** Add to `functions.php`
- **Features:** Sidebar/widget area integration
- **Best for:** Sidebar access, dashboard widgets

### Method 5: Direct HTML (Simple) 📝
```html
<div style="width: 100%; height: 800px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <iframe src="https://soft-choux-f67865.netlify.app" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            style="border-radius: 8px;"
            title="Library TRRS Management System">
    </iframe>
</div>
```

## 🎨 Customization Options

### Responsive Design
```php
[library_trrs height="800px" width="100%"]  // Desktop
[library_trrs height="600px" width="100%"]  // Tablet
[library_trrs height="500px" width="100%"]  // Mobile
```

### Custom Styling
Add to your theme's CSS:
```css
.library-trrs-container {
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    margin: 30px 0;
}

.library-trrs-container:hover {
    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    transform: translateY(-2px);
    transition: all 0.3s ease;
}
```

## 🔧 Advanced Configuration

### Security Headers (Optional)
Add to your WordPress `.htaccess`:
```apache
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Content-Security-Policy "frame-ancestors 'self' https://yourdomain.com"
```

### Performance Optimization
```php
// Lazy load iframe
<iframe src="https://soft-choux-f67865.netlify.app" loading="lazy">
```

## 📱 Mobile Responsiveness

The iframe automatically adjusts to mobile screens. For better mobile experience:

```css
@media (max-width: 768px) {
    .library-trrs-container {
        height: 600px !important;
        margin: 10px 0;
    }
}
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Iframe not loading:**
   - Check if your WordPress site has HTTPS
   - Verify the URL is accessible
   - Check browser console for errors

2. **Mobile display issues:**
   - Ensure responsive meta tag is present
   - Test different height values for mobile

3. **Plugin conflicts:**
   - Deactivate other plugins temporarily
   - Check for JavaScript conflicts

### Support:
- App URL: https://soft-choux-f67865.netlify.app
- Test the app directly before embedding
- Check browser developer tools for errors

## 🎯 Recommended Setup

For most WordPress sites, I recommend:

1. **Use Method 1 (Shortcode)** for simplicity
2. **Create a dedicated page** called "Library Management"
3. **Add the shortcode** `[library_trrs]` to that page
4. **Set page template** to full-width if available
5. **Add to main menu** for easy access

This gives you a professional integration with minimal setup time!