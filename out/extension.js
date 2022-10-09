"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const util_1 = require("./util");
let book;
function activate(context) {
    book = new util_1.Book();
    let displayCode = vscode_1.commands.registerCommand('extension.displayCode', () => {
        let languageList = [
            'Java - System.out.println("Hello World");',
            'C++ - cout << "Hello, world!" << endl;',
            'C - printf("Hello, World!");',
            'Python - print("Hello, World!")',
            'PHP - echo "Hello World!";',
            'Ruby - puts "Hello World!";',
            'Perl - print "Hello, World!";',
            'Lua - print("Hello World!")',
            'Scala - println("Hello, world!")',
            'Golang - fmt.Println("Hello, World!")'
        ];
        var index = Math.floor(Math.random() * languageList.length);
        vscode_1.window.setStatusBarMessage(languageList[index]);
    });
    let getNextPage = vscode_1.commands.registerCommand('extension.getNextPage', () => {
        vscode_1.window.setStatusBarMessage(book.getNextPage());
    });
    let getPreviousPage = vscode_1.commands.registerCommand('extension.getPreviousPage', () => {
        vscode_1.window.setStatusBarMessage(book.getPreviousPage());
    });
    let getJumpingPage = vscode_1.commands.registerCommand('extension.getJumpingPage', () => {
        vscode_1.window.setStatusBarMessage(book.getJumpingPage());
    });
    vscode_1.workspace.onDidChangeConfiguration(function (event) {
        const configList = [
            'thiefBook.pageSize',
            'thiefBook.isEnglish',
            'thiefBook.lineBreak',
            'thiefBook.filePath'
        ];
        const affected = configList.some(item => {
            return event.affectsConfiguration(item);
        });
        if (affected) {
            book = new util_1.Book();
            vscode_1.window.setStatusBarMessage(book.getNextPage());
        }
    });
    context.subscriptions.push(displayCode);
    context.subscriptions.push(getNextPage);
    context.subscriptions.push(getPreviousPage);
    context.subscriptions.push(getJumpingPage);
}
exports.activate = activate;
function deactivate() {
    book?.setConfigPageNumber();
    book = null;
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map