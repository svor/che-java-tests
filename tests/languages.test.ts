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
import { strict as assert } from 'assert';
import { sleep } from './helper';

describe('Che-Java sample tests on Quarkus Project', () => {

    const myHelloTextURI = helper.getSrcDocUri('MyHelloText.java');
    const mySampleURI = helper.getSrcDocUri('MySample.java');
    const extensionID = 'redhat.java';

    beforeEach(async () => {
        await sleep(2000);
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
    // tslint:enable

});
