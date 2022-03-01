import {IExecuteFunctions, UserSettings} from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWorkflowMetadata,
	INode,
} from 'n8n-workflow';
import * as path from 'path';
import * as fs from 'fs';
import {writeFile as fsWriteFile, readFile as fsReadFile} from 'fs/promises';

const hash = require('object-hash');

export class Changed implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Has Changed',
		name: 'hasChanged',
		icon: 'fa:map-signs',
		group: ['transform'],
		version: 1,
		description: 'Detect if something has changed between the current execution and the previous one.',
		defaults: {
			name: 'hasChanged',
			color: '#1e4873',
		},
		inputs: ['main'],
		outputs: ['main', 'main'],
		outputNames: ['true', 'false'],
		properties: [
			{
				displayName: 'Default has changed',
				name: 'defaultValue',
				type: 'boolean',
				default: false,
				description: 'When there is no previous execution, this value will define if has changed or not.',
				// noDataExpression: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const items: INodeExecutionData[] = this.getInputData();
		let returnAllData: INodeExecutionData[] = items;
		const returnNoData: INodeExecutionData[] = [];

		const defaultValue = this.getNodeParameter('defaultValue', 0) as boolean;
		// const mode: WorkflowExecuteMode = this.getMode();
		const workflowMetadata: IWorkflowMetadata = this.getWorkflow();
		const node: INode = this.getNode();

		const basePath = path.join(UserSettings.getUserN8nFolderPath(), 'hasChangedNodeData');
		if (!fs.existsSync(basePath)) { // create folder if it does not exist
			fs.mkdirSync(basePath, {recursive: true});
		}

		const fileNameKeys = {
			"workflowId": `${workflowMetadata.id}`,
			"nodeName": `${node.name}`, // to enable multiple nodes in the same workflow
			// "workflowActive": workflowMetadata.active, // to get different results when workflow is active or not
		};
		const fileName = `${hash(fileNameKeys)}.sha256.txt`;
		const filePath = path.join(basePath, fileName);

		let compareResult: boolean;
		const newHash = hash(items.map(item => item.json));

		try { // check if the file exists
			const oldHash = await fsReadFile(filePath, 'utf8');
			compareResult = (oldHash !== newHash);
		} catch (error) { // if the file does not exist, create it and use defaultValue
			compareResult = defaultValue;
			await fsWriteFile(filePath, newHash, {encoding: 'utf8', flag: 'w'});
		}

		if (compareResult) {
			await fsWriteFile(filePath, newHash, {encoding: 'utf8', flag: 'w'});
			return [returnAllData, returnNoData];
		} else {
			return [returnNoData, returnAllData];
		}
	}
}
