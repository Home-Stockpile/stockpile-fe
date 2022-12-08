export function nextNodeKey(currentNodeKey: string): string {
  const path = String(currentNodeKey).split("_");
  let firstPartOfKey = path.slice(0, path.length - 1).join("_");
  let lastNumbersOfKey = currentNodeKey;

  if (currentNodeKey.includes("_")) {
    lastNumbersOfKey = currentNodeKey.slice(
      currentNodeKey.lastIndexOf("_") + 1
    );
  }
  if (firstPartOfKey) {
    firstPartOfKey = firstPartOfKey + "_";
  }

  return firstPartOfKey + String(Number(lastNumbersOfKey) + 1);
}
