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
import { strict as assert } from 'assert';
import { closeAllOpenFiles, getSrcDocUri } from './helper';

describe('Test that vscode-java commands are working successfully', () => {

    const serverLogCmd = 'java.open.serverLog';
    const clientLogCmd = 'java.open.clientLog';
    const openAllLogs = 'java.open.logs';

    before('Make sure vscode-java is activated', async () => {
        const myHelloTextURI = getSrcDocUri('MyHelloText.java');
        await vscode.window.showTextDocument(myHelloTextURI);
        closeAllOpenFiles();
    });

    it('Test Java Open all log files', async () => {

        // Ensure all files are closed
        closeAllOpenFiles();

        // Then check if the serverLog command opens the server log
        await vscode.commands.executeCommand(serverLogCmd);
        const isServerLogFileOpen = vscode.window.visibleTextEditors.filter(editor => editor.document.fileName === '.log');
        assert.ok(isServerLogFileOpen);
    });

    it('Test Java Open all log files', async () => {
        // Ensure all files are closed
        closeAllOpenFiles();

        // Then check if the serverLog command opens the client log
        await vscode.commands.executeCommand(clientLogCmd);
        const isClientLogFileOpen = vscode.window.visibleTextEditors.filter(editor => editor.document.fileName.startsWith('client.log'));
        assert.ok(isClientLogFileOpen);
    });

    it('Test Java Open all log files', async () => {
        // Ensure all files are closed
        closeAllOpenFiles();

        // Then check if the serverLog command opens both the client log and the server log
        await vscode.commands.executeCommand(openAllLogs);
        const isServerLogFileOpen = vscode.window.visibleTextEditors.filter(editor => editor.document.fileName === '.log');
        assert.ok(isServerLogFileOpen);
        const isClientLogFileOpen = vscode.window.visibleTextEditors.filter(editor => editor.document.fileName.startsWith('client.log'));
        assert.ok(isClientLogFileOpen);
    });

});
