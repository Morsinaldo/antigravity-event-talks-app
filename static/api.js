/*
 * Copyright (c) 2026 MyCompany LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function exposeTripApi(globalScope) {
    'use strict';

    async function readApiResponse(response) {
        const requestId = response.headers?.get?.('X-Request-ID') || null;
        const rawBody = await response.text();
        try {
            const payload = JSON.parse(rawBody);
            if (!payload.request_id && requestId) payload.request_id = requestId;
            return payload;
        } catch (_error) {
            return {
                success: false,
                request_id: requestId,
                error: {
                    code: 'HTTP_ERROR',
                    message: `O servidor respondeu com HTTP ${response.status}.`,
                },
            };
        }
    }

    const api = { readApiResponse };
    globalScope.TripApi = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
