export default function IsJsonString(str: string) {
  if (str == null) return false;
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
