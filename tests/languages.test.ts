/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as vscode from '@theia/plugin';
import * as helper from './helper';
import { strict as assert } from 'assert';
import { Position, DocumentSymbol, Location, Hover, SymbolInformation, Range, FormattingOptions, TextEdit } from 'vscode';

describe('Che-Java sample tests on Quarkus Project', () => {

    const myHelloTextURI = helper.getSrcDocUri('MyHelloText.java');
    const mySampleURI = helper.getSrcDocUri('MySample.java');

    beforeEach(async () => {
        // Ensure all files are closed
        helper.closeAllOpenFiles();
    })

    // vscode.executeCompletionItemProvider hasn't been implemented yet
    // it('Test Java Completion on sample java file', async () => {
    //     await vscode.window.showTextDocument(mySampleURI);
    //     const completion = await vscode.commands.executeCommand("vscode.executeCompletionItemProvider", mySampleURI, new Position(13, 1)) as CompletionList[];
    //     if (!completion) {
    //         assert.fail("Expected Completion");
    //     } else {
    //         assert.notEqual(completion.length, 0, 'The completion request returned 0 results when it should have returned at least 1');
    //     }
    // });

    it('Test Java Document Symbols on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const symbols = await vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", mySampleURI) as DocumentSymbol[];
        if (!symbols) {
            assert.fail("Expected document symbols");
        } else {
            assert.equal(symbols.length, 2);
            assert.equal(symbols[0].name, "org.my.sample");
            assert.equal(symbols[1].name, "MySample");
        }
    });

    it('Test Java implementation on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const implementation = await vscode.commands.executeCommand("vscode.executeImplementationProvider", mySampleURI, new Position(14, 39)) as Location[];
        if (!implementation) {
            assert.fail(
                "Expected implementations"
            )
        }

        if (implementation && Array.isArray(implementation)) {
            assert.deepEqual(implementation[0].uri, myHelloTextURI);
            assert.deepEqual(implementation[0].range, new vscode.Range(new vscode.Position(7, 12), new vscode.Position(7, 23)));
        } else {
            assert.fail(
                "Expected an array of implementations"
            )
        }
    });

    it('Test Java type definition on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const typeDefinition = await vscode.commands.executeCommand("vscode.executeTypeDefinitionProvider", mySampleURI, new Position(14, 35)) as Location[];
        if (!typeDefinition) {
            assert.fail("Completion");
        }

        if (typeDefinition && Array.isArray(typeDefinition)) {
            assert.deepEqual(typeDefinition[0].uri, myHelloTextURI);
            assert.deepEqual(typeDefinition[0].range, new vscode.Range(new vscode.Position(3, 14), new vscode.Position(3, 25)));
        } else {
            assert.fail(
                "Expected an array of type definitions"
            )
        }
    });

    it('Test Java hover on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const hover = await vscode.commands.executeCommand("vscode.executeHoverProvider", mySampleURI, new Position(14, 35)) as Hover[];
        if (!hover) {
            assert.fail("Completion");
        } else {
            assert.ok((hover[0].contents[0] as any).value.includes("org.my.sample.MyHelloText.MyHelloText()"));
            assert.deepEqual(hover[0].range, new vscode.Range(new vscode.Position(14, 35), new vscode.Position(14, 35)));
        }
    });

    it('Test Java Workspace Symbols on basic java file', async () => {
        const workspaceSymbols = await vscode.commands.executeCommand("vscode.executeWorkspaceSymbolProvider", "MySample") as SymbolInformation[];
        if (!workspaceSymbols) {
            assert.fail("Completion");
        }
        assert.notEqual(workspaceSymbols.length, 0, 'The workspace symbols request returned 0 results when it should have returned at least 1');
        assert.equal(workspaceSymbols[0].name, "MySample");
    });

    it('Test Java references on basic java file', async () => {
        await vscode.window.showTextDocument(myHelloTextURI);
        const references = await vscode.commands.executeCommand("vscode.executeReferenceProvider", myHelloTextURI, new Position(6, 16)) as Location[];
        if (!references) {
            assert.fail("Completion");
        } else {
            assert.notEqual(references.length, 0, 'The references request returned 0 results when it should have returned at least 1');
            assert.deepEqual(references[0].uri.path, mySampleURI.path);
            assert.deepEqual(references[0].range, new vscode.Range(new vscode.Position(15, 28), new vscode.Position(15, 45)));
        }
    });

    it('Test Java document formatting on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const formattingEdits = await vscode.commands.executeCommand("vscode.executeFormatDocumentProvider", mySampleURI, {
            insertSpaces: true,
            tabSize: 2
        } as FormattingOptions) as TextEdit[];
        if (!formattingEdits) {
            assert.fail("Expected formatting edits");
        } else {
            assert.equal(formattingEdits.length, 6);
            assert.equal(formattingEdits[0].newText, "\n\n  ");
            assert.deepEqual(formattingEdits[0].range, new vscode.Range(new vscode.Position(9, 24), new vscode.Position(11, 5)));
            assert.equal(formattingEdits[1].newText, "\n  ");
            assert.deepEqual(formattingEdits[1].range, new vscode.Range(new vscode.Position(11, 9), new vscode.Position(12, 5)));
            assert.equal(formattingEdits[2].newText, "\n  ");
            assert.deepEqual(formattingEdits[2].range, new vscode.Range(new vscode.Position(12, 36), new vscode.Position(13, 5)));
            assert.equal(formattingEdits[3].newText, "\n\n    ");
            assert.deepEqual(formattingEdits[3].range, new vscode.Range(new vscode.Position(13, 28), new vscode.Position(15, 9)));
            assert.equal(formattingEdits[4].newText, "\n    ");
            assert.deepEqual(formattingEdits[4].range, new vscode.Range(new vscode.Position(15, 46), new vscode.Position(16, 9)));
            assert.equal(formattingEdits[5].newText, "\n  ");
            assert.deepEqual(formattingEdits[5].range, new vscode.Range(new vscode.Position(16, 31), new vscode.Position(17, 5)));
        }
    });

    it('Test Java range formatting on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const formattingEdits = await vscode.commands.executeCommand("vscode.executeFormatRangeProvider", mySampleURI, new Range(new Position(1, 1), new Position(10, 25)), {
            insertSpaces: true,
            tabSize: 2
        } as FormattingOptions) as TextEdit[];
        if (!formattingEdits) {
            assert.fail("Expected formatting edits");
        } else {
            assert.equal(formattingEdits.length, 2);
            assert.equal(formattingEdits[0].newText, "\n\n  ");
            assert.deepEqual(formattingEdits[0].range, new vscode.Range(new vscode.Position(9, 24), new vscode.Position(11, 5)));
            assert.equal(formattingEdits[1].newText, "\n  ");
            assert.deepEqual(formattingEdits[1].range, new vscode.Range(new vscode.Position(11, 9), new vscode.Position(12, 5)));
        }
    });

});
