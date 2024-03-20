interface checkpoint {
  success: boolean;
  point: number;
  hash: number;
  lostHash: string[];
}
/*
 * @description: 文件上传类
 * @paramw {File} file 文件对象
 * @param {number} chunkSize 每个分片的大小，默认为1MB
 * @param {number} maxConcurrentUploads 最大并发上传数，默认为3
 * step1: 调用接口获取该文件的上传信息，返回文件的chunk数
 *        1.1 计算文件摘要，并调用接口获取该文件摘要的上传信息
 *        1.2 将file文件切片处理
 *        1.2 根据checkpoint接口返回的chunk数, 计算过滤输出此次上传需要上传的chunkFile数组
 * step2: 上传文件，
 * step3：调用合并merge接口，通知合并
 */

interface formChunk {
  /** 所需上传的文件名*/
  fileName: string;
  /** 根据文件计算出的文件摘要*/
  fileHash: string;
  /** 切片之后的单个文件*/
  fileChunk: Blob;
  /** 当前上传的文件索引*/
  chunkIndex: number;
  /** 当前上传的文件大小*/
  chunkSize: number;
  /** 整个文件的size*/
  chunkTotalSize: number;
  /** 整个文件切片之后的chunk总数*/
  chunkTotals: number;
}
export class FileUploader {
  private static chunkSize: number;
  private static maxConcurrentUploads: number;
  private static totalUploadedBytes: number;
  private static file: File;
  private static chunks: formChunk[];
  constructor(
    file: File,
    chunkSize = 1024 * 1024 * 10,
    maxConcurrentUploads = 5
  ) {
    FileUploader.chunkSize = chunkSize;
    FileUploader.maxConcurrentUploads = maxConcurrentUploads;
    FileUploader.totalUploadedBytes = 0;
    FileUploader.file = file;
    FileUploader.chunks = [];
  }

  // 获取文件并切片
  async prepareFileForUpload() {
    const filechunks: Array<formChunk> = [];
    const totalChunks = Math.ceil(
      FileUploader.file.size / FileUploader.chunkSize
    );
    const fileHash = await FileUploader.getFilename(FileUploader.file);
    const { lostHash } = await FileUploader.VerifyChunkExists(
      FileUploader.file,
      fileHash
    );
    for (let i = 0, cur = 0; i < totalChunks; i++) {
      cur += FileUploader.chunkSize;
      const start = i * FileUploader.chunkSize;
      const chunk = FileUploader.file.slice(start, cur);
      filechunks.push({
        fileName: FileUploader.file.name,
        fileHash,
        fileChunk: chunk,
        chunkIndex: i,
        chunkSize: chunk.size,
        chunkTotalSize: FileUploader.file.size,
        chunkTotals: totalChunks,
      });
    }
    FileUploader.chunks = filechunks.filter(
      (item) => !lostHash.includes(item.fileHash)
    );
  }

  /**
   * @description: 对文件摘要生成文件名
   * @param {File} file 文件对象
   * @returns 文件名
   */
  private static async getFilename(file: File): Promise<string> {
    // 获取文件后缀名
    const extension = file.name.split(".").pop();

    // 获取文件摘要
    const filename = await FileUploader.calculateHash(file);

    return `${filename}.${extension}`;
  }

  /**
   * @description: 利用SHA-256计算File对象的内容摘要
   * @param {File} file 文件对象
   * @returns 返回十六进制的字符串
   */
  private static async calculateHash(file: File): Promise<string> {
    // 读取文件buffer
    const arrayBuffer = await file.arrayBuffer();

    // 计算摘要buffer
    const digestBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

    // 转换为16进制字符串
    const digestArray = Array.from(new Uint8Array(digestBuffer));
    const digestHex = digestArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return digestHex;
  }
  /**
   * @description: 校验是否上传过文件
   * @argument: file
   * @argument: filehash
   * @returns: checkpoint
   */
  private static VerifyChunkExists(
    File: File,
    filehash: string
  ): Promise<checkpoint> {
    const params = JSON.stringify({
      filename: File.name,
      filehash,
    });
    return new Promise((resolve) => {
      fetch(`http://localhost:3000/checkpoint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: params,
      })
        .then((res) => res.json())
        .then((res: checkpoint) => resolve(res))
        .catch((error) => {
          console.log(error);
        });
    });
  }

  // 上传单个切片
  private static async uploadChunk(chunkData: formChunk) {
    const {
      fileChunk,
      fileName,
      chunkIndex,
      fileHash,
      chunkSize,
      chunkTotalSize,
      chunkTotals,
    } = chunkData;
    const formData = new FormData();
    formData.append("fileChunk", fileChunk);
    formData.append("filename", fileName);
    formData.append("fileHash", fileHash);
    formData.append("chunkIndex", chunkIndex.toString());
    formData.append("chunkSize", chunkSize.toString());
    formData.append("chunkTotalSize", chunkTotalSize.toString());
    formData.append("chunkTotals", chunkTotals.toString());

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // const { chunkSize: uploadedBytes } = await response.json();
      // this.totalUploadedBytes += uploadedBytes;
      // const progress = this.totalUploadedBytes / this.file.size;
      // // this.updateProgressBar(progress);
      // console.log(progress);
    } catch (error) {
      console.error(`Error uploading chunk ${chunkIndex}:`, error);
      // 在这里你可以添加重试逻辑或其他错误处理
    }
  }

  // 上传所有切片，并控制并发数
  async uploadFile() {
    if (!FileUploader.file) {
      throw new Error("No file selected for upload");
    }

    let uploadPromises: unknown[] = [];
    let currentConcurrent = 0;

    for (const chunkData of FileUploader.chunks) {
      if (currentConcurrent < FileUploader.maxConcurrentUploads) {
        uploadPromises.push(FileUploader.uploadChunk(chunkData));
        currentConcurrent++;
      } else {
        const completedPromise = await Promise.race(uploadPromises);
        uploadPromises = uploadPromises.filter((p) => p !== completedPromise);
        currentConcurrent--;
        uploadPromises.push(FileUploader.uploadChunk(chunkData));
        currentConcurrent++;
      }
    }

    await Promise.all(uploadPromises);
    const params = JSON.stringify({
      filename: FileUploader.file.name,
      filehash: FileUploader.chunks[0].fileHash,
    });
    await fetch("http://localhost:3000/merge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: params,
    });
    // this.updateProgressBar(1); // 所有切片上传完成后，更新进度条为100%
  }

  // 更新进度条
  // updateProgressBar(progress: number) {
  //   console.log(1 > progress);
  // }
}
