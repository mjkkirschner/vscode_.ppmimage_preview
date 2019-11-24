// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ppmimagepreview" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.previewppmfile', () => {
		// The code you place here will be executed every time your command is executed


		const startSearchPath = vscode.workspace.rootPath ? vscode.workspace.rootPath : process.cwd();
		const items = walk(startSearchPath).filter(x => x.endsWith(".ppm"));


		vscode.window.showQuickPick(items).then(filePath => {

			const panel = vscode.window.createWebviewPanel(
				'.ppm preview',
				'.ppm preview',
				vscode.ViewColumn.Beside,
				{
					// Enable scripts in the webview
					enableScripts: true
				}
			);

			if (filePath) {

				panel.webview.html = generateHTMLCanvas();
				//load the bytes from disk.
				const imageData = fs.readFileSync(filePath);


				let i = 0;
				while (i < imageData.byteLength && imageData[i++] < 127);
				const header = imageData.toString('utf-8', 0, i - 1);

				let colorData: { red: number, green: number, blue: number }[] = []
				for (let index = 9; index < imageData.byteLength; index = index + 3) {
					colorData.push({ red: imageData[index], green: imageData[index + 1], blue: imageData[index + 2] });
				}

				console.log(header);
				const headerArray = header.split(os.EOL);
				const data = { width: headerArray[1], height: headerArray[2], colorData: colorData }
				panel.webview.postMessage(JSON.stringify(data));
			}

		});
	});

	context.subscriptions.push(disposable);
}

/**
 * recursively searches a directory structure for all files.
 * @param dir 
 */
var walk = function (dir: string): string[] {
	var results: string[] = [];
	var list = fs.readdirSync(dir);
	list.forEach(function (file) {
		file = dir + '/' + file;
		var stat = fs.statSync(file);
		if (stat && stat.isDirectory()) {
			/* Recurse into a subdirectory */
			results = results.concat(walk(file));
		} else {
			/* Is a file */
			results.push(file);
		}
	});
	return results;
}

function generateHTMLCanvas(): string {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Cat Coding</title>

	</head>
	<body>	
		<script>
			var canvas = document.createElement('canvas');
			canvas.width = 640;
			canvas.height = 480;
			document.body.appendChild(canvas);
			var ctx = canvas.getContext('2d');
	
			// Handle the message inside the webview
			window.addEventListener('message', event => {
				
				const message = JSON.parse(event.data); // The JSON data our extension sent
				var width = message.width;
				var height = message.height;
				var colorData = message.colorData;

				for (var x = 0; x < width; x++){
					for (var y = 0; y < height; y++){
						//depending on max value
						var color = colorData[(y * width) + x];
						var r = color.red;
						var g = color.green;
						var b = color.blue;
						ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + 1.0 + ")";
                		ctx.fillRect(x, y, 1, 1);
					}
				}
			
			});
		</script>
	</body>
	</html>`;
}

// this method is called when your extension is deactivated
export function deactivate() { }
