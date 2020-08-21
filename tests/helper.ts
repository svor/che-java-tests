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
import * as theia from '@theia/plugin';

export const extensionID = 'redhat.java';

export function closeAllOpenFiles() {
    theia.window.visibleTextEditors.map(file => theia.commands.executeCommand('workbench.action.closeActiveEditor', file.document.uri));
}
export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const getSrcDocPath = (p: string) => path.resolve('/projects/Che-Java-Tests/testWorkspace/src/main/java/org/my/sample', p);
export const getSrcDocUri = (p: string) => theia.Uri.file(getSrcDocPath(p));

// Try to restore Position object from its serialized content
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function revivePosition(position: any): theia.Position {
    if (!position || !position._line || !position._character) {
        throw new Error('Not able to restore position');
    }
    const result: theia.Position = new theia.Position(position._line, position._character);
    return result;
}

// Try to restore Range object from its serialized content
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reviveRange(range: any): theia.Range {
    if (!range || !range._start || !range._end) {
        throw new Error('Not able to restore range');
    }
    const start = revivePosition(range._start);
    const end = revivePosition(range._end);
    const result: theia.Range = new theia.Range(start.line, start.character, end.line, end.character);
    return result;
}

// Try to restore Selection object from its serialized content
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reviveSelection(selection: any): theia.Selection {
    if (!selection || !selection._anchor || !selection._active) {
        throw new Error('Not able to restore selection');
    }
    const anchor = revivePosition(selection._anchor);
    const active = revivePosition(selection._active);
    const result: theia.Selection = new theia.Selection(anchor.line, anchor.character, active.line, active.character);
    return result;
}
