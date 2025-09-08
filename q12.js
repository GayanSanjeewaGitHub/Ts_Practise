function findtarget(arr, target) {
    var start = 0;
    var end = 0;
    var strated = false;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === target && !strated) {
            start = i;
            strated = true;
        }
        if (strated && arr[i] == target) {
            end = i;
        }
    }
    return [start, end];
}
console.log(findtarget([5, 7, 7, 8, 8, 10], 8));
