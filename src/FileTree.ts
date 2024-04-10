import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as rd from 'readline';
//! Taken from https://github.com/ThoSe1990/cwt-cucumber-support/blob/main/src/tree_view.ts

export namespace FileTree {
    //! Implements the item that will be within the tree
    class TreeItem extends vscode.TreeItem {
        checked: boolean;
        children: TreeItem[] = [];
        file: string;

        constructor(fileName: string) {
            super(fileName, vscode.TreeItemCollapsibleState.None)
            this.checked = false;
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
            vscode.commands.registerCommand('CodeOriginsPanel.onItemClicked', item => this.onItemClicked(item));
            vscode.commands.registerCommand('CodeOriginsPanel.refresh', () => this.refresh());
        }

        //! Need this late for when the item is clicked, we need to show the CodeOrigins
        //! The goal is to open the file with the "CodeOrigins" overlay
        public onItemClicked(item: TreeItem) {
            if (item.file === undefined) return;
            var title = item.label ? item.label.toString() : "";
            var result = new vscode.TreeItem(title, item.collapsibleState);
            result.command = { command: "CodeOriginsPanel.onItemClicked", title: title, arguments: [item] }
        }

        public getTreeItem(item: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
            var title = item.label ? item.label.toString() : "";
            var result = new vscode.TreeItem(title, item.collapsibleState);
            result.command = { command: "CodeOriginsPanel.onItemClicked", title: title, arguments: [item] }
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

        private collectDirectoryFiles(dir: string, parentItem?: TreeItem) {
            fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
                const filePath = path.join(dir, dirent.name);
                const item = new TreeItem(dirent.name);

                if (dirent.isDirectory()) {
                    this.collectDirectoryFiles(filePath, item);
                    item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed; 
                } else {
                    item.collapsibleState = vscode.TreeItemCollapsibleState.None; 
                }

                if (parentItem) {
                    parentItem.addChild(item);
                } else {
                    this.Tree.addTreeItem(item);
                }
            });
            this.eventEmitter.fire(undefined); // Refresh the list
        }
    }
}