import { workspace, window } from 'vscode';
import * as fs from 'fs';

export class Book {
  pageSize: number = 50;
  pageCount = 0;
  bookText: string = '';
  pageNumber: number = 1;

  constructor () {
    const filePath = <string>(
      workspace.getConfiguration().get('thiefBook.filePath')
    );
    if (typeof filePath !== 'string' || filePath === '') {
      window.showWarningMessage(
        '请填写TXT格式的小说文件路径 & Please fill in the path of the TXT format novel file'
      );
      return;
    }
    const isEnglish = <boolean>(
      workspace.getConfiguration().get('thiefBook.isEnglish')
    );
    const configPageSize = <number>(
      workspace.getConfiguration().get('thiefBook.pageSize')
    );
    this.pageSize = isEnglish ? configPageSize * 2 : configPageSize;
    this.bookText = this.readFile(filePath);
    this.pageCount = Math.ceil(this.bookText.length / this.pageSize);
    this.pageNumber = this.getConfigPageNumber();
  }

  readFile (filePath: string) {
    try {
      var data = fs.readFileSync(filePath, 'utf-8');

      var lineBreak = <string>(
        workspace.getConfiguration().get('thiefBook.lineBreak')
      );

      return data
        .replace(/\n/g, lineBreak)
        .replace(/[\r|　　]/g, ' ');
    } catch (e) {
      return '';
    }
  }

  getPreviousPage () {
    this.pageNumber = Math.max(1, this.pageNumber - 1);
    return this.getJumpingPage();
  }

  getNextPage () {
    this.pageNumber = Math.min(this.pageCount, this.pageNumber + 1);
    return this.getJumpingPage();
  }

  getJumpingPage () {
    return this.getBookPage(this.pageNumber);
  }

  getConfigPageNumber () {
    return <number>workspace.getConfiguration().get('thiefBook.pageNumber');
  }

  setConfigPageNumber () {
    workspace
      .getConfiguration()
      .update('thiefBook.pageNumber', this.pageNumber, true);
  }

  getBookPage (pageNumber: number) {
    const startIndex = (pageNumber - 1) * this.pageSize;
    const endIndex = pageNumber * this.pageSize;
    const bookContent = this.bookText.substring(startIndex, endIndex);
    const splitContent = '    ';
    const pageInfo = pageNumber.toString() + '/' + this.pageCount.toString();
    return bookContent + splitContent + pageInfo;
  }
}
