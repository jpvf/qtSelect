(function ($) {
  $.fn.qtSelect = function (method) {
    var defaults = {
      height: 200
    };
    var settings = {};
    var methods = {
      init: function (options) {
        settings = $.extend({}, defaults, options);
        return this.each(function () {
        	var select    = $(this);  
			var options   = select.html();			
			var selected  = select.find('option:selected').html();			
			var finalHtml = helpers._createSelect(selected, options);			
			var element   = $("<div class='qtSelect'></div>");
			
			select.hide();
			select.after(element.append(finalHtml));			
			
			var newHeight = element.find('div.options').outerHeight();
			var height    = (newHeight < settings.height) ? newHeight : settings.height;		
			var width  	  = element.find('div.selected-option').outerWidth();
			
			element.find('.options div[selected=selected]:first').attr('id','current').addClass('ui-state-active');
			
			element.find('div.options').css({
				'marginTop' : '-' + element.find('div.selected-option').outerHeight() + 'px',
				'width' : width + 'px',
				'height' : height + 'px'
			});
			
			events._setAll(element, select);		
			
        });
      },

	  destroy : function (){
			var select = $(this);			
			select.next('div.qtSelect:first').remove();
			select.show();
	  },
	
	  disable : function(){
			var select = $(this);
			var element = select.next('div.qtSelect:first');
			element.addClass('ui-state-disabled');
			element.find('div.options').hide();
	  },
	
	  enable : function(){
			var select = $(this);
			var element = select.next('div.qtSelect:first');
			element.removeClass('ui-state-disabled');
	  }
		
    };

    var helpers = {
      	_createSelect: function (selected, options) {
      		options = options.replace(/<option/gi, '<div');
      		options = options.replace(/<\/option>/gi, '<\/div>');
			var finalHtml = "<div class='selected-option ui-widget-header ui-state-default ui-corner-all'>";
			finalHtml += "<span class='selected-option-text'>" + selected + "</span><span class='arrows ui-icon ui-icon-triangle-2-n-s'></span>";
			finalHtml += "<span style='clear:both'></span></div><div class='options ui-widget-content  ui-corner-all'>"
			finalHtml += options;
			finalHtml += "</div>";
			
			return finalHtml;
	    }
    };

	var events = {		

		_setAll : function(element, select){
			element.delegate('div.selected-option','click', this._toggleDisplayState);
			element.delegate('div.options div', 'mouseover mouseout', this._mouseOver);
			element.delegate('div.selected-option', 'mouseover mouseout', this._mouseOver);
			element.delegate('div.options div', 'click', {'element' : select}, this._optionClick);
			$(document).bind('click', {'element' : element}, this._clickOutside);
		},
		
		_toggleDisplayState : function(){
			if( ! events._is_enabled($(this).parent())){
				return false;
			}
			var element = $(this);
			var options = element.parent().find('.options');
			
			element.addClass('ui-state-active');
			events._removeActiveState(element);
			
			options.toggle();
			options.scrollTop(options.find('#current').position().top);
		},
		
		_hideOptions : function(){
			if( ! events._is_enabled($(this).parent())){
				return false;
			}
			$(this).parent().find('.options').hide();
			events._removeActiveState($(this).find('div.selected-option'));
		},
		
		_mouseOver : function(e){
			if( ! events._is_enabled($(this).closest('.qtSelect'))){
				return false;
			}
			if (e.type == 'mouseover') {
			  $(this).addClass('ui-state-hover');
			} else {
			  $(this).removeClass('ui-state-hover');
			}
		},
		
		_optionClick : function(e){
			var selected = $(this);			
			var element  = selected.closest('.qtSelect');
			var options  = element.find('.options');
			
			if( ! events._is_enabled(element)){
				return false;
			}
			
			element.find('div.selected-option').find('span.selected-option-text').html(selected.html());			
		
			events._removeActiveState(element);
			events._changeVal(selected, e.data.element);
			
			options.find('#current').removeClass('ui-state-active')
			options.find('#current').removeAttr('id');	
			
			selected.attr('id', 'current');
			selected.addClass('ui-state-active');			
			
			options.hide();
		},
		
		_changeVal : function(selected, element){
			if( ! events._is_enabled(selected.closest('.qtSelect'))){
				return false;
			}
			element.children('option').removeAttr('selected');
			element.find('option:eq(' + selected.index() + ')').attr('selected', 'selected');
		},
		
		_clickOutside : function(e){
			if ( ! e.data.element.has($(e.target)).length){
				e.data.element.find('.options').hide();
				events._removeActiveState(e.data.element);
			}
		},
		
		_removeActiveState : function(element){
			if( ! events._is_enabled(element)){
				return false;
			}
			element.find('div.selected-option').removeClass('ui-state-active');
		},
		
		_is_enabled : function(element){
			if (element.hasClass('ui-state-disabled')){
				return false;
			}
			return true;
		}
	};
	
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method "' + method + '" does not exist in pluginName plugin!');
    }
  };
})(jQuery);