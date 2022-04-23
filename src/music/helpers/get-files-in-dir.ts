import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export const scan = async (directoryName: string, results = []) => {
  const files = await readdir(directoryName);
  for (const f of files) {
    const fullPath = join(directoryName, f);
    const fileStat = await stat(fullPath);
    if (fileStat.isDirectory()) {
      await scan(fullPath, results);
    } else {
      results.push(`/${fullPath}`);
    }
  }
  return results;
};
