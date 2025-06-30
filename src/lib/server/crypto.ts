import { ENCRYPTION_KEY } from "$env/static/private"
import crypto from "node:crypto"

class Cipher {
    algorithm: string
    key: Buffer
    constructor() {
        this.algorithm = "aes-256-gcm"
        this.key = Buffer.from(ENCRYPTION_KEY, "hex")
    }

    encrypt(value: string) {
        const iv: Buffer = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv)

        const encrypted: string = cipher.update(value, "utf8", "hex") + cipher.final("hex")

        return iv.toString("hex") + ":" + encrypted
    }

    decrypt(value: string) {
        const parts: string[] = value.split(":")

        const iv: Buffer = Buffer.from(parts[0], "hex")
        const encryptedData: string = parts[1]

        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv)

        const decrypted: string = decipher.update(encryptedData, "hex", "utf8") + decipher.final("utf8")

        return decrypted
    }
}

export const cipher = new Cipher()