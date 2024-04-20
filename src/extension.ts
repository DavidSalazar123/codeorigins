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

	// Verify if there is a CodeOrigins.log file
	const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if (root) {
		const filePath = path.join(root, "CodeOrigins.log");
		const loggerPath = findLoggerFile(root);

		if (!loggerPath) {
			fs.open(filePath, 'a', (err, fd) => {
				if (err) {
					console.error('Failed to open the file:', err);
					vscode.window.showErrorMessage(`Failed to create log file: ${err.message}`);
					return;
				}
				fs.close(fd, err => {
					if (err) {
						console.error('Failed to close the file:', err);
						vscode.window.showErrorMessage('Failed to close the log file.');
					} else {
						vscode.window.showInformationMessage('CodeOrigins.log has been created to log code');
					}
				});
			});
		}
	} else {
		vscode.window.showErrorMessage("No workspace folder found.");
	}

}

function findLoggerFile(root: string) {
	const directories = fs.readdirSync(root, { withFileTypes: true });
	for (let dirent of directories) {
		const filePath = path.join(root, dirent.name);
		if (dirent.isDirectory()) {
			findLoggerFile(filePath);
		} else {
			if (dirent.name === "CodeOrigins.log") {
				return filePath;
			}
		}
	}

	return null;
}

// This method is called when your extension is deactivated
export function deactivate() { }
