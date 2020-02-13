
import { types, castValue, UnitSpec } from "wc3data/dist/index";
import { Modification } from "@voces/wc3maptranslator/lib/translators/object/ObjectsTranslator.js";

// todo: use an actual algorithm
export const deepClone = <T>( obj: T ): T =>
	JSON.parse( JSON.stringify( obj ) );

export const applyModifications = ( unit: UnitSpec, modifications: Modification[] ): void => {

	for ( const modification of modifications ) {

		const type = types[ modification.id ];
		if ( ! type ) {

			console.warn( `Skipping modification ${modification.id}` );
			continue;

		}

		const category = type.category;
		if ( category ) {

			if ( ! unit[ category ] ) unit[ category ] = {};
			unit[ category ][ type.field ] = castValue( modification.value, type.field, type );

		} else unit[ type.field ] = castValue( modification.value, type.field, type );

	}

};

