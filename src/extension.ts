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
import * as path from 'path';
process.env.TS_NODE_PROJECT = path.join(__dirname, "../../tsconfig.json");
require('ts-mocha');
import Mocha from 'mocha';
const testReporter = require('./test-reporter');
const ncp = require('ncp').ncp;

export function start(context: theia.PluginContext): void {
    const mocha = new Mocha({
        ui: 'bdd',
        timeout: 60000,
        reporter: testReporter
    });
    mocha.useColors(true);

    const e = (c: any) => console.log(c);
    ncp(context.extensionPath, '/projects/Che-Java-Tests', (err: any) => {
        if (err) {
            return console.error(err);
        }
        activateJavaLSPlugin().then(() => {
            theia.workspace.findFiles('**/tests/*.test.ts', undefined).then(files => {
                console.log("Found: ");
                console.log(files);

                // Add files to the test suite
                files.forEach(f => mocha.addFile(path.resolve(f.path)));

                try {
                    // Run the mocha test
                    mocha.run((failures: any) => {
                        theia.window.showInformationMessage('Tests completed! See results in test.log file');
                        const resultFile = path.resolve('/projects', 'test.log');
                        theia.commands.executeCommand('file-search.openFile', resultFile)
                        if (failures > 0) {
                            e(new Error(`${failures} tests failed.`));
                        }
                    });
                } catch (err) {
                    e(err);
                }
            });
        });
    });
}

async function activateJavaLSPlugin(): Promise<void> {
    const files = await theia.workspace.findFiles('MyHelloText.java', null, 1);
    if (files.length != 1) {
        throw new Error('Cannot find java file');
    }
    const file = files[0];
    const textDocument = await theia.workspace.openTextDocument(file);
    if (!textDocument) {
        throw new Error('Cannot open java file');
    }
    let plugin = theia.plugins.getPlugin('redhat.java');
    if (plugin) {
        return await plugin.activate()
    } else {
        throw new Error('No redhat.java plugin');
    }
}

export function stop() {
}
