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

export interface AttackVectorResponse {
  /** @example 8 */
  id: number;
  /** @example "Атака посредника (MITM)" */
  title: string;
  /** @example "Перехват трафика" */
  short_description: string | null;
  /** @example "http://localhost:9000/attack-vectors/image_3f9e.png" */
  image_url: string;
  /** @example "http://localhost:9000/attack-vectors/video_f07b.mp4" */
  video_url: string;
  /** @example 7 */
  severity: number | null;
  /** @example 2010 */
  discovered_year: number | null;
  /** @example 3 */
  likes_count: number;
  /** Текущий пользователь поставил лайк */
  is_liked: 0 | 1;
  /** Текущий пользователь — создатель услуги */
  is_mine: 0 | 1;
}

export interface CreateRequest {
  /** @example "Атака посредника (MITM)" */
  title: string;
  /**
   * Файл изображения
   * @format binary
   */
  image: File;
  /**
   * Файл короткого видео
   * @format binary
   */
  video: File;
}

export interface PublishRequest {
  /** @example "Перехват и подмена трафика между двумя сторонами" */
  short_description: string;
  /**
   * Базовая опасность вектора атаки
   * @min 1
   * @max 10
   * @example 7
   */
  severity: number;
  /**
   * Год первой массовой фиксации
   * @example 2010
   */
  discovered_year: number;
}

export interface LikeRequest {
  /** @example 1 */
  like: 0 | 1;
}

export interface RegisterRequest {
  /** @example "new_researcher" */
  username: string;
  /** @example "secret123" */
  password: string;
}

export interface UserResponse {
  /** @example 1 */
  id: number;
  /** @example "security_analyst" */
  username: string;
}

export interface LoginRequest {
  /** @example "security_analyst" */
  username: string;
  /** @example "analyst_pass_1" */
  password: string;
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
      baseURL: axiosConfig.baseURL || "",
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
 * @title Оценка уязвимости системы — API
 * @version 4.0
 * @contact
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  attackVectors = {
    /**
     * @description Доступно гостю.
     *
     * @tags Услуги — attack_vectors
     * @name List
     * @summary 1. Список услуг с фильтрацией (только опубликованные)
     * @request GET:/api/attack_vectors
     */
    list: (
      query?: {
        /**
         * Фильтр: год первой массовой фиксации
         * @example 1999
         */
        discovered_year?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AttackVectorResponse[], void>({
        path: `/api/attack_vectors`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Только для создателя. Создатель проставляется из сессии.
     *
     * @tags Услуги — attack_vectors
     * @name Create
     * @summary 4. Добавление услуги с изображением и видео
     * @request POST:/api/attack_vectors
     * @secure
     */
    create: (data: CreateRequest, params: RequestParams = {}) =>
      this.request<AttackVectorResponse, void>({
        path: `/api/attack_vectors`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Доступно гостю. Из БД читается одна строка.
     *
     * @tags Услуги — attack_vectors
     * @name Feed
     * @summary 2. Лента (только опубликованные)
     * @request GET:/api/attack_vectors/feed
     */
    feed: (
      query?: {
        /**
         * id услуги; без id — первая услуга ленты
         * @example 1
         */
        id?: string;
        /**
         * true — следующая услуга после id
         * @example "true"
         */
        next?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AttackVectorResponse, void>({
        path: `/api/attack_vectors/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Только для создателя.
     *
     * @tags Услуги — attack_vectors
     * @name Draft
     * @summary 3. Черновик текущего пользователя
     * @request GET:/api/attack_vectors/draft
     * @secure
     */
    draft: (params: RequestParams = {}) =>
      this.request<AttackVectorResponse, void>({
        path: `/api/attack_vectors/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Только для создателя.
     *
     * @tags Услуги — attack_vectors
     * @name Publish
     * @summary 5. Публикация черновика
     * @request PUT:/api/attack_vectors/draft/publish
     * @secure
     */
    publish: (data: PublishRequest, params: RequestParams = {}) =>
      this.request<AttackVectorResponse, void>({
        path: `/api/attack_vectors/draft/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Только своей услуги.
     *
     * @tags Услуги — attack_vectors
     * @name Remove
     * @summary 6. Удаление услуги (soft delete)
     * @request DELETE:/api/attack_vectors/{id}
     * @secure
     */
    remove: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/attack_vectors/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Только для авторизованного пользователя.
     *
     * @tags Услуги — attack_vectors
     * @name Like
     * @summary 7. Лайк: 1 ставит, 0 отменяет
     * @request POST:/api/attack_vectors/{id}/like
     * @secure
     */
    like: (id: number, data: LikeRequest, params: RequestParams = {}) =>
      this.request<AttackVectorResponse, void>({
        path: `/api/attack_vectors/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags Пользователь — users
     * @name Register
     * @summary 8. Регистрация
     * @request POST:/api/users/register
     */
    register: (data: RegisterRequest, params: RequestParams = {}) =>
      this.request<UserResponse, void>({
        path: `/api/users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт сессию в Redis и ставит куку sessionId.
     *
     * @tags Пользователь — users
     * @name Login
     * @summary 9. Аутентификация
     * @request POST:/api/users/login
     */
    login: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<UserResponse, void>({
        path: `/api/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет сессию из Redis и куку sessionId.
     *
     * @tags Пользователь — users
     * @name Logout
     * @summary 10. Деавторизация
     * @request POST:/api/users/logout
     * @secure
     */
    logout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
}
