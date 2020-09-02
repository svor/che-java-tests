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
import { strict as assert } from 'assert';
import { closeAllOpenFiles, getSrcDocUri } from './helper';

describe('Test that vscode-java commands are working successfully', () => {

    const serverLogCmd = 'java.open.serverLog';
    const clientLogCmd = 'java.open.clientLog';
    const openAllLogs = 'java.open.logs';

    before('Make sure vscode-java is activated', async () => {
        const myHelloTextURI = getSrcDocUri('MyHelloText.java');
        await theia.window.showTextDocument(myHelloTextURI);
        closeAllOpenFiles();
    });

    it('Test Java Open all log files', async () => {
        // Ensure all files are closed
        closeAllOpenFiles();

        // Then check if the serverLog command opens both the client log and the server log
        await theia.commands.executeCommand(openAllLogs);
        const isServerLogFileOpen = theia.window.visibleTextEditors.filter(editor => editor.document.fileName === '.log');
        assert.ok(isServerLogFileOpen);
        const isClientLogFileOpen = theia.window.visibleTextEditors.filter(editor => editor.document.fileName.startsWith('client.log'));
        assert.ok(isClientLogFileOpen);
    });

    it('Test Java Open server log file', async () => {
        // Ensure all files are closed
        closeAllOpenFiles();

        // Then check if the serverLog command opens the server log
        await theia.commands.executeCommand(serverLogCmd);
        const isServerLogFileOpen = theia.window.visibleTextEditors.filter(editor => editor.document.fileName === '.log');
        assert.ok(isServerLogFileOpen);
    });

    it('Test Java Open client log file', async () => {
        // Ensure all files are closed
        closeAllOpenFiles();

        // Then check if the clientLog command opens the client log
        await theia.commands.executeCommand(clientLogCmd);
        const isClientLogFileOpen = theia.window.visibleTextEditors.filter(editor => editor.document.fileName.startsWith('client.log'));
        assert.ok(isClientLogFileOpen);
    });

});
