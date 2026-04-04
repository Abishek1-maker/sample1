import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  // ─── UPLOAD MULTIPLE ──────────────────────────
  async uploadFiles(userId: number, files: Express.Multer.File[]) {
    // ← loop through each file and save to DB
    const savedImages = await Promise.all(
      files.map((file) =>
        this.prisma.image.create({
          data: {
            image: `uploads/${file.filename}`, // ← save path
            userId, // ← link to user
          },
        }),
      ),
    );

    return {
      message: `${files.length} images uploaded!`, // ← how many uploaded
      images: savedImages,
    };
  }

  // ─── DELETE ONE IMAGE ──────────────────────────
  async deleteFile(imageId: number) {
    // ← find image in DB by imageId
    const image = await this.prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) throw new NotFoundException('Image not found!');

    // ← delete from disk
    if (image.image && fs.existsSync(`./${image.image}`)) {
      fs.unlinkSync(`./${image.image}`);
    }

    // ← delete from DB
    await this.prisma.image.delete({ where: { id: imageId } });

    return { message: 'Image deleted successfully!' };
  }

  // ─── DELETE ALL IMAGES OF USER ─────────────────
  async deleteAllFiles(userId: number) {
    // ← find all images of user
    const images = await this.prisma.image.findMany({
      where: { userId },
    });

    if (!images.length) throw new NotFoundException('No images found!');

    // ← delete each file from disk
    for (const image of images) {
      if (image.image && fs.existsSync(`./${image.image}`)) {
        fs.unlinkSync(`./${image.image}`);
      }
    }

    // ← delete all from DB
    await this.prisma.image.deleteMany({ where: { userId } });

    return { message: 'All images deleted successfully!' };
  }
}
