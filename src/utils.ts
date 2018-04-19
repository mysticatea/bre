import { sBuffer } from "./records/record"
import { Record } from "./types"

export function isRecord(x: any): x is Record {
    return (
        typeof x === "object" &&
        Object.prototype.hasOwnProperty.call(x, sBuffer)
    )
}
