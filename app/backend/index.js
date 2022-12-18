const vscode = require('vscode');

const COMMAND = 'extension.index';

module.exports = (context) => {
    context.subscriptions.push(vscode.commands.registerCommand(COMMAND, async () => {
       
    }));
}

/*
require('./index')(context);
*/

