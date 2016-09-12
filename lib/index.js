/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
/**
 * Like C `struct`, `bre` allows accessing binary data as a structure fastly.
 *
 * @module bre
 */
"use strict"

Object.assign(
    exports,
    require("./binary-record"),
    require("./binary-record-builder"),
    require("./text-encoder-registry")
)
