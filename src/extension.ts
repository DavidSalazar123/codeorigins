// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { LeftPanelWebview } from "providers/left-webview-provider";
import { FileTree } from './FileTree'

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	let tree = new FileTree.TreeViewer();
	vscode.window.registerTreeDataProvider("CodeOrigin", tree);
	tree.refresh();

	// const leftPanelWebViewProvider = new LeftPanelWebview(context?.extensionUri, {});
	// let view = vscode.window.registerWebviewViewProvider(
	// 	leftPanelWebViewProvider,
	// );
	// context.subscriptions.push(view); 
}

// This method is called when your extension is deactivated
export function deactivate() {}
