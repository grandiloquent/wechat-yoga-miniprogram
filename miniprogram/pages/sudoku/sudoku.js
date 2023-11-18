const sudoku = require('./algorithm');
const app = getApp();

Page({
    data: {
        app,
        loaded: true,
        selectedIndex: -1,
        difficulties: ["简单", "一般", "困难"]
    },
    async onLoad() {
        // https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        wx.setNavigationBarTitle({
            title: "数独 - 益智游戏"
        });
        this.initializeGameDifficultyLevel();
        this.initializePuzzle();
        this.initializeBoard();
    },
    // https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object
    onShareAppMessage() {
        return {
            title: "数独 - 益智游戏"
        }
    },
    initializeGameDifficultyLevel() {
        const difficulty = parseInt(wx.getStorageSync('difficulty') || "1");
        this.setData({ difficultySelected: difficulty });
    },
    initializePuzzle() {
        this.setData({
            puzzle: wx.getStorageSync('puzzle')
        });
        if (!this.data.puzzle) {
            this.createPuzzle();
        }
    },
    initializeBoard() {
        const numbers = wx.getStorageSync('numbers');
        if (numbers) {
            this.setData({
                numbers: JSON.parse(numbers)
            });
            return;
        }
        this.createBoard();

    }, createBoard() {
        this.setData({
            numbers:
                //            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80]
                this.data.puzzle.split('')
                    .map(x => {
                        if (x === '.') return 0;
                        return parseInt(x)
                    })
        });
    },
    createPuzzle() {
        this.setData({
            puzzle: sudoku.generate(
                (this.data.difficultySelected === 1 && "medium") ||
                (this.data.difficultySelected === 2 && "hard") || "easy"
            )
        });
        wx.setStorageSync('puzzle', this.data.puzzle);
    },
    onDifficultyClick(e) {
        const index = parseInt(e.currentTarget.dataset.index);
        // showModal
        // https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html
        wx.showModal({
            title: '询问',
            content: '您确定要重新选择游戏等级吗？',
            success: (res) => {
                if (res.confirm) {
                    wx.setStorageSync('difficulty', index + '')
                    this.setData({ difficultySelected: index });
                    this.reset();
                } else {
                }
            }
        });
    }
    ,
    reset() {
        wx.setStorageSync('numbers', null);
        this.createPuzzle();
        this.createBoard();
    },
    onHide() {
        wx.setStorageSync('numbers',
            JSON.stringify(this.data.numbers))
    },
    onItemClick(e) {
        const index = e.currentTarget.dataset.index;
        if (this.data.puzzle[index] !== '.') {
            return
        }
        this.setData({ selectedIndex: index });
        this.updateCandidateNumbers();
    },

    updateCandidateNumbers() {
        const index = this.data.selectedIndex;
        let indexs = [...new Set(getColumnAtPosition(index)
            .concat(getRowAtPosition(index)).concat(
                getBlockAtPosition(index)
            ))].sort();
        let numbers = [];
        for (let index = 0; index < indexs.length; index++) {
            numbers.push(this.data.numbers[indexs[index]]);
        }
        numbers = [... new Set(numbers)].sort();
        let n = [];
        for (let index = 1; index < 10; index++) {
            if (numbers.indexOf(index) === -1) {
                n.push(index);
            }
        }
        const value = this.data.numbers[index];
        if (value)
            n.push('清空');
        this.setData({
            n: n
        })
    },
    onSelected(e) {
        const value = e.currentTarget.dataset.value;
        if (value === '清空') {
            this.data.numbers[this.data.selectedIndex] = 0;
            this.setData({
                numbers: this.data.numbers
            });
        } else {
            this.data.numbers[this.data.selectedIndex] = value;
            this.setData({
                numbers: this.data.numbers
            });
            console.log(this.data.numbers.filter(
                n => n === 0
            ).length);
            if (this.data.numbers.filter(
                n => n === 0
            ).length === 0 && sudoku.solve(this.data.puzzle)
                === this.data.numbers.join('')) {
                // showModal
                // https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html
                wx.showModal({
                    title: '询问',
                    content: '恭喜您已通关!\n您要重新开始游戏吗？',
                    success: (res) => {
                        if (res.confirm) {
                            this.reset();
                        }
                    }

                });
            }
        }
        this.updateCandidateNumbers();
    },
});

function getColumnAtPosition(index) {
    return [...new Array(9).keys()].map(x => index % 9 + x * 9);
}
function getRowAtPosition(index) {
    const rowsStart = index - index % 9;
    return [...new Array(9).keys()].map(x => rowsStart + x);
}
function getBlockAtPosition(index) {
    const blocksStart = ((index / 9 | 0) / 3 | 0) * 27 + (index % 9 / 3 | 0) * 3;
    return [...new Array(9).keys()].map(x => {
        if (x < 3) {
            return blocksStart + x;
        } else {
            return blocksStart + (x / 3 | 0) * 9 + x % 3;
        }
    });
}