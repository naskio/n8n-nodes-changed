import {IExecuteFunctions} from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWorkflowMetadata,
	INode, IDataObject,
} from 'n8n-workflow';

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
				default: true, // when there is no previous execution, we consider that the value has changed
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

		const nodeKeys = {
			"workflowId": `${workflowMetadata.id}`,
			"nodeName": `${node.name}`, // to enable multiple nodes in the same workflow
			// "workflowActive": workflowMetadata.active, // to get different results when workflow is active or not
		};
		const nodeHash: string = hash(nodeKeys);

		const staticData = this.getWorkflowStaticData('node'); // static data is stored in the workflow automatically when we have triggers
		staticData.hashesIndex = staticData.hashesIndex || {};
		const hashesIndex = staticData.hashesIndex as IDataObject;

		let compareResult: boolean;
		const oldHash = hashesIndex[nodeHash] as string;
		const newHash = hash(items.map(item => item.json));
		if (!oldHash) {
			compareResult = defaultValue;
			hashesIndex[nodeHash] = newHash; // first time, we have no previous hash
		} else {
			compareResult = newHash !== oldHash;
		}

		if (compareResult) {
			hashesIndex[nodeHash] = newHash; // we got a new hash
			return [returnAllData, returnNoData];
		} else {
			return [returnNoData, returnAllData];
		}
	}
}
