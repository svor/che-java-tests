/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
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

export function start(context: theia.PluginContext): void {
    const mocha = new Mocha({
        ui: 'bdd',
        timeout: 60000,
        reporter: testReporter
    });
    mocha.useColors(true);

    const e = (c: any) => console.log(c);

    theia.workspace.findFiles(`${context.extensionPath}/**/tests/*.test.ts`, undefined).then(files => {
        console.log("Testing extension path: ");
        console.log(context.extensionPath);
    });
    theia.workspace.findFiles('**/tests/*.test.ts', undefined).then(files => {

        console.log("Found: ");
        console.log(files);

        // Add files to the test suite
        files.forEach(f => mocha.addFile(path.resolve(f.path)));

        try {
            // Run the mocha test
            mocha.run((failures: any) => {
                if (failures > 0) {
                    e(new Error(`${failures} tests failed.`));
                }
            });
        } catch (err) {
            e(err);
        }
    });
}

export function stop() {
}
