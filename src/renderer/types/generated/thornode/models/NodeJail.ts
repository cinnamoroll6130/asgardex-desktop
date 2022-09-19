// tslint:disable
/**
 * Thornode API
 * Thornode REST API.
 *
 * The version of the OpenAPI document: 1.89.0
 * Contact: devs@thorchain.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * @export
 * @interface NodeJail
 */
export interface NodeJail {
    /**
     * @type {string}
     * @memberof NodeJail
     */
    node_address?: string;
    /**
     * @type {number}
     * @memberof NodeJail
     */
    release_height?: number;
    /**
     * @type {string}
     * @memberof NodeJail
     */
    reason?: string;
}