import * as _ from 'underscore';
import * as X2JS from 'x2js';
import { ODataEntityType, ODataProperty, ODataTypes, ODataMetadata, ODataNavigationProperty } from '../odata-metadata-types';

export class ODataMetadataParser {
    odataTypeMap = {
    'Edm.Int32': ODataTypes.Number,
    'Edm.Int64': ODataTypes.Number,
    'Edm.Decimal': ODataTypes.Number,
    'Edm.Double': ODataTypes.Number,
    'Edm.String': ODataTypes.String,
    'Edm.Boolean': ODataTypes.Bool,
    'Edm.DateTime': ODataTypes.Date,
    'Edm.DateTimeOffset': ODataTypes.Date
    };

    public parseODataMetadata(metadataXML: string): ODataMetadata {
        const x2js = new X2JS();
        const metadata: any = x2js.xml2js(metadataXML);

        const schemas = _.filter(metadata.Edmx.DataServices.Schema, x => x[XmlConsts.varEntityType] != null);
        if (schemas.length === 0) {
            return;
        }

        const schema = schemas[0];

        const namespace = schema[XmlConsts.varNamespace];
        const entityTypes =  this.mapEntityTypes(schema[XmlConsts.varEntityType]);
        const odataMetaData = new ODataMetadata(namespace, entityTypes);

        return odataMetaData;
    }

    protected mapEntityTypes(schema: any): ODataEntityType[] {
        return _.map(schema, t => {
            const oDataEntityType = new ODataEntityType();
            oDataEntityType.name = t[XmlConsts.varName];
            oDataEntityType.properties = this.mapProperties(t[XmlConsts.varProperty]);
            oDataEntityType.navigationProperties = this.mapNavigationProperties(t[XmlConsts.varNavProperty]);
            return oDataEntityType;
        });
    }

    // XML to Js doesn't know certain things should be properties or arrays this assures that they are arrays
    protected normalizeArray(obj: any) {
        if (!(obj instanceof Array)) {
            obj = [obj];
        }
        return obj;
    }

    protected mapProperties(properties: any): ODataProperty[]    {
        return _.map(this.normalizeArray(properties), p => {
            const property = new ODataProperty();
            property.name = p[XmlConsts.varName];
            const typeStr: string = p[XmlConsts.varType];
            property.type = this.odataTypeMap[typeStr];
            property.isNullable = !!p[XmlConsts.varNullable];
            return property;
        });
    }

    protected mapNavigationProperties(navigationProperties: any): ODataNavigationProperty[]  {
        return _.map(this.normalizeArray(navigationProperties), n => {
            const navigationProperty = new ODataNavigationProperty();
            navigationProperty.name = n[XmlConsts.varName];
            const type: string = n[XmlConsts.varType];
            navigationProperty.isCollection = type.startsWith('Collection(');
            if (navigationProperty.isCollection) {
                navigationProperty.typeName = type.match(/\((.*)\)/)[1];
            } else {
                navigationProperty.typeName = type;
            }

            return navigationProperty;
        });
    }
}

class XmlConsts {
    static readonly varNamespace: string = '_Namespace';
    static readonly varName: string = '_Name';
    static readonly varType: string = '_Type';
    static readonly varNullable: string = '_Nullable';
    static readonly varProperty: string = 'Property';
    static readonly varNavProperty: string = 'NavigationProperty';
    static readonly varEntityType: string = 'EntityType';
}
