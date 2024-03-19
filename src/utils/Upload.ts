interface chunkFile {
  hash: string;
  chunk: Blob;
  fileHash: string;
}
interface checkpoint {
  success: boolean;
  point: number;
  hash: number;
  lostHash: string[];
}

// const chunkSize = 1024 * 1024; // 1MB
const maxConcurrentUploads = 3; // 最大并发上传数
let totalUploadedBytes = 0; // 总共已上传的字节数
const chunkArray = [];
export class UpLoadHandle {
  private static chunkSize = 1024 * 1024 * 10; // 10MB

  private static totalChunks = [];
  // private static index = 0;
  /**
   * @description: Split File
   * @param {File} File
   * @param [size=this.#chunkSize] default: 10MB
   * @return {chunkFile} Array<chunkFile>
   */
  static async splitFileChunk(
    file: File,
    size = this.chunkSize
  ): Promise<chunkFile[]> {
    // const totalChunks = Math.ceil(file.size / chunkSize);
    const fileChunks: chunkFile[] = [];
    const fileHash = await UpLoadHandle.getFilename(file);
    const { lostHash } = await UpLoadHandle.preUpload(file, fileHash);

    if (file.size < this.chunkSize) {
      return [
        {
          hash: "0",
          chunk: file,
          fileHash,
        },
      ];
    }
    for (let cur = 0, chunkIndex = 0; cur < file.size; cur += size) {
      fileChunks.push({
        hash: (chunkIndex++).toString(),
        chunk: file.slice(cur, cur + size),
        fileHash,
      });
    }
    return fileChunks.filter((item) => !lostHash.includes(item.hash));
  }

  private static preUpload(File: File, filehash: string): Promise<checkpoint> {
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

  /**
   * @description: 对文件摘要生成文件名
   * @param {File} file 文件对象
   * @returns 文件名
   */
  private static async getFilename(file: File): Promise<string> {
    // 获取文件后缀名
    const extension = file.name.split(".").pop();

    // 获取文件摘要
    const filename = await UpLoadHandle.calculateHash(file);

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

  // 更新进度条
  public static updateProgressBar(progress: number) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const progressBar = document.getElementById("progressBar")!;
    progressBar.style.width = `${progress * 100}%`;
    progressBar.textContent = `${(progress * 100).toFixed(2)}%`; // 显示百分比
  }

  // 上传单个切片，并更新总上传进度
  private static async uploadChunk(chunkData): Promise<void> {
    const { chunk, index } = chunkData;
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("chunk", index);
    formData.append("chunks", UpLoadHandle.totalChunks);
    formData.append("name", file.name);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // 假设服务器返回了上传的字节数
      const uploadedBytes = await response.json();
      totalUploadedBytes += uploadedBytes; // 更新总上传字节数
      const progress = totalUploadedBytes / file.size; // 计算进度
      UpLoadHandle.updateProgressBar(progress); // 更新进度条
    } catch (error) {
      console.error(`Error uploading chunk ${index}:`, error);
      // 在这里你可以添加重试逻辑或其他错误处理
    }
  }

  // 上传所有切片，并控制并发数
  private static async uploadChunksWithConcurrency(chunks, maxConcurrent = 5) {
    const uploadPromises = [];
    let currentConcurrent = 0; // 当前并发数

    for (const chunkData of chunks) {
      // 如果当前并发数未达到最大限制，则直接上传切片
      if (currentConcurrent < maxConcurrent) {
        uploadPromises.push(this.uploadChunk(chunkData));
        currentConcurrent++;
      } else {
        // 等待一个 Promise 完成以释放并发槽位
        const completedPromise = await Promise.race(uploadPromises);
        uploadPromises = uploadPromises.filter((p) => p !== completedPromise);
        currentConcurrent--;
        // 使用释放的槽位上传新的切片
        uploadPromises.push(this.uploadChunk(chunkData));
        currentConcurrent++;
      }
    }

    // 等待所有剩余的 Promise 完成
    await Promise.all(uploadPromises);
    UpLoadHandle.updateProgressBar(1); // 所有切片上传完成后，更新进度条为100%
  }
}

interface chunkFile {
  chunk: Blob;
  index: number;
  fileHash: string[];
}
class FileUploader {
  chunkSize: number;
  maxConcurrentUploads: number;
  totalUploadedBytes: number;
  file: File;
  chunks: chunkFile[];
  constructor(
    file: File,
    chunkSize = 1024 * 1024 * 10,
    maxConcurrentUploads = 5
  ) {
    this.chunkSize = chunkSize;
    this.maxConcurrentUploads = maxConcurrentUploads;
    this.totalUploadedBytes = 0;
    this.file = file;
    this.chunks = [];
  }

  // 获取文件并切片
  async prepareFileForUpload() {
    const totalChunks = Math.ceil(this.file.size / this.chunkSize);
    const fileHash = await FileUploader.getFilename(this.file);
    const { lostHash } = await FileUploader.VerifyChunkExists(
      this.file,
      fileHash
    );
    for (let i = 0; i < totalChunks; i++) {
      const start = i * this.chunkSize;
      const end = Math.min(this.file.size, start + this.chunkSize);
      const chunk = this.file.slice(start, end);
      this.chunks.push({ chunk, index: i, fileHash: lostHash });
    }
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
  // 更新进度条
  updateProgressBar(progress: number) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const progressBar = document.getElementById(this.progressBarId)!;
    progressBar.style.width = `${progress * 100}%`;
    progressBar.textContent = `${(progress * 100).toFixed(2)}%`;
  }

  // 上传单个切片
  async uploadChunk(chunkData) {
    const { chunk, index } = chunkData;
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("chunk", index);
    formData.append("chunks", this.chunks.length);
    formData.append("name", this.file.name);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const uploadedBytes = await response.json();
      this.totalUploadedBytes += uploadedBytes;
      const progress = this.totalUploadedBytes / this.file.size;
      this.updateProgressBar(progress);
    } catch (error) {
      console.error(`Error uploading chunk ${index}:`, error);
      // 在这里你可以添加重试逻辑或其他错误处理
    }
  }

  // 上传所有切片，并控制并发数
  async uploadFile() {
    if (!this.file) {
      throw new Error("No file selected for upload");
    }

    let uploadPromises: unknown[] = [];
    let currentConcurrent = 0;

    for (const chunkData of this.chunks) {
      if (currentConcurrent < this.maxConcurrentUploads) {
        uploadPromises.push(this.uploadChunk(chunkData));
        currentConcurrent++;
      } else {
        const completedPromise = await Promise.race(uploadPromises);
        uploadPromises = uploadPromises.filter((p) => p !== completedPromise);
        currentConcurrent--;
        uploadPromises.push(this.uploadChunk(chunkData));
        currentConcurrent++;
      }
    }

    await Promise.all(uploadPromises);
    this.updateProgressBar(1); // 所有切片上传完成后，更新进度条为100%
    console.log("File upload completed");
  }
}

// 使用示例
// const fileUploader = new FileUploader(
//   1024 * 1024,
//   3
// ); // 1MB每块，最大并发3个

// 当用户选择文件后，准备上传
// document.getElementById("fileInput")?.addEventListener("change", async () => {
//   try {
//     fileUploader.prepareFileForUpload();
//     await fileUploader.uploadFile();
//   } catch (error) {
//     console.error("Error during file upload:", error);
//   }
// });
