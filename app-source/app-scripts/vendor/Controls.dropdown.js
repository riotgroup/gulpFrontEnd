
var ui_select = {

    config : {
        search : {
            activator: 'search', // data-{activator}
            placheholder: 'Начните поиск',
            default: false,
        },

        // ------------------------------------------------------
        class  : 'form-controls__dropdown',
    },


    /* Создаем собственные селекты */
    init: function(objects)
    {
        $.each(objects, function() {
            var $select = $(this);
            $select.after(ui_select.template(this));
            ui_select.update(this);

            var $dropdown = $select.next('.'+ui_select.config.class);
            $dropdown.find('.'+ui_select.config.class + '-button').click(function(){
                ui_select.open($select);
            });

        });
    },

    open: function(object) {
        var $object = $(object).next('.'+ui_select.config.class);

        /**
         * Закроем все выпадающие списки
         * которые были открыты до этого
         */
        $.each($('.' + ui_select.config.class + '-open'), function(){
            ui_select.close($(this).prev('select'));
        });

        /* Открываем выпадающий список */
        if (!$object.hasClass(ui_select.config.class + '-open')) {
            $object.addClass(ui_select.config.class + '-open');

            // выделяем выбранный пункт
            $object.find('.' + ui_select.config.class + '-item__selected')
                .addClass(ui_select.config.class + '-item__hover');


            /* Скролим до выбранног пункта */
            var list_height = $object.find('.' + ui_select.config.class + '-list').outerHeight();
            var $selected = $object.find('.' + ui_select.config.class + '-item__selected');

            var count_visible = parseInt(list_height / $selected.outerHeight());
            var offset = parseInt( count_visible / 2 ) * $selected.outerHeight();
            var index = $selected.index();
            var scroll = index * $selected.outerHeight();
            $object.find('.' + ui_select.config.class + '-list').scrollTop(scroll - offset);


            /**
             * Показываем поле поиска по-умолчанию, если это
             * стоит в настройках. Или если явно указали показ поиска.
             */
            var showSearchField = $(object).data(ui_select.config.search.activator);
            if ((showSearchField === undefined && ui_select.config.search.default === true)
                || showSearchField === true ) {

                /* Show search field */
                $object.find('.' + ui_select.config.class +'-search').show().focus();
            }

            /* ------------------------------------------------ */

            $(document).click(function(event) {
                if ($(event.target).closest('.' + ui_select.config.class).length) return;
                ui_select.close(object);
                event.stopPropagation();
            });

            // регистрируем обработчик hotKeys
            ui_select.hotKeysBind(event, object);
        } else {
            ui_select.close($object);
        }
    },

    close: function(object) {
        var $object = $(object).next('.' + ui_select.config.class);

        $object.removeClass(ui_select.config.class + '-open');

        /* показываем поле поиска */
        if ($object.find('.' + ui_select.config.class +'-search').is(':visible')) {
            $object.find('.' + ui_select.config.class +'-search').hide().val('');

            $object.find('.' + ui_select.config.class +'-item').show();
        }

        ui_select.hotKeysUnbind();
        $(document).unbind('click');
    },

    select: function(item) {
        var $dropdown = $(item).parents('.' + ui_select.config.class);
        var name  = $dropdown.data('name');
        var value = $(item).data('value');
        var $select = $dropdown.prev('select[name="'+ name +'"]');

        $select.val(value);

        // закрываем
        ui_select.close($select);
    },

    search: function(value) {
        var $list = $('.' + ui_select.config.class + '-list');
        var $items = $list.find('.' + ui_select.config.class + '-item');

        if (value == '') {
            $items.show();
        } else {
            var _RegExp = new RegExp('^'+value, 'ig');

            $.each($items, function()
            {
                var $text = $(this).text();
                if ($text.match(_RegExp)) {
                    $(this).show(); // показываем найденые элементы
                } else {
                    $(this).hide(); // прячем другие
                }
            });
        }
    },

    /**
     * Обновить и создать список опций
     * @param  {object} object select
     * @return {void}
     */
    update: function(object) {
        var $options  = $(object).find('option');
        var $dropdown = $(object).next('.' + ui_select.config.class);
        var $list_values = $dropdown.find('.' + ui_select.config.class +'-list');
        var $title = $dropdown.find('.' + ui_select.config.class +'-text');
        var $selected = $list_values.find('li[data-value='+value+']');

        var text = $(object).find('option').filter(':selected').text();
        var value = $(object).find('option').filter(':selected').val();

        /* Чистим список */
        $list_values.empty();
        $title.addClass(ui_select.config.class + '-placeholder').text($(object).attr('placeholder'));

        /* Добавляем сброс значения */
        $list_values.append('<li data-value="" class="'+ ui_select.config.class +'-item">Сбросить</li>');
        ui_select.__hover($list_values.find('li:last-child'));

        /* Добавляем значения */
        $.each($options, function(key, el) {
            var $field = $('<li data-value="'+$(el).val()+'" class="'+ ui_select.config.class +'-item">'+ $(el).text() +'</li>');
            ui_select.__hover($field);
            $list_values.append($field);
        });

        /* Обозначаем выбранный пункт */
        if (value != undefined) {
            $selected = $list_values.find('li[data-value='+value+']');

            $selected.addClass(ui_select.config.class + '-item__selected');
            $title.removeClass(ui_select.config.class + '-placeholder').text(text);

        /* не выбрано ничего */
        } else {
            $list_values.find('.' + ui_select.config.class + '-item').removeClass(ui_select.config.class + '-item__selected');
            $title.addClass(ui_select.config.class + '-placeholder').text($(object).attr('placeholder'));
        }

        $list_values.find('li').click(function() {
            ui_select.select(this);
        });
    },

    __hover: function(el) {
        el.hover(function(){
            $(this).addClass(ui_select.config.class + '-item__hover');
        }, function(){
            $(this).removeClass(ui_select.config.class + '-item__hover');
        });
    },

    /**
     * Установить события по нажатию клавиш
     * "вверх", "вниз", "esc", "enter"
     *
     * @return {void}
     */
    hotKeysBind: function(e, object) {
        $(document).keydown(function(e) {
            switch ( e.keyCode ) {
                case 27: // esc
                    ui_select.close(object);
                break;

                case 33: // pageUp
                    ui_select.position(object, -4);
                    e.preventDefault();
                break;

                case 34: // pageDown
                    ui_select.position(object, 4);
                    e.preventDefault();
                break;

                case 38: // key up
                    ui_select.position(object, -1);
                    e.preventDefault();
                break;

                case 40: // key down
                    ui_select.position(object, 1);
                    e.preventDefault();
                break;

                case 13: // key enter
                    var $select = $(object).next('.' + ui_select.config.class);
                    var $select_item = $select.find('.' + ui_select.config.class + '-item__hover');

                    ui_select.select( $select_item );
                    e.preventDefault();
                break;
            }
        });

    },

    /**
     * Снять событие нажатий клавиш
     * @return {void}
     */
    hotKeysUnbind: function(){
        $(document).unbind('keydown');
    },

    position: function(object, number)
    {
        var number = parseInt(number);

        var $select_item;

        /* Созданный выпадающий список */
        var $select = $(object).next('.' + ui_select.config.class);

        /* Элементы которые видны */
        var $items =  $select.find('.' + ui_select.config.class + '-item:visible');

        /* Поиск выбранного элемента */
        var index = $items.filter('.' + ui_select.config.class + '-item__hover').index('li:visible');

        /* ---------------------------------------------------- */

        /* Если ни один элемент не выбран, выбираем первый в списке */
        /* key down || key up */
        if ( (number > 0 && index >= $items.size() - 1) || (number < 0 && index <= 0) ) {
            return false;
        }

        /* ---------------------------------------------------- */

        index += number;

        if (index < 0) index = 0;
        if (index >= $items.size()) index = $items.size() - 1;

        /* ---------------------------------------------------- */

        $select_item = $items.eq( index );

        /* ---------------------------------------------------- */

        /* Убираем отметку hover */
        $items.removeClass(ui_select.config.class + '-item__hover');

        /* Отмечаем выбранный элемент */
        $select_item.addClass(ui_select.config.class + '-item__hover');

        /**
         * Поднимаем список с элементами, если выбранный элемент
         * не помещается в видимую область списка
         **/
        var $list =  $select.find('.' + ui_select.config.class + '-list');
        var offset   = parseInt($list.css('padding-top')) + parseInt($list.css('padding-bottom'));
        var position = $select_item.position().top + offset;

        if (number > 0) {
            // Down key
            if (position >= $list.outerHeight()) {
                $list.scrollTop( $list.scrollTop() + ($select_item.outerHeight() * number) );
            }

        } else {
            /* Key up */
            if (position <= 0) {
                $list.scrollTop( $list.scrollTop() - (($select_item.outerHeight() * number) * -1) );
            }
        }

        return false;
    },


    /**
     * Шаблон для создания выпадающего списка
     * @param  {object} object
     * @return {void}
     */
    template : function(object) {
        /* объект со всеми атрибутами выпадающего списка */
        var objectAttr = {};
        $.map(object.attributes, function (attribute) {
            objectAttr[attribute.name] = attribute.value;
        });

        /* ---------------------------------------------------- */

        var $template = $(
            '<span class="'+ ui_select.config.class +'" data-name="'+ objectAttr.name +'">'+
            '<button class="'+ ui_select.config.class +'-button">'+
            '<span class="'+ ui_select.config.class +'-button__container">'+
                '<span class="'+ ui_select.config.class +'-text"/>'+
                '<span class="'+ ui_select.config.class +'-tick"/>'+
            '</span>'+
            '<input type="search" class="'+ ui_select.config.class +'-search" onkeyup="ui_select.search(this.value)" placeholder="'+ui_select.config.search.placheholder+'"/>'+
            '</button>'+
            '<ul class="'+ ui_select.config.class +'-list"/>'+
            '</span>');

        /* ---------------------------------------------------- */

        if ( $(object).data('design') !== undefined ) {
            $template.find('.' + ui_select.config.class).addClass( $(object).data('design') );
        }

        if (objectAttr.placeholder !== undefined) {
            $template.find('.' + ui_select.config.class + '-text')
                .addClass(ui_select.config.class + '-placeholder')
                .text(objectAttr.placeholder);
        }

        return $template;
    }
}


/**
 * Следим за программным изменением выпадающего списка
 * @type {void}
 */
jQuery.fn.valDefault = jQuery.fn.val;
jQuery.fn.val = function() {
    var el = $(this),
        val = jQuery.fn.valDefault.apply(el, arguments);

    if (el.is('select') && arguments.length == 1) {
        if (el.data('ui') == true) {
            ui_select.update(el);
        }
        el.trigger('change');
    }
    return val;
}