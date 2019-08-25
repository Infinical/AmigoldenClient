import { Dictionary } from '../dictionary';

export class ODataMetadata {
    entityTypeMap: Dictionary = new Dictionary();
    constructor(public namespace: string, entityTypes: ODataEntityType[]) {
        this.initialize(entityTypes);
    }

    protected initialize(entityTypes: ODataEntityType[]) {
        entityTypes.forEach(entityType => {
            this.entityTypeMap.add(entityType.name, entityType);
        });
    }

    protected trimNamespace(str) {
        const prefix = this.namespace + '.';
        if (str.startsWith(prefix)) {
            return str.slice(prefix.length);
        } else {
            return str;
        }
    }
}

export class ODataEntityType {
    name: '';
    properties: ODataProperty[] = new Array<ODataProperty>();
    navigationProperties: ODataNavigationProperty[] = new Array<ODataNavigationProperty>();
}

export class ODataNavigationProperty {
    name: string;
    typeName: string;
    isCollection: boolean;
}

export class ODataProperty {
    name: string;
    type: ODataTypes;
    isNullable: boolean;
}

export enum ODataTypes {
    Number,
    String,
    Date,
    Bool,
}


// //Hack Until Ionic supports TS 2.4
// export class ODataTypeMap
// {
//     "Edm.Int32" = ODataTypes.Int;
//     "Edm.Int64" = ODataTypes.Long;
//     "Edm.Decimal" = ODataTypes.Decimal;
//     "Edm.Double" = ODataTypes.Double;
//     "Edm.Guid" = ODataTypes.Guid;
//     "Edm.String" = ODataTypes.String;
//     "Edm.Boolean" = ODataTypes.Bool;
//     "Edm.DateTime" = ODataTypes.DateTime;
//     "Edm.DateTimeOffset" = ODataTypes.DateTimeOffset;
// }

// export enum ODataTypes
// {
//     Int,
//     Long,
//     Decimal,
//     Double,
//     Guid,
//     String,
//     Bool,
//     DateTime,
//     DateTimeOffset
// }
