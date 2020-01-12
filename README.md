# Che-Test-Theia-Plugin
These tests are Java tests that communicate with vscode-java running inside of Che.
The tests are running against a sample quarkus application.

The basic idea is that on start the plugin will grab all your tests in your workspace, load them into
mocha and execute the tests by making language calls directly to vscode-java.

#### Developing tests
Developing the tests are quite easy as you are essentially just developing a theia plugins with tests.

To learn more about theia plugins you can visit: https://theia-ide.org/docs/authoring_plugins

An example repo of theia plugins: https://github.com/eclipse/che-theia-samples

You can develop against this repo quite easily by first starting a new che workspace using the devfile defined in the root.

Then run `npm install` in the root of this directory.

Then since the tests are essentially just a theia plugins you can develop and debug the tests using the hosted instance.
`Hosted plugin: Debug instance` or `Hosted plugin: Start instance`

and then open the testWorkspace folder

#### Running these tests automatically when a workspace starts
You may want to run your tests automatically when you are starting your workspace from a devfile for testing.
In order to do this you'll need a few things:
    1. Your test cases implemented as a theia plugin (like this project)
    2. A meta.yaml referencing your theia plugin
    3. A devfile referencing your meta.yaml

The idea is that when you start a workspace with your devfile the testWorkspace will be the root of the application
and the tests will be loaded into mocha and executed against the current running workspace.

