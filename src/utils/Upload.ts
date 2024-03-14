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
export class UpLoadHandle {
  private static chunkSize = 1024 * 1024 * 10; // 10MB

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
}
