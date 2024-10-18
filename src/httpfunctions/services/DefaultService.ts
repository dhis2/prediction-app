/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Feature } from '../models/Feature';
import type { FullPredictionResponse } from '../models/FullPredictionResponse';
import type { ModelSpec } from '../models/ModelSpec';
import type { PredictionRequest } from '../models/PredictionRequest';
import type { State } from '../models/State';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Favicon
     * @returns any Successful Response
     * @throws ApiError
     */
    public static faviconfaviconIcoGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'favicon.ico',
        });
    }
    /**
     * Predict
     * Start a prediction task using the given data as training data.
     * Results can be retrieved using the get-results endpoint.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static predictPredictPost(
        requestBody: PredictionRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/predict',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Models
     * List all available models. These are not validated. Should set up test suite to validate them
     * @returns ModelSpec Successful Response
     * @throws ApiError
     */
    public static listModelsListModelsGet(): CancelablePromise<Array<ModelSpec>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/list-models',
        });
    }
    /**
     * List Features
     * List all available features
     * @returns Feature Successful Response
     * @throws ApiError
     */
    public static listFeaturesListFeaturesGet(): CancelablePromise<Array<Feature>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/list-features',
        });
    }
    /**
     * Get Results
     * Retrieve results made by the model
     * @returns FullPredictionResponse Successful Response
     * @throws ApiError
     */
    public static getResultsGetResultsGet(): CancelablePromise<FullPredictionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/get-results',
        });
    }
    /**
     * Cancel
     * Cancel the current training
     * @returns any Successful Response
     * @throws ApiError
     */
    public static cancelCancelPost(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cancel',
        });
    }
    /**
     * Get Status
     * Retrieve the current status of the model
     * @returns State Successful Response
     * @throws ApiError
     */
    public static getStatusStatusGet(): CancelablePromise<State> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/status',
        });
    }
}
