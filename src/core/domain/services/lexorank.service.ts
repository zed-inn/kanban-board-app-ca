export class LexoRank {
  private static readonly characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  private static readonly base = BigInt(this.characters.length);

  public static get min() {
    return "000000";
  }
  public static get max() {
    return "zzzzzz";
  }

  public static average(a: string, b: string): string {
    let expectedLength = Math.max(a.length, b.length);
    a = a.padEnd(expectedLength, "0");
    b = b.padEnd(expectedLength, "0");

    let x = this.getNumericValue(a);
    let y = this.getNumericValue(b);

    const diff = x > y ? x - y : y - x;

    if (diff <= 1n) {
      a += "0";
      b += "0";
      expectedLength += 1;
      x = this.getNumericValue(a);
      y = this.getNumericValue(b);
    }

    const mid = (x + y) / 2n;

    let newRank = this.createBaseString(mid).padStart(expectedLength, "0");

    const stripped = newRank.replace(/0+$/, "");
    return stripped === "" ? "0" : stripped;
  }

  private static getNumericValue(str: string): bigint {
    let val = 0n;
    for (let i = 0; i < str.length; i++) {
      const charIndex = BigInt(this.characters.indexOf(str[i] as string));
      val = val * this.base + charIndex;
    }
    return val;
  }

  private static createBaseString(n: bigint): string {
    if (n === 0n) return "0";
    let s = "";
    while (n > 0n) {
      const remainder = Number(n % this.base);
      s = this.characters[remainder] + s;
      n = n / this.base;
    }
    return s;
  }
}
