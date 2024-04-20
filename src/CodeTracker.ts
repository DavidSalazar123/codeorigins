import * as vscode from 'vscode';

export function setupCodeTracker(context: vscode.ExtensionContext) {
    let disposable = vscode.workspace.onDidChangeTextDocument(logChanges);
    context.subscriptions.push(disposable);
}
//! Things to figure out! 1) Are the changes cached somewhere? Also are there keystrokes tracker for the \tab? Copy and paste?

/*
Reason = 1 = Undo
Redo = 0 = Redo

event.contentChanges:
change = '' and rangeLength != 0 =  deleted the line

*/
function logChanges(event: vscode.TextDocumentChangeEvent) {
    console.log(`A document has changed: ${event.document.toString()}`);
    console.log(event.reason);
    event.contentChanges.forEach(change => {
        console.log(`Change starts at line: ${change.range.start.line + 1}, character: ${change.range.start.character + 1}`);
        
        // Calculate the final line after text is pasted based on the new line characters in the text
        const newLines = change.text.split('\n').length - 1;
        const finalLine = change.range.start.line + newLines;
        console.log(`Change ends at line: ${finalLine + 1}, character: ${change.range.end.character + 1}`);


    });
}
