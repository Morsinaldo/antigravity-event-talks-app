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

(function exposeTripMedia(globalScope) {
    'use strict';

    const DEFAULT_MEDIA_URL = '/static/image-placeholder.svg';
    const IMAGE_HOSTS = new Set(['upload.wikimedia.org', 'commons.wikimedia.org', 'places.googleapis.com']);
    const SOURCE_HOSTS = new Set(['commons.wikimedia.org', 'places.googleapis.com']);

    function isAllowedUrl(value, allowedHosts) {
        try {
            const parsed = new URL(value);
            return parsed.protocol === 'https:' && allowedHosts.has(parsed.hostname);
        } catch (_error) {
            return false;
        }
    }

    function normalizeMediaAsset(media) {
        if (!media || typeof media !== 'object') return null;
        if (!isAllowedUrl(media.url, IMAGE_HOSTS)) return null;
        if (!isAllowedUrl(media.source_url, SOURCE_HOSTS)) return null;
        if (![media.attribution, media.alt, media.query].every(value => typeof value === 'string' && value.trim())) {
            return null;
        }
        return {
            url: media.url,
            source_url: media.source_url,
            attribution: media.attribution.trim(),
            alt: media.alt.trim(),
            query: media.query.trim(),
        };
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function applyMediaAsset(imageElement, attributionElement, media, fallbackAlt) {
        const normalized = normalizeMediaAsset(media);
        imageElement.onerror = () => {
            imageElement.onerror = null;
            imageElement.src = DEFAULT_MEDIA_URL;
        };
        imageElement.src = normalized ? normalized.url : DEFAULT_MEDIA_URL;
        imageElement.alt = normalized ? normalized.alt : fallbackAlt;
        if (attributionElement) {
            attributionElement.hidden = !normalized;
            attributionElement.textContent = normalized ? normalized.attribution : '';
            if (normalized) {
                attributionElement.href = normalized.source_url;
                attributionElement.rel = 'noopener noreferrer';
                attributionElement.target = '_blank';
            } else {
                attributionElement.removeAttribute('href');
            }
        }
        return normalized;
    }

    const api = { DEFAULT_MEDIA_URL, applyMediaAsset, escapeHtml, normalizeMediaAsset };
    globalScope.TripMedia = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
