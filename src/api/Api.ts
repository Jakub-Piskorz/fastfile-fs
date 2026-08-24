/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface UserTypeDTO {
  userType?: string;
}

export interface User {
  /** @format int64 */
  id?: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  userType?: string;
  /** @format int64 */
  usedStorage?: number;
}

export interface UserDTO {
  /** @format int64 */
  id?: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
  /** @format int64 */
  usedStorage?: number;
}

export interface UserLoginDTO {
  login?: string;
  password?: string;
}

export interface SearchFileDTO {
  fileName?: string;
  directory?: string;
}

export interface FileDTO {
  metadata: FileMetadata;
  fileLink?: FileLink;
}

export interface FileLink {
  /** @format uuid */
  uuid?: string;
  path?: string;
  isPublic?: boolean;
  fileLinkShares?: FileLinkShare[];
  /** @format int64 */
  ownerId?: number;
}

export interface FileLinkShare {
  /** @format int64 */
  id?: number;
  /** @format uuid */
  fileLinkUuid?: string;
  sharedUserEmail?: string;
}

export interface FileMetadata {
  name?: string;
  /** @format int64 */
  size?: number;
  /** @format int64 */
  lastModified?: number;
  type?: string;
  path?: string;
  hasFiles?: boolean;
}

export interface FilePathDTO {
  path?: string;
}

export interface PrivateFileLinkDTO {
  filePath?: string;
  emails?: string[];
}

export interface FilePathsDTO {
  filePaths?: string[];
}

export type StreamingResponseBody = any;

export interface DeleteFileDTO {
  path?: string;
  recursive?: boolean;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "https://localhost:8080",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title OpenAPI definition
 * @version v0
 * @baseUrl https://localhost:8080
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags auth-controller
     * @name SetUserType
     * @request POST:/auth/user/set-user-type
     */
    setUserType: (data: UserTypeDTO, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/auth/user/set-user-type`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth-controller
     * @name Register
     * @request POST:/auth/register
     */
    register: (data: User, params: RequestParams = {}) =>
      this.request<UserDTO, any>({
        path: `/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth-controller
     * @name Login
     * @request POST:/auth/login
     */
    login: (data: UserLoginDTO, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth-controller
     * @name GetCurrentUser
     * @request GET:/auth/user
     */
    getCurrentUser: (params: RequestParams = {}) =>
      this.request<UserDTO, any>({
        path: `/auth/user`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth-controller
     * @name DeleteMe
     * @request DELETE:/auth/delete-me
     */
    deleteMe: (params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/auth/delete-me`,
        method: "DELETE",
        ...params,
      }),
  };
  api = {
    /**
     * No description
     *
     * @tags file-controller
     * @name UploadFile
     * @request POST:/api/v1/files/upload
     */
    uploadFile: (
      data: {
        /** @format binary */
        file: File;
        filePath: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, any>({
        path: `/api/v1/files/upload`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-controller
     * @name SearchFiles
     * @request POST:/api/v1/files/search
     */
    searchFiles: (data: SearchFileDTO, params: RequestParams = {}) =>
      this.request<FileDTO[], any>({
        path: `/api/v1/files/search`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-share-controller
     * @name ShareFileLink
     * @request POST:/api/v1/files/link/create
     */
    shareFileLink: (data: FilePathDTO, params: RequestParams = {}) =>
      this.request<FileLink, any>({
        path: `/api/v1/files/link/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-share-controller
     * @name SharePrivateFileLink
     * @request POST:/api/v1/files/link/create-private
     */
    sharePrivateFileLink: (
      data: PrivateFileLinkDTO,
      params: RequestParams = {},
    ) =>
      this.request<FileLink, any>({
        path: `/api/v1/files/link/create-private`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-controller
     * @name DownloadMultiple
     * @request POST:/api/v1/files/download-multiple
     */
    downloadMultiple: (data: FilePathsDTO, params: RequestParams = {}) =>
      this.request<StreamingResponseBody, any>({
        path: `/api/v1/files/download-multiple`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-share-controller
     * @name DownloadFileFromLink
     * @request GET:/api/v1/files/link/{uuid}
     */
    downloadFileFromLink: (uuid: string, params: RequestParams = {}) =>
      this.request<StreamingResponseBody, any>({
        path: `/api/v1/files/link/${uuid}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-share-controller
     * @name RemoveFileLink
     * @request DELETE:/api/v1/files/link/{uuid}
     */
    removeFileLink: (uuid: string, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/v1/files/link/${uuid}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-share-controller
     * @name UpdateFileLink
     * @request PATCH:/api/v1/files/link/{uuid}
     */
    updateFileLink: (
      uuid: string,
      data: string[],
      params: RequestParams = {},
    ) =>
      this.request<FileLink, any>({
        path: `/api/v1/files/link/${uuid}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-controller
     * @name FilesInDirectory
     * @request GET:/api/v1/files/list/{path}
     */
    filesInDirectory: (path: string, params: RequestParams = {}) =>
      this.request<FileDTO[], any>({
        path: `/api/v1/files/list/${path}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-share-controller
     * @name LinksSharedToMe
     * @request GET:/api/v1/files/link/shared-to-me
     */
    linksSharedToMe: (params: RequestParams = {}) =>
      this.request<FileDTO[], any>({
        path: `/api/v1/files/link/shared-to-me`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-share-controller
     * @name LookupLinkFile
     * @request GET:/api/v1/files/link/lookup/{uuid}
     */
    lookupLinkFile: (uuid: string, params: RequestParams = {}) =>
      this.request<FileDTO, any>({
        path: `/api/v1/files/link/lookup/${uuid}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-share-controller
     * @name GetMyLinks
     * @request GET:/api/v1/files/link/list
     */
    getMyLinks: (params: RequestParams = {}) =>
      this.request<FileDTO[], any>({
        path: `/api/v1/files/link/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-controller
     * @name DownloadFile
     * @request GET:/api/v1/files/download/{path}
     */
    downloadFile: (path: string, params: RequestParams = {}) =>
      this.request<StreamingResponseBody, any>({
        path: `/api/v1/files/download/${path}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-controller
     * @name CreateDirectory
     * @request GET:/api/v1/files/create-directory/{path}
     */
    createDirectory: (path: string, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/v1/files/create-directory/${path}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-controller
     * @name RemoveFile
     * @request DELETE:/api/v1/files/delete
     */
    removeFile: (data: DeleteFileDTO, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/v1/files/delete`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}
