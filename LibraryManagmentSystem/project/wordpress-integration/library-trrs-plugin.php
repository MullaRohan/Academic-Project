<?php
/**
 * Plugin Name: Library TRRS Management System
 * Plugin URI: https://soft-choux-f67865.netlify.app
 * Description: Integrates the Library TRRS Management System into WordPress using iframe embed.
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class LibraryTRRSPlugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'settings_init'));
    }
    
    public function init() {
        // Register shortcode
        add_shortcode('library_trrs', array($this, 'library_trrs_shortcode'));
        
        // Add CSS for better iframe styling
        add_action('wp_head', array($this, 'add_iframe_styles'));
    }
    
    public function library_trrs_shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => get_option('library_trrs_height', '800px'),
            'width' => get_option('library_trrs_width', '100%'),
            'url' => get_option('library_trrs_url', 'https://soft-choux-f67865.netlify.app')
        ), $atts);
        
        $output = '<div class="library-trrs-container" style="width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . ';">';
        $output .= '<iframe src="' . esc_url($atts['url']) . '" ';
        $output .= 'width="100%" ';
        $output .= 'height="100%" ';
        $output .= 'frameborder="0" ';
        $output .= 'class="library-trrs-iframe" ';
        $output .= 'title="Library TRRS Management System" ';
        $output .= 'loading="lazy">';
        $output .= '<p>Your browser does not support iframes. <a href="' . esc_url($atts['url']) . '" target="_blank">Click here to access Library TRRS</a></p>';
        $output .= '</iframe>';
        $output .= '</div>';
        
        return $output;
    }
    
    public function add_iframe_styles() {
        echo '<style>
        .library-trrs-container {
            border: none;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin: 20px 0;
            overflow: hidden;
            background: #f8f9fa;
        }
        
        .library-trrs-iframe {
            border-radius: 8px;
            transition: opacity 0.3s ease;
        }
        
        .library-trrs-container:hover {
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        
        @media (max-width: 768px) {
            .library-trrs-container {
                margin: 10px 0;
                border-radius: 4px;
            }
        }
        </style>';
    }
    
    // Admin menu
    public function add_admin_menu() {
        add_options_page(
            'Library TRRS Settings',
            'Library TRRS',
            'manage_options',
            'library_trrs',
            array($this, 'options_page')
        );
    }
    
    public function settings_init() {
        register_setting('library_trrs_settings', 'library_trrs_url');
        register_setting('library_trrs_settings', 'library_trrs_width');
        register_setting('library_trrs_settings', 'library_trrs_height');
        
        add_settings_section(
            'library_trrs_section',
            'Library TRRS Configuration',
            array($this, 'settings_section_callback'),
            'library_trrs_settings'
        );
        
        add_settings_field(
            'library_trrs_url',
            'App URL',
            array($this, 'url_render'),
            'library_trrs_settings',
            'library_trrs_section'
        );
        
        add_settings_field(
            'library_trrs_width',
            'Default Width',
            array($this, 'width_render'),
            'library_trrs_settings',
            'library_trrs_section'
        );
        
        add_settings_field(
            'library_trrs_height',
            'Default Height',
            array($this, 'height_render'),
            'library_trrs_settings',
            'library_trrs_section'
        );
    }
    
    public function url_render() {
        $url = get_option('library_trrs_url', 'https://soft-choux-f67865.netlify.app');
        echo '<input type="url" name="library_trrs_url" value="' . esc_attr($url) . '" class="regular-text" />';
        echo '<p class="description">The URL of your Library TRRS application</p>';
    }
    
    public function width_render() {
        $width = get_option('library_trrs_width', '100%');
        echo '<input type="text" name="library_trrs_width" value="' . esc_attr($width) . '" class="regular-text" />';
        echo '<p class="description">Default width (e.g., 100%, 800px)</p>';
    }
    
    public function height_render() {
        $height = get_option('library_trrs_height', '800px');
        echo '<input type="text" name="library_trrs_height" value="' . esc_attr($height) . '" class="regular-text" />';
        echo '<p class="description">Default height (e.g., 800px, 600px)</p>';
    }
    
    public function settings_section_callback() {
        echo '<p>Configure the default settings for the Library TRRS Management System embed.</p>';
    }
    
    public function options_page() {
        ?>
        <div class="wrap">
            <h1>Library TRRS Settings</h1>
            <form action="options.php" method="post">
                <?php
                settings_fields('library_trrs_settings');
                do_settings_sections('library_trrs_settings');
                submit_button();
                ?>
            </form>
            
            <div class="card" style="margin-top: 20px;">
                <h2>How to Use</h2>
                <p>After configuring the settings above, you can embed the Library TRRS system in any page or post using:</p>
                <code>[library_trrs]</code>
                
                <h3>Shortcode Parameters</h3>
                <ul>
                    <li><code>[library_trrs]</code> - Uses default settings</li>
                    <li><code>[library_trrs height="600px"]</code> - Custom height</li>
                    <li><code>[library_trrs width="80%" height="700px"]</code> - Custom dimensions</li>
                </ul>
                
                <h3>Current App URL</h3>
                <p><a href="<?php echo esc_url(get_option('library_trrs_url', 'https://soft-choux-f67865.netlify.app')); ?>" target="_blank">
                    <?php echo esc_url(get_option('library_trrs_url', 'https://soft-choux-f67865.netlify.app')); ?>
                </a></p>
            </div>
        </div>
        <?php
    }
}

// Initialize the plugin
new LibraryTRRSPlugin();

// Activation hook
register_activation_hook(__FILE__, 'library_trrs_activate');
function library_trrs_activate() {
    // Set default options
    add_option('library_trrs_url', 'https://soft-choux-f67865.netlify.app');
    add_option('library_trrs_width', '100%');
    add_option('library_trrs_height', '800px');
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'library_trrs_deactivate');
function library_trrs_deactivate() {
    // Clean up if needed
}
?>