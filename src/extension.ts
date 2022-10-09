import {
  commands,
  ConfigurationChangeEvent,
  ExtensionContext,
  window,
  workspace
} from 'vscode';
import { Book } from './util';

let book: Book | null;
export function activate (context: ExtensionContext) {
  book = new Book();
  let displayCode = commands.registerCommand('extension.displayCode', () => {
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
    window.setStatusBarMessage(languageList[index]);
  });

  let getNextPage = commands.registerCommand('extension.getNextPage', () => {
    window.setStatusBarMessage(book!.getNextPage());
  });

  let getPreviousPage = commands.registerCommand(
    'extension.getPreviousPage',
    () => {
      window.setStatusBarMessage(book!.getPreviousPage());
    }
  );

  let getJumpingPage = commands.registerCommand(
    'extension.getJumpingPage',
    () => {
      window.setStatusBarMessage(book!.getJumpingPage());
    }
  );

  workspace.onDidChangeConfiguration(function (
    event: ConfigurationChangeEvent
  ) {
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
      book = new Book();
      window.setStatusBarMessage(book.getNextPage());
    }
  });

  context.subscriptions.push(displayCode);
  context.subscriptions.push(getNextPage);
  context.subscriptions.push(getPreviousPage);
  context.subscriptions.push(getJumpingPage);
}
export function deactivate () {
  book?.setConfigPageNumber();
  book = null;
}
