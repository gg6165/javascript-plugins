/*
 * OpenSelect
 *
 * Copyright (c) 2019 Kaijun Guo
 * Version 1.0.0
 */
(function ($) {
    "use strict";

    var nextId = 0;

    var OpenSelect = function (element, options) {
        this.options = options;
        this.$elementOpenSelect = [];
        this.$element = $(element);
    };

    OpenSelect.prototype = {
        mainbtnClass: function (value) {
            if (value !== undefined) {
                this.options.mainbtnClass = value;
            } else {
                return this.options.mainbtnClass;
            }
        },

        itemstyle: function (value) {
            if (value !== undefined) {
                this.options.itemstyle = value;
            } else {
                return this.options.itemstyle;
            }
        },

        itembg: function (value) {
            if (value !== undefined) {
                this.options.itembg = value;
            } else {
                return this.options.itembg;
            }
        },

        items: function (value) {
            if (value !== undefined) {
                if (value.length > 0) {
                    this.options.items = value;
                }
                else {
                    return this.options.items;
                }
            } else {
                return this.options.items;
            }
        },

        constructor: function () {
            var _self = this,
                html = '',
                id = _self.$element.attr('id'),
                selectOptions = [],
                btn = '',
                $label;

            if (id === '' || !id) {
                id = 'openselect-' + nextId;
                _self.$element.attr({
                    'id': id
                });
                nextId++;
            }

            var obj = _self.options.items;
            var itemoptions = '';
            if (obj.length > 0) {
                itemoptions = '<span class="btn p-0" style="' + _self.options.itembg + '">';

                var defautbutton = obj.find(function (def) {
                    return def.default == true;
                }); 

                if (defautbutton == undefined) {
                    defautbutton = obj[0];
                }

                for (var i = 0; i < obj.length; i++) {

                    itemoptions += '<button style="' + _self.options.itemstyle + '" data-value="' + obj[i].value + '"  class="btn btn-sm ' + obj[i].btnclass + ' p-0 osoption"><i class="' + obj[i].icon + '"></i></button>';
                }
                itemoptions += '</span>';

                html = '<span><span style="position:absolute;"><button class="btn ' + defautbutton.btnclass + ' ' + _self.options.mainbtnClass + ' os_main_button"><i class="' + defautbutton.icon + '"></i></button></span></span>';

            }
            else {
                html = '<span><span style="position:absolute;" class="text-light"><button class="btn btn-success btn-sm os_main_button"><i class="fa fa-check"></i></button></span></span>';
                itemoptions = '<span class="btn p-0" style="background-color:darkseagreen"><button style="width:25px;height:25px;border-radius:50%;" data-value="0"  class="btn btn-success btn-sm p-0 osoption"><i class="fa fa-check"></i></button><button  style="width:25px;height:25px;border-radius:50%;" data-value="1" class="btn btn-danger btn-sm p-0 osoption"><i class="fa fa-close"></i></button><button  style="width:25px;height:25px;border-radius:50%;"  data-value="2" class="btn btn-info btn-sm p-0 osoption"><i class="fa fa-hourglass-half "></i></button><button  style="width:25px;height:25px;border-radius:50%;" data-value="3" class="btn btn-info btn-sm p-0 osoption"><i class="fa fa-hourglass-half "></i></button></span>';
            }

            _self.$elementOpenSelect = $(html);
            _self.$elementOpenSelect.find('.os_main_button').click(function () {
                event.preventDefault();
                var $this = $(this);
                if (!$this.hasClass('osclicked')) {
                    $this.addClass('osclicked');
                    $this.parent().append(itemoptions);
                    $this.parent().find(".osoption").mousedown(function () {
                        event.preventDefault();
                        var element = $(this);
                        var value = element.attr("data-value");
                        event.preventDefault();
                        //
                        element.parent().parent().siblings("input").val(value);
                        var mainbutton = element.parent().parent().children(".os_main_button");
                        mainbutton.children("i").remove();
                        mainbutton.removeClass();
                        mainbutton.addClass('btn btn-sm os_main_button');

                        var found = obj.find(function (current) {
                            return current.value == value;
                        });  

                        mainbutton.append('<i class="' + found.icon + '"></i>');
                        mainbutton.addClass(found.btnclass);

                        mainbutton.removeClass('osclicked');
                        mainbutton.siblings().remove();
                    });
                }
                else {
                    $this.removeClass('osclicked');
                    $this.siblings().remove();
                    $this.parent().siblings("input").val(0);
                }
            });

            _self.$elementOpenSelect.find('.os_main_button').on("blur", function () {

                var $this = $(this);
                $this.removeClass('osclicked');
                $this.siblings().remove();
            });

            //add attributes and css
            _self.$element.attr('name', id);
            _self.$element.css({
                'position': 'absolute',
                'clip': 'rect(0px 0px 0px 0px)' // using 0px for work in IE8
            }).attr('tabindex', "-1").after(_self.$elementOpenSelect);

        }
    };

    var old = $.fn.openselect;

    $.fn.openselect = function (option, value) {
        var get = '', element = this.each(function () {
            if ($(this).attr('class') === 'os_default') {
                var $this = $(this), data = $this.data('openselect'), options = $.extend({}, $.fn.openselect.defaults, option, typeof option === 'object' && option);

                if (!data) {
                    $this.data('openselect', data = new OpenSelect(this, options));
                    data.constructor();
                }

                if (typeof option === 'string') {
                    get = data[option](value);
                }
            }
        });

        //return element;
        if (typeof get !== undefined) {
            return get;
        } else {
            return element;
        }
    };

    $.fn.openselect.defaults = {
        'mainbtnClass': 'btn-sm',
        'itemstyle': 'width:25px;height:25px;border-radius:50%;',
        'itembg':'background-color:darkseagreen',
        'items': [
            { value: 0, icon: "fa fa-check text-white", btnclass: "bg-success", default: true },
            { value: 1, icon: "fa fa-close text-white", btnclass: "bg-danger" },
            { value: 2, icon: "fa fa-hourglass-half text-white", btnclass: "bg-info" }
        ],
    };

    $.fn.openselect.noConflict = function () {
        $.fn.openselect = old;
        return this;
    };

})(window.jQuery);