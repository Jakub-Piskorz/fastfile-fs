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

export interface PrivateFileLinkDTO {
  filePath?: string;
  emails?: string[];
}

export interface FilePathsDTO {
  filePaths?: string[];
}

export type StreamingResponseBody = object;

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://jakubpiskorz.dev:8080";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title OpenAPI definition
 * @version v0
 * @baseUrl https://jakubpiskorz.dev:8080
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
    shareFileLink: (data: string, params: RequestParams = {}) =>
      this.request<FileLink, any>({
        path: `/api/v1/files/link/create`,
        method: "POST",
        body: data,
        type: ContentType.Text,
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
     * @request DELETE:/api/v1/files/delete/{path}
     */
    removeFile: (path: string, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/v1/files/delete/${path}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-controller
     * @name DeleteRecursively
     * @request DELETE:/api/v1/files/delete-recursively/{path}
     */
    deleteRecursively: (path: string, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/v1/files/delete-recursively/${path}`,
        method: "DELETE",
        ...params,
      }),
  };
}
