/*********************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
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
export const getSrcDocPath = (p: string) => path.resolve('/projects/Che-Java-Tests/testWorkspace/src/main/java/org/my/sample', p);
export const getSrcDocUri = (p: string) => theia.Uri.file(getSrcDocPath(p));
