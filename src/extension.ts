import { FileTree } from "./FileTree";
import * as vscode from 'vscode';
import { setupCodeTracker } from './CodeTracker';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	let tree = new FileTree.TreeViewer();
	vscode.window.registerTreeDataProvider("CodeOriginsPanel", tree);
	tree.refresh();

	// Set up the Code Tracker
	setupCodeTracker(context);

	//! We should ask the user if they want the CodeOrigins.log file if we don't find it anywhere within their project
	// Find the Logger file
	const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if (root){
		const loggerPath = findLoggerFile(root);
	} else {
		console.log("Couldn't find the file");
	}

	// Set up the logger and make sure the path is not null
}

function findLoggerFile(root: string) {
	const directories = fs.readdirSync(root, { withFileTypes: true });
	for (let dirent of directories) {
		const filePath = path.join(root, dirent.name);
		if (dirent.isDirectory()) {
			findLoggerFile(filePath);
		} else {
			if (dirent.name === "CodeOrigins.log"){
				return filePath;
			}
		}
	}

	return null;
}

// This method is called when your extension is deactivated
export function deactivate() { }
