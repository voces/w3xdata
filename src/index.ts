
import ObjectsTranslator, { Modification } from "@voces/wc3maptranslator/lib/translators/object/ObjectsTranslator.js";
import wc3data, { UnitSpec } from "wc3data/dist/index.js";

// todo: use an actual algorithm
const deepClone = <T>( obj: T ): T =>
	JSON.parse( JSON.stringify( obj ) );

const applyModifications = ( unit: UnitSpec, modifications: Modification[] ): void => {

	for ( const modification of modifications ) {

		const type = wc3data.types[ modification.id ];
		if ( ! type ) {

			console.warn( `Skipping modification ${modification.id}` );
			continue;

		}

		const category = type.category;
		if ( category ) {

			if ( ! unit[ category ] ) unit[ category ] = {};
			unit[ category ][ type.field ] = wc3data.castValue( modification.value, type.field, type );

		} else unit[ type.field ] = wc3data.castValue( modification.value, type.field, type );

	}

};

export const mapUnitSpecs = ( w3u: Buffer ): Record<string, UnitSpec> => {

	try {

		const translator = new ObjectsTranslator.ObjectsTranslator();
		const { errors, json } = translator.warToJson( translator.ObjectType.Units, w3u );
		if ( errors.length ) throw errors;

		const units = deepClone( wc3data.units );

		for ( const [ key, modifications ] of Object.entries( json.custom ) ) {

			const [ type, baseType ] = key.split( ":" );
			units[ type ] = deepClone( units[ baseType ] );
			applyModifications( units[ type ], modifications );

		}

		for ( const [ key, modifications ] of Object.entries( json.original ) )

			applyModifications( units[ key ], modifications );

		return units;

	} catch ( err ) {

		console.error( err );
		return {};

	}

};
