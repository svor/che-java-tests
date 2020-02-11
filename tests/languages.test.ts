/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as testservice from '@eclipse-che/testing-service';
import * as vscode from '@theia/plugin';
import * as helper from './helper';
import { extensionID } from './helper';
import { strict as assert } from 'assert';
import { ResourceTextEditDto } from '@theia/plugin-ext/lib/common/plugin-api-rpc';

describe('Che-Java sample tests on Quarkus Project', () => {

    const myHelloTextURI = helper.getSrcDocUri('MyHelloText.java');
    const mySampleURI = helper.getSrcDocUri('MySample.java');

    beforeEach(async () => {
        // Ensure all files are closed
        helper.closeAllOpenFiles();
    })

    it('Test Java Completion on sample java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const completion: any = await testservice.languageserver.completion(extensionID,
            mySampleURI, {
                column: 1,
                lineNumber: 13
            }, {
                triggerKind: 0
            }, new vscode.CancellationTokenSource().token);
        assert.notEqual(completion.length, 0, 'The completion request returned 0 results when it should have returned at least 1');
    });

    it('Test Java Document Symbols on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const symbols = await testservice.languageserver.documentSymbols(extensionID, mySampleURI, new vscode.CancellationTokenSource().token);
        assert.notEqual(symbols, undefined);
        if (symbols) {
            assert.equal(symbols.length, 2);
            assert.equal(symbols[0].name, "org.my.sample");
            assert.equal(symbols[1].name, "MySample");
        }
    });

    it('Test Java implementation on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const implementation = await testservice.languageserver.implementation(extensionID, mySampleURI, {
            column: 39,
            lineNumber: 14
        }, new vscode.CancellationTokenSource().token);
        assert.notEqual(implementation, undefined);
        if (implementation && Array.isArray(implementation)) {
            assert.deepEqual(implementation[0].uri, myHelloTextURI);
            assert.deepEqual(implementation[0].range, {
                endColumn: 23,
                endLineNumber: 7,
                startColumn: 12,
                startLineNumber: 7
            });
        } else {
            assert.fail(
                "Expected an array of type definitions"
            )
        }
    });

    it('Test Java type definition on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const typeDefinition = await testservice.languageserver.typeDefinition(extensionID, mySampleURI, {
            column: 35,
            lineNumber: 14
        }, new vscode.CancellationTokenSource().token);
        if (typeDefinition && Array.isArray(typeDefinition)) {
            assert.deepEqual(typeDefinition[0].uri, myHelloTextURI);
            assert.deepEqual(typeDefinition[0].range, {
                endColumn: 25,
                endLineNumber: 3,
                startColumn: 14,
                startLineNumber: 3
            });
        } else {
            assert.fail(
                "Expected an array of type definitions"
            )
        }
    });

    it('Test Java hover on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const hover = await testservice.languageserver.hover(extensionID, mySampleURI, {
            column: 35,
            lineNumber: 14
        }, new vscode.CancellationTokenSource().token);
        if (hover) {
            assert.ok((hover.contents[0] as any).value.includes("org.my.sample.MyHelloText.MyHelloText()"));
            assert.deepEqual(hover.range, {
                endColumn: 35,
                endLineNumber: 14,
                startColumn: 35,
                startLineNumber: 14
            });
        }
    });

    it('Test Java Workspace Symbols on basic java file', async () => {
        const workspaceSymbols = await testservice.languageserver.workspaceSymbols(extensionID, "MySample",
            new vscode.CancellationTokenSource().token);
        assert.notEqual(workspaceSymbols.length, 0, 'The workspace symbols request returned 0 results when it should have returned at least 1');
        assert.equal(workspaceSymbols[0].name, "MySample");
    });

    it('Test Java references on basic java file', async () => {
        await vscode.window.showTextDocument(myHelloTextURI);
        const references = await testservice.languageserver.references(extensionID, myHelloTextURI, {
            column: 16,
            lineNumber: 6
        }, {
                includeDeclaration: true
            },
            new vscode.CancellationTokenSource().token);
        if (references) {
            assert.notEqual(references.length, 0, 'The references request returned 0 results when it should have returned at least 1');
            assert.deepEqual(references[0].uri.path, mySampleURI.path);
            assert.deepEqual(references[0].range, {
                endColumn: 45,
                endLineNumber: 15,
                startColumn: 28,
                startLineNumber: 15
            });
        }
    });

    it('Test Java document links on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const renameEdits = await testservice.languageserver.renameEdits(extensionID, mySampleURI, {
            column: 23,
            lineNumber: 15
        }, "text", new vscode.CancellationTokenSource().token);
        if (renameEdits) {
            assert.equal(renameEdits.edits.length, 1);
            assert.equal((renameEdits.edits as ResourceTextEditDto[])[0].edits[0].text, "text = new MyHelloText();\n        return text");
            assert.equal((renameEdits.edits as ResourceTextEditDto[])[0].resource.path, mySampleURI.path);
        } else {
            assert.fail();
        }
    });

    it('Test Java document formatting on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const formattingEdits = await testservice.languageserver.documentFormattingEdits(extensionID, mySampleURI, {
            insertSpaces: true,
            tabSize: 2
        }, new vscode.CancellationTokenSource().token);
        if (formattingEdits) {
            assert.equal(formattingEdits.length, 6);
            assert.equal(formattingEdits[0].text, "\n\n  ");
            assert.deepEqual(formattingEdits[0].range, {
                endColumn: 5,
                endLineNumber: 11,
                startColumn: 24,
                startLineNumber: 9
            });
            assert.equal(formattingEdits[1].text, "\n  ");
            assert.deepEqual(formattingEdits[1].range, {
                endColumn: 5,
                endLineNumber: 12,
                startColumn: 9,
                startLineNumber: 11
            });
            assert.equal(formattingEdits[2].text, "\n  ");
            assert.deepEqual(formattingEdits[2].range, {
                endColumn: 5,
                endLineNumber: 13,
                startColumn: 36,
                startLineNumber: 12
            });
            assert.equal(formattingEdits[3].text, "\n\n    ");
            assert.deepEqual(formattingEdits[3].range, {
                endColumn: 9,
                endLineNumber: 15,
                startColumn: 28,
                startLineNumber: 13
            });
            assert.equal(formattingEdits[4].text, "\n    ");
            assert.deepEqual(formattingEdits[4].range, {
                endColumn: 9,
                endLineNumber: 16,
                startColumn: 46,
                startLineNumber: 15
            });
            assert.equal(formattingEdits[5].text, "\n  ");
            assert.deepEqual(formattingEdits[5].range, {
                endColumn: 5,
                endLineNumber: 17,
                startColumn: 31,
                startLineNumber: 16
            });
        } else {
            assert.fail();
        }
    });

    it('Test Java range formatting on basic java file', async () => {
        await vscode.window.showTextDocument(mySampleURI);
        const formattingEdits = await testservice.languageserver.documentRangeFormattingEdits(extensionID, mySampleURI, {
            startColumn: 1,
            startLineNumber: 1,
            endColumn: 25,
            endLineNumber: 10
        }, {
                insertSpaces: true,
                tabSize: 2
            }, new vscode.CancellationTokenSource().token);
        if (formattingEdits) {
            assert.equal(formattingEdits.length, 2);
            assert.equal(formattingEdits[0].text, "\n\n  ");
            assert.deepEqual(formattingEdits[0].range, {
                endColumn: 5,
                endLineNumber: 11,
                startColumn: 24,
                startLineNumber: 9
            });
            assert.equal(formattingEdits[1].text, "\n  ");
            assert.deepEqual(formattingEdits[1].range, {
                endColumn: 5,
                endLineNumber: 12,
                startColumn: 9,
                startLineNumber: 11
            });
        } else {
            assert.fail();
        }
    });
    // tslint:enable

});
