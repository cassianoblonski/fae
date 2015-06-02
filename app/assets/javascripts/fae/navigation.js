var FaeNavigation = {
  current_items: [],

  init: function() {
    this.select_current_nav_item();
    this.update_nav_classes();
    if($('.sticky-table-header').length) {
      this.sticky_table_header();
    }
  },

  select_current_nav_item: function() {
    var self = this;
    var current_base_url = window.location.pathname;
    var url_without_edit_new = current_base_url.replace(/\/new|\/edit/, '');
    $('#main_nav a').each(function(){
      var $this = $(this);
      var link = $this.attr('href');
      if (link === url_without_edit_new || link === current_base_url) {
        $this.addClass('current');
        self.current_items.push($this);
        return false;
      }
    });
  },

  update_nav_classes: function() {
    var self = this;
    $.each(self.current_items, function(index, $el){
      if ($el.hasClass('main_nav-link')) {
        self.update_first_level($el);
      } else if ($el.hasClass('main_nav-sub-link')) {
        self.update_second_level($el);
      } else if ($el.hasClass('main_nav-third-link')) {
        self.update_third_level($el);
      }
    });
  },

  update_first_level: function($el) {
    $el.closest('li').addClass('main_nav-active-single');
  },

  update_second_level: function($el) {
    $el
      .closest('li').addClass('main_nav-sub-active')
      .closest('.main_nav-accordion').removeClass('main_nav-accordion').addClass('main_nav-active');
  },

  update_third_level: function($el) {
    $el
      .closest('li').addClass('main_nav-third-active')
      .closest('.sub_nav-accordion').removeClass('sub_nav-accordion').addClass('main_nav-sub-active--no_highlight')
      .closest('.main_nav-accordion').removeClass('main_nav-accordion').addClass('main_nav-active');
  },

  // Fix a table header to the top of the view on scroll
  sticky_table_header: function() {
    var headerHeight = $('.main_content-header').outerHeight();
    var $sticky_tables = $('.sticky-table-header');
    var sticky_table_header_selector = '.sticky-table-header--hidden';
    var headerHeight = $('.main_content-header').outerHeight();
    var $window = $(window);

    // Cache offset and height values to spare expensive calculations on scroll
    var sizeFixedHeader = function($el) {
      var $this = $el;
      var headerHeight = $('.main_content-header').outerHeight();
      var tableOffset = $this.offset().top - headerHeight;
      var bottomOffset = $this.height() + tableOffset - $this.find('thead').height();
      var $fixedHeader = $this.next(sticky_table_header_selector);

      $fixedHeader.data({
        'table-offset' : tableOffset,
        'table-bottom' : bottomOffset
      });

      $fixedHeader.css({
        width: $this.outerWidth(),
        height: $this.outerHeight(),
        top: ($window.width() < 767 ? 0 : headerHeight),
      });

      $this.find('thead tr th').each(function(index){
        var original_width = $(this).outerWidth()
        // Using .width() as a setter is bunk
        $($fixedHeader.find('tr > th')[index]).css('width', original_width);
      });
    };

    // Add sticky psuedo tables after our main table to hold the fixed header
    $sticky_tables.each(function() {
      var $this = $(this);
      var $header = $this.find('thead').clone();
      var new_classes = $this.attr('class').replace('sticky-table-header', sticky_table_header_selector.substr(1));

      var $fixedHeader = $('<table />', {
        class: new_classes
      });

      $fixedHeader.append( $header );
      $this.after($fixedHeader);

      sizeFixedHeader($this);
    });

    // If the table header is in range, show it, otherwise hide it
    $window.on('scroll', function() {
      var offset = $(this).scrollTop();

      $(sticky_table_header_selector).each(function() {
        var $this = $(this);
        var tableOffset = $this.data('table-offset');
        var tableBottom = $this.data('table-bottom');

        if (offset >= tableOffset && offset <= tableBottom) {
          $this.show();
        } else {
          $this.hide();
        }
      });
    });

    // Get all values squared away again if the viewport gets smaller
    $window.on('resize', function() {

      $sticky_tables.each(function() {
        sizeFixedHeader($(this));
      });

    });

    // Because images mess this up too
    $window.on('load', function() {
      $sticky_tables.each(function() {
        sizeFixedHeader($(this));
      });
    });

  }
}