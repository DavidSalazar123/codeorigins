/*
Types of possible combinations
UNDO
REDO
DELETE
TYPED
NOT_TYPED
FORMATTED
*/
interface Logger {
    undo(fileName: string, lineStart: string, lineEnd: string, charOffset: number, characterChanges: string): void;
    redo(fileName: string, lineStart: string, lineEnd: string, charOffset: number, characterChanges: string): void;
    delete(fileName: string, lineStart: string, lineEnd: string, charOffset: number, characterChanges: string): void;
    typed(fileName: string, lineStart: string, lineEnd: string, charOffset: number, characterChanges: string): void;
    notTyped(fileName: string, lineStart: string, lineEnd: string, charOffset: number, characterChanges: string): void;
    formatted(fileName: string, lineStart: string, lineEnd: string, charOffset: number, characterChanges: string): void;
    log(fileName: string, lineStart: string, lineEnd: string, charOffset: number, characterChanges: string): void;
    compression(): void;
}

enum LogLevel {
    UNDO = "UNDO",
    REDO = "REDO",
    DELETE = "DELETE",
    TYPED = "TYPED",
    NOT_TYPED = "NOT_TYPED",
    FORMATTED = "FORMATTED"
}

class CodeOriginsLogger implements Logger {
    private readonly filePath;

    constructor(filePath: string) {
        this.filePath = filePath;
    }
    // Determine the kind of log
    log(fileName: string, lineStart: string, lineEnd: string, charOffset: number, characterChanges: string): void {

    }

    compression(): void {

    }
}