export function thrownMessage(f: () => any): string | undefined {
    try {
        f()
        return undefined
    } catch (err) {
        return err.message
    }
}
