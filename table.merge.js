(function () {
    /**
        str == 字符串，表格ID 
        arr == 数组，需要合并的列 从0开始
        exam == 数值，参照列 从0开始(值必须是arr数组中的一个)
        other == 数组，其他合并单元格列数 从0开始
     */
    function Merge(str, arr, exam, other) {
        this.tableTr = $('#' + str).find('tr');
        this.refer = arr;
        this.exam = Number(exam);
        this.other = other;
        this.tableData = [];
        this.markerElement = {};
        this.deleteElement = {};
        for (var i = 0; i < arr.length; i++) {
            this.markerElement[i] = [];
            this.deleteElement[i] = [];
        }
        this.init();
    }
    Merge.prototype = {
        constructor: Merge,
        init: function() {
            this.getTableTd();
            // 判断
            var num = 2;
            for (var i = 0; i < this.refer.length; i++) {
                this.isEqual(num, i, 0);
            }

            // 更改与删除
            for (var i = 0; i < this.tableData.length; i++) {
                for (var j = 0; j < this.refer.length; j++) {
                    this.updateTd(this.markerElement[j], i, this.refer[j]);
                    this.deleteTd(this.deleteElement[j], i, this.refer[j]);
                }
            }

            // 例外
            if (this.exam && this.other && this.exam in this.refer) {
                for (var i = 0; i < this.tableData.length; i++) {
                    for (var j = 0; j < this.other.length; j++) {
                        this.updateTd(this.markerElement[this.exam], i, this.other[j]);
                        this.deleteTd(this.deleteElement[this.exam], i, this.other[j]);
                    }
                }
            }
        },
        // 获取所有的单元格
        getTableTd: function () {
            var tableTd;
            var self = this;
            this.tableTr.each(function (index) {
                tableTd = $(this).find('td');
                self.tableData[index] = [];
                for (var i = 0; i < tableTd.length; i++) {
                    self.tableData[index].push(tableTd[i]);
                }
            });
            // 删除最后一行
            this.tableData.pop();
        },
        /**
            判断相邻两个是否相等 
            row == 行
            col == 列
            type == 是否是迭代 0 === 相邻不相同, 1 === 相邻相同
        */
        isEqual: function (row, col, type) {
            if (row + 2 > this.tableData.length) {
                return false;
            } else {
                var firstTr = this.tableData[row];
                var secondTr = this.tableData[row + 1];
                if (firstTr && secondTr) {
                    if ($(firstTr[col]).html() === $(secondTr[col]).html()) {
                        type === 0 ? this.markerElement[col].push(row) : null;
                        this.deleteElement[col].push(row + 1);
                        this.isEqual(row + 1, col, 1);
                    } else if ($(firstTr[col]).html() === $(secondTr[col]).html()) {
                        type === 0 ? this.markerElement[col].push(row) : null;
                        this.deleteElement[col].push(row + 1);
                        this.isEqual(row + 1, col, 1);
                    } else {
                        this.isEqual(row + 1, col, 0);
                    }
                }
            }
        },
        /**
            合并单元格
            obj == 要循环的对象
            number == 查找目标
            col == 更改第几列的单元格
        */
        updateTd: function (obj, number, col) {
            for (var j = 0; j < obj.length; j++) {
                if (number === obj[j]) {
                    obj[j+1] > 0 ? 
                    $(this.tableData[number][col]).attr({'rowspan': Number(obj[j + 1] - obj[j])}).css({'textAlign': 'center', 'verticalAlign': 'middle'}) : 
                    $(this.tableData[number][col]).attr({'rowspan': Number(this.tableData.length - obj[j])}).css({'textAlign': 'center', 'verticalAlign': 'middle'});
                }
            }
        },
        /**
            隐藏单元格
            obj == 要循环的对象
            number == 查找目标
            col == 隐藏第几列的单元格
        */
        deleteTd: function (obj, number, col) {
            for (var k = 0; k < obj.length; k++) {
                if (number === obj[k]) {
                    $(this.tableData[number][col]).css('display', 'none');
                }
            }
        }
    }
    window.Merge = Merge;
})();

/**
    第一个参数: 表格的ID(String字符串类型)
    第二个参数：正常情况下需要判断并合并的列(Array数组类型)
    第三个参数：没有进行判断但却需要合并的列的参照物，值必须是第二个参数中的一个(Number数值类型)
    第四个参数：没有进行判断但却需要合并的列(Array数组类型)
    注：所有表格列数都从0开始计算
 */
new Merge('tableShow', [0, 1, 2], 2, [5, 6, 7]);
// new Merge('tableShow2', [0, 1, 2], 2, [5, 6, 7]);