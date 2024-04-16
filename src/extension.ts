import { FileTree } from "./FileTree";
import * as vscode from 'vscode';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	let tree = new FileTree.TreeViewer();
	vscode.window.registerTreeDataProvider("CodeOriginsPanel", tree);
	tree.refresh();
}

// This method is called when your extension is deactivated
export function deactivate() { }
