import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as rd from 'readline';
//! Taken from https://github.com/ThoSe1990/cwt-cucumber-support/blob/main/src/tree_view.ts

export namespace FileTree {
    //! This it to help determine the line and what file to open
    class line {
        readonly text: string;
        readonly row: number;
        readonly length: number;

        constructor(text: string, row: number) {
            this.text = text;
            this.length = text.length;
            this.row = row;
        }
    }

    //! Implements the item that will be within the tree
    class TreeItem extends vscode.TreeItem {
        checked: boolean;
        children: TreeItem[] = [];
        line: line;
        file: string;

        constructor(fileName: string, line: line) {
            super(fileName, vscode.TreeItemCollapsibleState.None)
            this.checked = false;
            this.line = line;
            this.file = fileName;
            this.collapsibleState = vscode.TreeItemCollapsibleState.None;
            this.updateCheckedStatus();
        }

        // Append a new file to the children of the file tree viewer
        public addChild(child: TreeItem) {
            this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            this.children.push(child);
        }

        // Update the checked box 
        public updateCheckedStatus() {
            this.iconPath = new vscode.ThemeIcon(this.checked ? "getting-started-item-checked" : "getting-started-item-unchecked")
        }

        public changeCheckedStatus() {
            this.checked = !this.checked;
            this.updateCheckedStatus();
        }
    }

    //! Store the information about the different trees
    class TreeData {
        private data: TreeItem[] = [];

        // Add tree item
        public addTreeItem(item: TreeItem) {
            this.data.push(item);
        }

        // Get the data
        public getData() {
            return this.data
        }

        public clearData() {
            this.data = [];
        }

        public at(index: number) {
            return this.data.at(index);
        }

    }

    export class TreeViewer implements vscode.TreeDataProvider<TreeItem> {
        private Tree: TreeData = new TreeData();

        // Update the tree if there is a change within teh data
        private eventEmitter: vscode.EventEmitter<TreeItem | undefined> = new vscode.EventEmitter<TreeItem | undefined>();
        readonly onDidChangeTreeData?: vscode.Event<TreeItem | undefined> = this.eventEmitter.event;

        //! Register the commands 
        public constructor() {
            vscode.commands.registerCommand('CodeOrigins.on_item_clicked', item => this.onItemClicked(item));
            vscode.commands.registerCommand('CodeOrigins.refresh', () => this.refresh());
        }

        public onItemClicked(item: TreeItem) {
            if (item.file === undefined) return;
            vscode.workspace.openTextDocument(item.file).then(document => {
                vscode.window.showTextDocument(document).then(editor => {
                    var pos = new vscode.Position(item.line.row - 1, item.line.length);
                    editor.selection = new vscode.Selection(pos, pos);
                    editor.revealRange(new vscode.Range(pos, pos));
                }
                );
            });
        }

        public getTreeItem(item: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
            var title = item.label ? item.label.toString() : "";
            var result = new vscode.TreeItem(title, item.collapsibleState);
            result.command = { command: "CodeOrigins.on_item_clicked", title: title, arguments: [item] }
            return result;
        }

        public getChildren(element: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
            return (element === undefined) ? this.Tree.getData() : element.children;
        }

        //! If there is a refresh occuring, we need to reload the directories that we have collected
        public refresh() {
            if (vscode.workspace.workspaceFolders) {
                this.Tree.clearData();
                this.collectDirectoryFiles(vscode.workspace.workspaceFolders[0].uri.fsPath);
                this.eventEmitter.fire(undefined); // Reload the data
            }
        }

        //! Read directory to obtain the file directory
        private collectDirectoryFiles(dir: string) {
            fs.readdirSync(dir).forEach(file => {
                let filePath = path.join(dir, file);
                if (fs.statSync(filePath).isDirectory()) {
                    this.collectDirectoryFiles(filePath)
                } else {
                    const label = filePath // At the end, it should just be the file name
                    const lineCounter = ((i = 1) => () => i++)();
                    var reader = rd.createInterface(fs.createReadStream(file))
                    reader.on("line", (currentLine: string, lineNumber: number = lineCounter()) => {
                        this.Tree.at(-1)?.addChild(new TreeItem(filePath, new line(currentLine, lineNumber)));
                    });
                }
            });
        }
    }
}