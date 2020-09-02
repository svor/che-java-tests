/*********************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as theia from '@theia/plugin';
import * as che from '@eclipse-che/plugin';
import * as helper from './helper';
import { extensionID, reviveRange } from './helper';
import { strict as assert } from 'assert';

describe('Che-Java sample tests on Quarkus Project', () => {
    const myHelloTextURI = helper.getSrcDocUri('MyHelloText.java');
    const mySampleURI = helper.getSrcDocUri('MySample.java');

    beforeEach(async () => {
        // Ensure all files are closed
        helper.closeAllOpenFiles();
    })

    it('Test Java Completion on sample java file', async () => {
        await theia.window.showTextDocument(mySampleURI);
        const completion = await che.languages.test.completion(
            extensionID,
            mySampleURI,
            new theia.Position(13, 1),
            {
                triggerKind: 0
            },
            new theia.CancellationTokenSource().token
        );
        if (!completion) {
            assert.fail("Expected Completion");
        } else {
            assert.notEqual(completion.items.length, 0, 'The completion request returned 0 results when it should have returned at least 1');
        }
    });

    it('Test Java Document Symbols on basic java file', async () => {
        await theia.window.showTextDocument(mySampleURI);
        const symbols = await che.languages.test.documentSymbols(extensionID, mySampleURI, new theia.CancellationTokenSource().token);
        assert.notEqual(symbols, undefined);
        if (symbols) {
            assert.equal(symbols.length, 2);
            assert.equal(symbols[0].name, "org.my.sample");
            assert.equal(symbols[1].name, "MySample");
        }
    });

    it('Test Java implementation on basic java file', async () => {
        await theia.window.showTextDocument(mySampleURI);;
        const pos = new theia.Position(14, 39);
        const implementation = await che.languages.test.implementation(
            extensionID,
            mySampleURI,
            pos,
            new theia.CancellationTokenSource().token
        );
        if (!implementation) {
            assert.fail(
                "Expected implementations"
            )
        }
        if (implementation && Array.isArray(implementation)) {
            if (implementation[0].hasOwnProperty('uri')) {
                const impl: theia.Location = implementation[0] as theia.Location;
                assert.deepEqual(impl.uri, myHelloTextURI);
                assert.deepEqual(
                    reviveRange(impl.range),
                    new theia.Range(
                        new theia.Position(6, 22),
                        new theia.Position(6, 11)
                    )
                );
            }
        } else {
            assert.fail(
                "Expected an array of implementations"
            )
        }
    });

    it('Test Java type definition on basic java file', async () => {
        await theia.window.showTextDocument(mySampleURI);
        const typeDefinition = await che.languages.test.typeDefinition(
            extensionID,
            mySampleURI,
            new theia.Position(14, 35),
            new theia.CancellationTokenSource().token
        );

        if (typeDefinition && Array.isArray(typeDefinition)) {
            if (typeDefinition[0].hasOwnProperty('uri')) {
                const definition: theia.Location = typeDefinition[0] as theia.Location;
                assert.deepEqual(definition.uri, myHelloTextURI);
                assert.deepEqual(
                    reviveRange(definition.range),
                    new theia.Range(
                        new theia.Position(2, 24),
                        new theia.Position(2, 13)
                    )
                );
            }
        } else {
            assert.fail(
                "Expected an array of type definitions"
            )
        }
    });

    it('Test Java hover on basic java file', async () => {
        await theia.window.showTextDocument(mySampleURI);
        const hover = await che.languages.test.hover(extensionID, mySampleURI, new theia.Position(14, 35), new theia.CancellationTokenSource().token);
        if (hover) {
            assert.ok((hover.contents[0] as any).value.includes("org.my.sample.MyHelloText.MyHelloText()"));
            assert.deepEqual(
                reviveRange(hover.range),
                new theia.Range(
                    new theia.Position(14, 31),
                    new theia.Position(14, 42)
                )
            );
        }
    });

    it('Test Java Workspace Symbols on basic java file', async () => {
        const workspaceSymbols = await che.languages.test.workspaceSymbols(extensionID, "MySample",
            new theia.CancellationTokenSource().token);
        assert.notEqual(workspaceSymbols.length, 0, 'The workspace symbols request returned 0 results when it should have returned at least 1');
        assert.equal(workspaceSymbols[0].name, "MySample");
    });

    it('Test Java references on basic java file', async () => {
        await theia.window.showTextDocument(myHelloTextURI);
        const references = await che.languages.test.references(
            extensionID,
            myHelloTextURI,
            new theia.Position(6, 16), {
                includeDeclaration: true
            },
            new theia.CancellationTokenSource().token
        );
        if (references) {
            assert.notEqual(references.length, 0, 'The references request returned 0 results when it should have returned at least 1');
            assert.deepEqual(references[0].uri.path, mySampleURI.path);
            assert.deepEqual(
                reviveRange(references[0].range),
                new theia.Range(
                    new theia.Position(14, 27),
                    new theia.Position(14, 44)
                ));
        }
    });

    it('Test Java document formatting on basic java file', async () => {
        await theia.window.showTextDocument(mySampleURI);
        const formattingEdits = await che.languages.test.documentFormattingEdits(extensionID, mySampleURI, {
            insertSpaces: true,
            tabSize: 2
        }, new theia.CancellationTokenSource().token);
        if (formattingEdits) {
            assert.equal(formattingEdits.length, 6);
            assert.equal(formattingEdits[0].newText, "\n\n  ");
            assert.deepEqual(
                reviveRange(formattingEdits[0].range),
                new theia.Range(
                    new theia.Position(8, 23),
                    new theia.Position(10, 4)
                )
            );
            assert.equal(formattingEdits[1].newText, "\n  ");
            assert.deepEqual(
                reviveRange(formattingEdits[1].range),
                new theia.Range(
                    new theia.Position(10, 8),
                    new theia.Position(11, 4)
                )
            );
            assert.equal(formattingEdits[2].newText, "\n  ");
            assert.deepEqual(
                reviveRange(formattingEdits[2].range),
                new theia.Range(
                    new theia.Position(11, 35),
                    new theia.Position(12, 4)
                )
            );
            assert.equal(formattingEdits[3].newText, "\n\n    ");
            assert.deepEqual(
                reviveRange(formattingEdits[3].range),
                new theia.Range(
                    new theia.Position(12, 27),
                    new theia.Position(14, 8)
                )
            );
            assert.equal(formattingEdits[4].newText, "\n    ");
            assert.deepEqual(
                reviveRange(formattingEdits[4].range),
                new theia.Range(
                    new theia.Position(14, 45),
                    new theia.Position(15, 8)
                )
            );
            assert.equal(formattingEdits[5].newText, "\n  ");
            assert.deepEqual(
                helper.reviveRange(formattingEdits[5].range),
                new theia.Range(
                    new theia.Position(15, 30),
                    new theia.Position(16, 4)
                )
            );
        } else {
            assert.fail();
        }
    });

    it('Test Java range formatting on basic java file', async () => {
        await theia.window.showTextDocument(mySampleURI);
        const formattingEdits = await che.languages.test.documentRangeFormattingEdits(
            extensionID,
            mySampleURI,
            new theia.Range(new theia.Position(1, 1), new theia.Position(10, 25)),
            {
                insertSpaces: true,
                tabSize: 2
            },
            new theia.CancellationTokenSource().token
        );
        if (formattingEdits) {
            assert.equal(formattingEdits.length, 2);
            assert.equal(formattingEdits[0].newText, "\n\n  ");
            assert.deepEqual(
                reviveRange(formattingEdits[0].range),
                new theia.Range(
                    new theia.Position(8, 23),
                    new theia.Position(10, 4)
                ));
            assert.equal(formattingEdits[1].newText, "\n  ");
            assert.deepEqual(
                reviveRange(formattingEdits[1].range),
                new theia.Range(
                    new theia.Position(10, 8),
                    new theia.Position(11, 4)
                ));
        } else {
            assert.fail();
        }
    });

});
