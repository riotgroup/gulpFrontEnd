var Auto = {

    /**
     * Марки автомобиля
     * @return void
     */
    marks: function () {
        this.__get('marks');
    },

    /**
     * Модели автомобиля
     * @return void
     */
    models: function (car_mark) {
        this.__get('models', { car_mark: car_mark });
    },

    /**
     * Годы выпуска автомобиля
     * @return void
     */
    years: function (car_model) {
        this.__get('years', { car_model: car_model });
    },

    /**
     * Поколения автомобиля
     * @return void
     */
    generations: function (car_year) {
        var car_model = $('select[data-auto="models"]').val();
        this.__get('generation', { car_model: car_model, car_year: car_year });
    },

    /**
     * Серии автомобиля
     * @return void
     */
    series: function (car_generation) {
        this.__get('series', { car_generation: car_generation });
    },

    /**
     * Модификации автомобиля
     * @return void
     */
    modifications: function (car_serie) {
        this.__get('modification', { car_serie: car_serie });
    },

    /**
     * Запрос к API
     * @return void
     */
    __get: function (method, data) {
        var method_list = ['marks', 'models', 'years', 'generation', 'series', 'modification'];
        if (method_list.indexOf(method) === -1 || !$('select[data-auto="' + method + '"]').size()) return false;

        if (typeof data == 'undefined') var data = {};

        if (method != 'marks' && data != undefined) {
            $.each(data, function (key, value) {
                value = parseInt(value);
                if (isNaN(value)) {
                    data = unset(data, key);
                } else {
                    data[key] = value;
                }
            });
        }

        switch (method) {
            case 'marks': break;
            case 'generation': if (Object.keys(data).length != 2) return false; break;
            default: if (Object.keys(data).length == 0) return false; break;
        }

        /* Добавляем вечный токен */
        data['access_token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUcmFkZUNhciIsInN1YiI6ImE2ZTM5OGEyZjc5NmMyNTA4YTQ5ZjFhYTUzMjdiNDc5IiwiaWF0IjoxNTA2MDgwNzAxLCJleHAiOjE1Mzc2MTY3MDF9.e5-ArgQzraLd2OaXxcPawb1W1WAppeXFGpmf5NbH3Kg';

        /* Отправляем данные */
        $.ajax({
            url: 'http://tradecar.local/api/auto.' + method,
            dataType: 'json',
            method: 'GET',
            data: data,
            beforeSend: function () {
                /* Очищаем списки идущие после перед их заполнением */
                var _key_method = find(method_list, method);
                $.each(method_list, function (key, value) {
                    if (key >= _key_method) {
                        $('select[data-auto="' + method + '"]').empty();
                        ui_select.update($('select[data-auto="' + method + '"]'));
                    }
                });
            },
            success: function (response) {
                /* Заполняем список значениями */
                var $select = $('select[data-auto="' + method + '"]');
                if (response.result) {
                    // $select.empty();
                    $.each(response.data, function (key, item) {
                        $select.append('<option method="' + key + '">' + item + '</option>');
                    });
                    $select.val('');
                    ui_select.update($select);
                }
            },
        });

    }

};