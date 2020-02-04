/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as path from 'path';
import * as vscode from '@theia/plugin';

export const extensionID = 'redhat.java';

export function closeAllOpenFiles() {
    vscode.window.visibleTextEditors.map(file => vscode.commands.executeCommand('workbench.action.closeActiveEditor', file.document.uri));
}
export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const getSrcDocPath = (p: string) => path.resolve(__dirname, '../testWorkspace/src/main/java/org/my/sample', p);
export const getSrcDocUri = (p: string) => vscode.Uri.file(getSrcDocPath(p));
