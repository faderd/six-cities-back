export const generateRandomValue = (min: number, max: number, numAfterDigit = 0) =>
  +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);

export const getRandomItems = <T>(items: T[], numberOfItems?: number): T[] => {
  const cloneItems = items.slice();
  const outputItems: T[] = [];

  if (!numberOfItems) {
    numberOfItems = generateRandomValue(1, items.length);
  } else if (numberOfItems > items.length) {
    numberOfItems = items.length;
  }

  for (let i = 0; i < numberOfItems; i++) {
    const newItem: unknown = cloneItems.splice(Math.floor(Math.random() * cloneItems.length), 1);
    outputItems.push(newItem as T);
  }

  return outputItems;
};

export const getRandomItem = <T>(items: T[]): T =>
  items[generateRandomValue(0, items.length - 1)];
