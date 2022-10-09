"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const vscode_1 = require("vscode");
const fs = require("fs");
class Book {
    constructor() {
        this.pageSize = 50;
        this.pageCount = 0;
        this.bookText = '';
        this.pageNumber = 1;
        const filePath = (vscode_1.workspace.getConfiguration().get('thiefBook.filePath'));
        if (typeof filePath !== 'string' || filePath === '') {
            vscode_1.window.showWarningMessage('请填写TXT格式的小说文件路径 & Please fill in the path of the TXT format novel file');
            return;
        }
        const isEnglish = (vscode_1.workspace.getConfiguration().get('thiefBook.isEnglish'));
        const configPageSize = (vscode_1.workspace.getConfiguration().get('thiefBook.pageSize'));
        this.pageSize = isEnglish ? configPageSize * 2 : configPageSize;
        this.bookText = this.readFile(filePath);
        this.pageCount = Math.ceil(this.bookText.length / this.pageSize);
        this.pageNumber = this.getConfigPageNumber();
    }
    readFile(filePath) {
        try {
            var data = fs.readFileSync(filePath, 'utf-8');
            var lineBreak = (vscode_1.workspace.getConfiguration().get('thiefBook.lineBreak'));
            return data
                .replace(/\n/g, lineBreak)
                .replace(/[\r|　　]/g, ' ');
        }
        catch (e) {
            return '';
        }
    }
    getPreviousPage() {
        this.pageNumber = Math.max(1, this.pageNumber - 1);
        return this.getJumpingPage();
    }
    getNextPage() {
        this.pageNumber = Math.min(this.pageCount, this.pageNumber + 1);
        return this.getJumpingPage();
    }
    getJumpingPage() {
        return this.getBookPage(this.pageNumber);
    }
    getConfigPageNumber() {
        return vscode_1.workspace.getConfiguration().get('thiefBook.pageNumber');
    }
    setConfigPageNumber() {
        vscode_1.workspace
            .getConfiguration()
            .update('thiefBook.pageNumber', this.pageNumber, true);
    }
    getBookPage(pageNumber) {
        const startIndex = (pageNumber - 1) * this.pageSize;
        const endIndex = pageNumber * this.pageSize;
        const bookContent = this.bookText.substring(startIndex, endIndex);
        const splitContent = '    ';
        const pageInfo = pageNumber.toString() + '/' + this.pageCount.toString();
        return bookContent + splitContent + pageInfo;
    }
}
exports.Book = Book;
//# sourceMappingURL=util.js.map