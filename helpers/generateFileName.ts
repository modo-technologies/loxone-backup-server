export default function generateFileName(serverName: string) {
  const now = new Date();
  const fileName = now
    .toISOString()
    .replace(/[T:.-]/g, "_")
    .slice(0, -5);
  return `${serverName}_${fileName}`;
}
