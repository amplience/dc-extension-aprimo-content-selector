import { ContentFieldExtension } from "dc-extensions-sdk";
import { HttpMethod } from "dc-extensions-sdk/dist/types/lib/components/HttpClient";
import { AprimoValue } from "../contexts/content-field-extension/ContentFieldExtensionContext";

export interface AssetStoreRequestBody {
  hubId: string;
  mode: string;
  assets: {
    src: string;
    name: string;
    label?: string;
    srcName?: string;
    bucketID?: string;
    folderID?: string;
  }[];
}

export interface AssetStoreResponseBody {
  id: string;
}

export interface Asset {
  srcName: string;
  revisionNumber: number;
  bucketID: string;
  label: string;
  mimeType: string;
  type: string;
  userID: string;
  thumbFile: string;
  folderID: string;
  file: string;
  createdDate: number;
  name: string;
  subType: string | null;
  id: string;
  thumbURL: string;
  publishStatus: string;
  status: string;
  timestamp: number;
}

export const imageMimeTypeToExtension = (
  mimeType: string | null
): string | undefined => {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/bmp":
      return "bmp";
    case "image/gif":
      return "gif";
    case "image/tiff":
      return "tif";
    case "image/webp":
      return "webp";
    case "image/jp2":
      return "jp2";
    case "image/avif":
      return "avif";
    default:
      return undefined;
  }
};

export default class ContentHubService {
  private basepath: string;
  private bucketId: string;
  private folderId?: string;

  constructor(
    private readonly sdk: ContentFieldExtension<AprimoValue>,
    options: {
      basepath?: string;
      bucketId: string;
      folderId?: string;
    }
  ) {
    this.basepath =
      options.basepath || "https://api.amplience.net/v2/content/media/assets";
    this.bucketId = options.bucketId;
    this.folderId = options.folderId;
  }

  async uploadToAssetStore(
    url: string,
    srcName: string
  ): Promise<AssetStoreResponseBody> {
    if (!this.sdk?.hub?.id) {
      throw new Error("User has no HubId");
    }

    const response = await fetch(url, {
      method: "HEAD",
    });

    let fileExtension;
    if (response.status === 200 && response.headers.has("Content-Type")) {
      const contentType = response.headers.get("Content-Type");
      fileExtension = imageMimeTypeToExtension(contentType);
    }

    if (!fileExtension) {
      throw new Error("Unable to determine image Content-Type");
    }

    const payload: AssetStoreRequestBody = {
      hubId: this.sdk.hub.id,
      mode: "overwrite",
      assets: [
        {
          src: url,
          name: srcName,
          srcName: `${srcName}.${fileExtension}`,
          label: `${srcName}.${fileExtension}`,
          bucketID: this.bucketId,
          ...(this.folderId ? { folderID: this.folderId } : {}),
        },
      ],
    };

    const sendAsset = await this.sdk.client.request({
      url: this.basepath,
      method: "PUT" as HttpMethod.PUT,
      data: JSON.stringify(payload),
    });

    if (sendAsset.status !== 200) {
      throw new Error("Error creating new asset");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = sendAsset.data;
    if (!data?.content?.[0]) {
      throw new Error("Unexpected API response");
    }

    return data?.content?.[0];
  }

  async getAssetById(id: string) {
    try {
      const asset: Asset = await this.sdk.assets.getById(id);
      if (!asset) {
        throw new Error("New asset does not exist");
      }
      return asset;
    } catch (e) {
      console.error(`Failure during getAssetById: ${(e as Error).message}`);
      throw e;
    }
  }
}
