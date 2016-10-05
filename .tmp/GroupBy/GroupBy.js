import { Pipe } from '@angular/core';
export var GroupBy = (function () {
    function GroupBy() {
    }
    GroupBy.prototype.transform = function (value, field) {
        var groupedObj = value.reduce(function (prev, cur) {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            }
            else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        return Object.keys(groupedObj).map(function (key) { return { key: key, value: groupedObj[key] }; });
    };
    GroupBy.decorators = [
        { type: Pipe, args: [{ name: 'groupBy' },] },
    ];
    /** @nocollapse */
    GroupBy.ctorParameters = [];
    return GroupBy;
}());
