/**
 * Convertit récursivement les BigInt en Number pour pouvoir les
 * sérialiser avec JSON.stringify / NextResponse.json().
 *
 * Prisma retourne parfois des BigInt pour les champs Int (selon
 * la valeur max et le driver), ce qui provoque :
 *   TypeError: Do not know how to serialize a BigInt
 */
export function serializeBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      if (typeof value === "bigint") return Number(value);
      return value;
    })
  );
}
