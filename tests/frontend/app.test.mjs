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

import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { DEFAULT_MEDIA_URL, escapeHtml, normalizeMediaAsset } = require('../../static/media.js');
const apiModuleUrl = new URL('../../static/api.js', import.meta.url);

test('provides a standalone API response parser', () => {
    assert.equal(fs.existsSync(apiModuleUrl), true);
});

test('reads a JSON API error and preserves its request id', async () => {
    const { readApiResponse } = require('../../static/api.js');
    const response = {
        status: 429,
        headers: { get: () => 'req-12345678' },
        text: async () => JSON.stringify({
            success: false,
            error: { code: 'QUOTA_EXHAUSTED', message: 'Aguarde.' },
        }),
    };

    const payload = await readApiResponse(response);

    assert.equal(payload.error.code, 'QUOTA_EXHAUSTED');
    assert.equal(payload.request_id, 'req-12345678');
});

test('turns a non-JSON HTTP response into a sanitized server error', async () => {
    const { readApiResponse } = require('../../static/api.js');
    const response = {
        status: 500,
        headers: { get: () => 'req-87654321' },
        text: async () => '<html>private failure</html>',
    };

    const payload = await readApiResponse(response);

    assert.equal(payload.error.code, 'HTTP_ERROR');
    assert.match(payload.error.message, /500/);
    assert.equal(payload.request_id, 'req-87654321');
    assert.equal(JSON.stringify(payload).includes('private failure'), false);
});

test('turns an empty HTTP response into a server error', async () => {
    const { readApiResponse } = require('../../static/api.js');
    const response = {
        status: 502,
        headers: { get: () => null },
        text: async () => '',
    };

    const payload = await readApiResponse(response);

    assert.equal(payload.error.code, 'HTTP_ERROR');
    assert.match(payload.error.message, /502/);
    assert.equal(payload.request_id, null);
});

test('normalizes an allowlisted Wikimedia media asset', () => {
    const media = normalizeMediaAsset({
        url: 'https://upload.wikimedia.org/example.jpg',
        source_url: 'https://commons.wikimedia.org/wiki/File:Example.jpg',
        attribution: 'Example / CC BY-SA 4.0',
        alt: '<script>alert(1)</script>',
        query: 'Fortaleza beach',
    });

    assert.equal(media.url, 'https://upload.wikimedia.org/example.jpg');
    assert.equal(media.attribution, 'Example / CC BY-SA 4.0');
    assert.equal(media.alt, '<script>alert(1)</script>');
});

test('rejects remote media outside the allowlist', () => {
    assert.equal(
        normalizeMediaAsset({
            url: 'https://evil.example/image.jpg',
            source_url: 'https://commons.wikimedia.org/wiki/File:Example.jpg',
            attribution: 'Unknown',
            alt: 'Bad',
            query: 'bad',
        }),
        null,
    );
    assert.equal(DEFAULT_MEDIA_URL, '/static/image-placeholder.svg');
});

test('escapes agent-controlled markup before template rendering', () => {
    assert.equal(
        escapeHtml('<img src=x onerror="alert(1)">'),
        '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;',
    );
});

test('frontend no longer guesses image URLs from keywords', () => {
    const source = fs.readFileSync(new URL('../../static/app.js', import.meta.url), 'utf8');

    for (const oldHelper of [
        'getFoodPhotoUrl',
        'getHotelPhotoUrl',
        'getAgendaPhotoUrl',
        'getClothingPhotoUrl',
        'images.unsplash.com',
    ]) {
        assert.equal(source.includes(oldHelper), false, `${oldHelper} must be removed`);
    }
    assert.equal(source.includes('TripMedia.applyMediaAsset'), true);
});

test('frontend uses the API parser before loading the application', () => {
    const appSource = fs.readFileSync(new URL('../../static/app.js', import.meta.url), 'utf8');
    const html = fs.readFileSync(new URL('../../templates/index.html', import.meta.url), 'utf8');

    assert.equal(appSource.includes('TripApi.readApiResponse(response)'), true);
    assert.equal(appSource.includes('await response.json()'), false);
    assert.ok(html.indexOf('/static/api.js') < html.indexOf('/static/app.js'));
});

test('frontend defines the orchestration error renderer it invokes', () => {
    const source = fs.readFileSync(new URL('../../static/app.js', import.meta.url), 'utf8');

    assert.match(source, /function showOrchestrationError\(/);
});
