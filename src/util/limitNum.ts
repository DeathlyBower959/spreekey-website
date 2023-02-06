export default function limitNumberWithinRange(
  num: number,
  min: number,
  max: number
) {
  return Math.min(Math.max(num, min), max)
}
