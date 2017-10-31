/**
 * Поиск в массиве
 * Вернет ключ найденного значения
 */
var find = function(array, value)
{
    for (var i = 0; i < array.length; i++) {
        // if (array[i] === value) return i;
        if (array[i] == value) return i;
    }
    return -1;
}


/**
 * Удалить элемент из массива
 */
var unset = function(arrayUnset, key) {

    var arr = {};
    $.each(arrayUnset, function(arrKey, arrValue){
        if (key != arrKey) {
            arr[arrKey] = arrValue;
        }
    });

    return arr;
}