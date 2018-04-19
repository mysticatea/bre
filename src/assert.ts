const AIUEO = /^[aiueo]/i
const STARTS_WITH_FUNCTION = /^function /

function assert(condition: boolean, message?: string): void {
    if (!condition) {
        throw new Error(`AssertionError: ${message}`)
    }
}

function articleOf(name: string): string {
    if (name === "null" || name === "undefined") {
        return ""
    }
    if (STARTS_WITH_FUNCTION.test(name)) {
        return ""
    }
    return AIUEO.test(name) ? "an " : "a "
}

function typeNameOf(value: any): string {
    if (value === null) {
        return "null"
    }
    if (Number.isInteger(value)) {
        return "integer"
    }

    const type = typeof value
    if (
        type === "object" &&
        value.constructor &&
        value.constructor.name &&
        value.constructor.name !== "Object"
    ) {
        return `${value.constructor.name} object`
    }
    if (type === "function") {
        if (value.name) {
            return `function ${JSON.stringify(value.name)}`
        }
        return "anonymous function"
    }

    return type
}

function typeOf(value: any): string {
    const type = typeNameOf(value)
    return `${articleOf(type)}${type}`
}

export default Object.assign(assert, {
    boolean(value: any, name: string) {
        assert(
            typeof value === "boolean",
            `'${name}' should be a boolean, but got ${typeOf(value)}.`,
        )
    },

    number(value: any, name: string) {
        assert(
            typeof value === "number",
            `'${name}' should be a number, but got ${typeOf(value)}.`,
        )
    },

    string(value: any, name: string) {
        assert(
            typeof value === "string",
            `'${name}' should be a string, but got ${typeOf(value)}.`,
        )
    },

    object(value: any, name: string) {
        assert(
            typeof value === "object" && value != null,
            `'${name}' should be an object, but got ${typeOf(value)}.`,
        )
    },

    function(value: any, name: string) {
        assert(
            typeof value === "function",
            `'${name}' should be a function, but got ${typeOf(value)}.`,
        )
    },

    numberOrString(value: any, name: string) {
        const type = typeof value
        assert(
            type === "number" || type === "string",
            `'${name}' should be a number or a string, but got ${typeOf(
                value,
            )}.`,
        )
    },

    instanceOf(value: any, type: Function, name: string) {
        assert(
            type === Array ? Array.isArray(value) : value instanceof type,
            `'${name}' should be ${articleOf(type.name)}${
                type.name
            } object, but got ${typeOf(value)}.`,
        )
    },

    integer(value: any, name: string) {
        assert(
            Number.isInteger(value),
            `'${name}' should be an integer, but got ${typeOf(value)}.`,
        )
    },

    gte(value: any, min: number, name: string) {
        assert(
            value >= min,
            `'${name}' should be '>=${min}', but got ${value}.`,
        )
    },

    lte(value: any, max: number, name: string) {
        assert(
            value <= max,
            `'${name}' should be '<=${max}', but got ${value}.`,
        )
    },

    range(value: any, min: number, max: number, name: string) {
        assert(
            value >= min && value <= max,
            `'${name}' should be within '${min}..${max}', but got ${value}.`,
        )
    },

    bitOffsetX8(value: any, accessorTypeName: string) {
        this.integer(value, "bitOffset")
        assert(
            (value & 0x07) === 0,
            `'bitOffset' should be a multiple of 8 for '${accessorTypeName}', but got ${value}.`,
        )
    },

    bitOffsetX32(value: any, accessorTypeName: string) {
        this.integer(value, "bitOffset")
        assert(
            (value & 0x1f) === 0,
            `'bitOffset' should be a multiple of 32 for '${accessorTypeName}', but got ${value}.`,
        )
    },
})
