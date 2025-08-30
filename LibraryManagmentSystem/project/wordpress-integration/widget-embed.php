<?php
/**
 * Library TRRS Widget
 * Add this to your theme's functions.php or create as a separate plugin
 */

class Library_TRRS_Widget extends WP_Widget {
    
    public function __construct() {
        parent::__construct(
            'library_trrs_widget',
            'Library TRRS',
            array(
                'description' => 'Embed Library TRRS Management System in a widget area'
            )
        );
    }
    
    public function widget($args, $instance) {
        $title = apply_filters('widget_title', $instance['title']);
        $height = !empty($instance['height']) ? $instance['height'] : '600px';
        $url = !empty($instance['url']) ? $instance['url'] : 'https://soft-choux-f67865.netlify.app';
        
        echo $args['before_widget'];
        
        if (!empty($title)) {
            echo $args['before_title'] . $title . $args['after_title'];
        }
        
        echo '<div style="width: 100%; height: ' . esc_attr($height) . '; border: none; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">';
        echo '<iframe src="' . esc_url($url) . '" width="100%" height="100%" frameborder="0" title="Library TRRS Management System">';
        echo '<p>Your browser does not support iframes. <a href="' . esc_url($url) . '" target="_blank">Click here to access Library TRRS</a></p>';
        echo '</iframe>';
        echo '</div>';
        
        echo $args['after_widget'];
    }
    
    public function form($instance) {
        $title = isset($instance['title']) ? $instance['title'] : 'Library Management';
        $height = isset($instance['height']) ? $instance['height'] : '600px';
        $url = isset($instance['url']) ? $instance['url'] : 'https://soft-choux-f67865.netlify.app';
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">Title:</label>
            <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" 
                   name="<?php echo $this->get_field_name('title'); ?>" type="text" 
                   value="<?php echo esc_attr($title); ?>" />
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('height'); ?>">Height:</label>
            <input class="widefat" id="<?php echo $this->get_field_id('height'); ?>" 
                   name="<?php echo $this->get_field_name('height'); ?>" type="text" 
                   value="<?php echo esc_attr($height); ?>" />
            <small>e.g., 600px, 400px</small>
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('url'); ?>">App URL:</label>
            <input class="widefat" id="<?php echo $this->get_field_id('url'); ?>" 
                   name="<?php echo $this->get_field_name('url'); ?>" type="url" 
                   value="<?php echo esc_attr($url); ?>" />
        </p>
        <?php
    }
    
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = (!empty($new_instance['title'])) ? strip_tags($new_instance['title']) : '';
        $instance['height'] = (!empty($new_instance['height'])) ? strip_tags($new_instance['height']) : '600px';
        $instance['url'] = (!empty($new_instance['url'])) ? esc_url_raw($new_instance['url']) : 'https://soft-choux-f67865.netlify.app';
        
        return $instance;
    }
}

// Register the widget
function register_library_trrs_widget() {
    register_widget('Library_TRRS_Widget');
}
add_action('widgets_init', 'register_library_trrs_widget');
?>