import { ODataTypes, ODataProperty } from './odata-metadata-types';
import { ODataDynamicFilterBuilder } from './filter/odata-dynamic-filter-builder';
import { ODataPropertyPath } from './filter/dynamic-types';

export enum ODataArgTypes {
    Number,
    String,
    Date,
    Bool,
    Any
}

export enum ODataBinaryOperators {
    And,
    Or
}

export interface IODataExpression {
    getBuilderExpression(builder: ODataDynamicFilterBuilder);
}

export class ODataExpressionDescriptor implements IODataExpression {
    property: ODataProperty;
    selectedFunction: ODataFunctionDescriptor;
    value: any;
    isNegated = false;
    getBuilderExpression(builder: ODataDynamicFilterBuilder) {
        const path = new ODataPropertyPath(this.property.name);
        // TODO: you should really get by creating a lambda and
        // check if the path exist if it does create a child path from the path property
        return builder[this.selectedFunction.builderFunctionName](path, this.value);
    }
}

export class ODataBinaryExpressionDescriptor implements IODataExpression {
    left: IODataExpression;
    // TODO: Default this to a true expression
    right: IODataExpression;
    operator: ODataBinaryOperators;
    getBuilderExpression(builder: ODataDynamicFilterBuilder) {

        if (null == this.right) {
            return this.left.getBuilderExpression(builder);
        }

        const operatorFunc = this.getBuilderFunction(builder, this.operator);
        return operatorFunc(this.left.getBuilderExpression(builder), this.right.getBuilderExpression(builder));
    }

    getBuilderFunction(builder: ODataDynamicFilterBuilder, operator: ODataBinaryOperators) {
        switch (operator) {
            case ODataBinaryOperators.Or:
                return builder.or;
            case ODataBinaryOperators.And:
                return builder.and;
            default:
                throw new Error('Operator has not been set');
        }
    }
}

export class ODataFunctionVariableDescriptor {
    returnType: ODataTypes;
    inputArguments: ODataArgTypes[];
}

// TODO: add a field that represents the function to call on the builder
export class ODataFunctionDescriptor {
    name: string;
    builderFunctionName: string;
    description?: string;
    variableDescriptor: ODataFunctionVariableDescriptor;
}

// TODO: you should support more function but OData has some bugs with a few things right now
export class ODataFunctions {

    // TODO: support expression which need to chain to another operator
    numberFunctions: ODataFunctionDescriptor[] = [
    //    {name: 'round', variableDescriptor: ODataKnownFunctionTypes.NumFunc},
    //    {name: 'floor', variableDescriptor: ODataKnownFunctionTypes.NumFunc},
    //    {name: 'ceiling', variableDescriptor: ODataKnownFunctionTypes.NumFunc},
    ];

    // TODO: use consts for the builder functionNames
    stringFunctions: ODataFunctionDescriptor[] = [
        {name: 'startsWith', builderFunctionName: 'startswith', variableDescriptor: ODataKnownFunctionTypes.stringBoolFunc},
        {name: 'endsWith', builderFunctionName: 'endswith', variableDescriptor: ODataKnownFunctionTypes.stringBoolFunc},
        {name: 'contains', builderFunctionName: 'contains', variableDescriptor: ODataKnownFunctionTypes.stringBoolFunc},
    ];

    // TODO: support expression which need to chain to another operator
    dateFunctions: ODataFunctionDescriptor[] = [
        // {name: 'day', variableDescriptor: ODataKnownFunctionTypes.DatePartFunc},
        // {name: 'month', variableDescriptor: ODataKnownFunctionTypes.DatePartFunc},
        // {name: 'year', variableDescriptor: ODataKnownFunctionTypes.DatePartFunc},
    ];

    // For now this will only support the Not Operator
    boolFunction: ODataFunctionDescriptor[] = [];

    // TODO: use consts for the builder functionNames
    universalFunctions: ODataFunctionDescriptor[] = [
        {name: '=', description: 'equals', builderFunctionName: 'eq', variableDescriptor: ODataKnownFunctionTypes.universalFunc},
        {name: '!=', description: 'not equals', builderFunctionName: 'ne', variableDescriptor: ODataKnownFunctionTypes.universalFunc},
        {name: '>', description: 'greater than', builderFunctionName: 'gt', variableDescriptor: ODataKnownFunctionTypes.universalFunc},
        {name: '<', description: 'less than', builderFunctionName: 'lt', variableDescriptor: ODataKnownFunctionTypes.universalFunc},
        {name: '>=', description: 'greater than equals',
         builderFunctionName: 'ge', variableDescriptor: ODataKnownFunctionTypes.universalFunc},
        {name: '<=', description: 'less than equals', builderFunctionName: 'le', variableDescriptor: ODataKnownFunctionTypes.universalFunc},
    ];
}

export class ODataKnownFunctionTypes {
    static universalFunc: ODataFunctionVariableDescriptor = {returnType: ODataTypes.Bool,
         inputArguments: [ODataArgTypes.Any, ODataArgTypes.Any] };
    static stringFunc: ODataFunctionVariableDescriptor = { returnType: ODataTypes.String,
        inputArguments: [ODataArgTypes.String] };
    static string2Func: ODataFunctionVariableDescriptor = { returnType: ODataTypes.String,
        inputArguments: [ODataArgTypes.String, ODataArgTypes.String] };
    static string3Func: ODataFunctionVariableDescriptor = { returnType: ODataTypes.String,
        inputArguments: [ODataArgTypes.String, ODataArgTypes.String, ODataArgTypes.String] };
    static stringNumFunc: ODataFunctionVariableDescriptor = { returnType: ODataTypes.Number,
        inputArguments: [ODataArgTypes.String] };
    static string2NumFunc: ODataFunctionVariableDescriptor = { returnType: ODataTypes.Number,
        inputArguments: [ODataArgTypes.String, ODataArgTypes.String] };
    static stringBoolFunc: ODataFunctionVariableDescriptor = {returnType: ODataTypes.Bool,
        inputArguments: [ODataArgTypes.String, ODataArgTypes.String]};
    static DateFunc: ODataFunctionVariableDescriptor = { returnType: ODataTypes.Date,
        inputArguments: [ODataArgTypes.Date]};
    static DatePartFunc: ODataFunctionVariableDescriptor = { returnType: ODataTypes.Number,
        inputArguments: [ODataArgTypes.Date]};
    static NumFunc: ODataFunctionVariableDescriptor = { returnType: ODataTypes.Number,
         inputArguments: [ODataArgTypes.Number]};
}
