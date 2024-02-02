import * as fs from 'fs';
import * as path from 'path';

export const deleteCachedImage = async (...fileNames: string[]) => {
  const folderPath = path.resolve('./', './generated/images');

  for (const fileName of fileNames) {
    const filePath = path.resolve(folderPath, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
