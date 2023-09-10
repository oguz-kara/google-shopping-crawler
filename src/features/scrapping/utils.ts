import { ElementHandle } from "puppeteer";

export const checkIfArrayOfElementHandles = async (arr: any) => {
  if (!Array.isArray(arr)) {
    return false;
  }

  // Check if every element in the array is an ElementHandle
  const isArrayOfElementHandles = arr.every((item) => item instanceof ElementHandle);

  return isArrayOfElementHandles;
}