import {
	DeleteObjectCommand,
	DeleteObjectsCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'crypto'

@Injectable()
export class S3Service {
	private s3: S3Client
	private bucket: string
	private region: string

	private extractKeyFromUrl(url: string): string | null {
		try {
			const parts = url.split(`.amazonaws.com/`)
			return parts[1] ?? null
		} catch {
			return null
		}
	}

	constructor(private config: ConfigService) {
		this.bucket = this.config.getOrThrow('AWS_S3_BUCKET_NAME')
		this.region = this.config.getOrThrow('AWS_REGION')
		this.s3 = new S3Client({
			region: this.region,
			credentials: {
				accessKeyId: this.config.getOrThrow('AWS_ACCESS_KEY_ID'),
				secretAccessKey: this.config.getOrThrow('AWS_SECRET_ACCESS_KEY'),
			},
		})
	}

	async uploadFile(file: Express.Multer.File, folder: string = 'uploads') {
		const ext = file.originalname.split('.').pop()
		const key = `${folder}/${randomUUID()}.${ext}`

		await this.s3.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: file.buffer,
				ContentType: file.mimetype,
			}),
		)
		return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`
	}
	async deleteFile(fileUrl: string) {
		const key = this.extractKeyFromUrl(fileUrl)
		if (!key) return

		await this.s3.send(
			new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: key,
			}),
		)
	}

	async deleteFolder(folderPrefix: string) {
		const listCommand = {
			Bucket: this.bucket,
			Prefix: folderPrefix,
		}

		const listResponse = await this.s3.send(
			new ListObjectsV2Command(listCommand),
		)

		if (!listResponse.Contents || listResponse.Contents.length === 0) return

		const deleteCommand = {
			Bucket: this.bucket,
			Delete: {
				Objects: listResponse.Contents.map((obj) => ({ Key: obj.Key! })),
				Quiet: true,
			},
		}

		await this.s3.send(new DeleteObjectsCommand(deleteCommand))
	}
}
