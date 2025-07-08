import { Injectable } from '@nestjs/common';
import { FileResponse } from './dto/file-response.dto';
import * as process from 'node:process';
import { format } from 'date-fns';
import { writeFileSync } from 'fs';
import { ensureDir } from 'fs-extra';

@Injectable()
export class FilesService {
  async saveFiles(files: Express.Multer.File[]): Promise<FileResponse[]> {
    const folderPath = `${process.cwd()}/uploads/${format(new Date(), 'yyyy-MM-dd')}`;
    await ensureDir(folderPath);
    await Promise.all(
      files.map((file) => {
        return writeFileSync(`${folderPath}/${file.originalname}`, file.buffer);
      }),
    );
    return files.map((file) => ({
      path: `${folderPath}/${file.originalname}`,
      name: file.originalname,
    }));
  }
}
