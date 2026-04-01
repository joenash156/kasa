# Kasa Caller Mobile API


**Base URL:** `https://<server>/caller/api/`


---


## Table of Contents


1. [Overview](#overview)
2. [Phone Number Format](#phone-number-format)
3. [Authentication](#authentication)
4. [Authentication Flow](#authentication-flow)
5. [Endpoints](#endpoints)
  - [POST /auth/request-otp](#post-authrequest-otp)
  - [POST /auth/verify-otp](#post-authverify-otp)
  - [GET /profile](#get-profile)
  - [PUT /profile](#put-profile)
  - [GET /calls](#get-calls)
  - [POST /dial](#post-dial)
6. [Error Codes](#error-codes)


---


## Overview


The Kasa Caller Mobile API allows mobile applications to authenticate callers registered in the Kasa system, retrieve and update caller profiles, view call history, and trigger outbound callback calls.


Callers are automatically registered in the system the first time they make a call through the Kasa platform. There is no manual signup process.


---


## Phone Number Format


All phone numbers must be supplied in international format without a leading `+`.


| Input format | Normalized form used by API |
|---|---|
| `0551234567` (local Ghana) | `233551234567` |
| `233551234567` (already international) | `233551234567` |


When submitting a phone number, strip the leading `0` and prepend the country code `233`. For example:


```
0551234567  →  233551234567
```


This applies to both authentication endpoints and the dial endpoint.


---


## Authentication


Every request to the API — including unauthenticated endpoints — must include an admin-issued application API key.


| Header | Required on | Value |
|---|---|---|
| `X-API-Key` | All requests | Admin-issued app key |
| `Authorization` | Profile, calls, and dial endpoints | `Bearer <jwt_token>` |


API keys are generated from the Kasa admin portal and are scoped to a specific application. JWT tokens are obtained through the OTP flow described below and expire after **24 hours**.


---


## Authentication Flow


```
1. Obtain an API key from the Kasa admin portal.
2. Include X-API-Key: <key> in every request header.
3. POST /caller/api/auth/request-otp  →  triggers OTP delivery to the caller's phone.
4. In dev mode the OTP is returned directly in the response body.
  In production the OTP is sent via SMS to the caller's registered number.
5. POST /caller/api/auth/verify-otp with the received OTP  →  receive a JWT token and caller_id.
6. Include Authorization: Bearer <token> in all subsequent requests.
7. Tokens expire after 24 hours. Repeat the OTP flow to obtain a new token.
```


---


## Endpoints


---


### POST /auth/request-otp


Request a one-time password for a registered caller. The caller must already exist in the system (created automatically on their first Kasa call). The OTP is valid for **10 minutes**.


**Authentication required:** `X-API-Key` only (no JWT)


#### Request


```
POST /caller/api/auth/request-otp
X-API-Key: <your_api_key>
Content-Type: application/json
```


**Body**


| Field | Type | Required | Description |
|---|---|---|---|
| `phone` | string | Yes | Caller phone number in international format (e.g. `233551234567`) |


```json
{
 "phone": "233551234567"
}
```


#### Responses


**200 OK** — OTP generated successfully


```json
{
 "message": "OTP generated",
 "otp": "123456",
 "dev_mode": true
}
```


> **Note:** `otp` and `dev_mode` are only present when the server is running in development mode. In production, the OTP is delivered via SMS and these fields are omitted from the response.


**400 Bad Request** — Phone number did not match the expected format


```json
{
 "error": "Invalid phone number format"
}
```


**404 Not Found** — No caller account exists for that number


```json
{
 "error": "No account found for that number"
}
```


#### curl Example


```bash
curl -X POST https://<server>/caller/api/auth/request-otp \
 -H "X-API-Key: <your_api_key>" \
 -H "Content-Type: application/json" \
 -d '{"phone": "233551234567"}'
```


---


### POST /auth/verify-otp


Exchange a valid OTP for a JWT token. Use the returned token in the `Authorization` header for all protected endpoints.


**Authentication required:** `X-API-Key` only (no JWT)


#### Request


```
POST /caller/api/auth/verify-otp
X-API-Key: <your_api_key>
Content-Type: application/json
```


**Body**


| Field | Type | Required | Description |
|---|---|---|---|
| `phone` | string | Yes | Caller phone number in international format |
| `otp` | string | Yes | One-time password received via SMS or dev response |


```json
{
 "phone": "233551234567",
 "otp": "123456"
}
```


#### Responses


**200 OK** — OTP verified, token issued


```json
{
 "token": "<jwt_string>",
 "caller_id": 42
}
```


Store the `token` securely. Include it as `Authorization: Bearer <token>` on all subsequent requests. Store `caller_id` for reference — it uniquely identifies the caller in the system.


**401 Unauthorized** — OTP was incorrect or has expired


```json
{
 "error": "Invalid or expired OTP"
}
```


#### curl Example


```bash
curl -X POST https://<server>/caller/api/auth/verify-otp \
 -H "X-API-Key: <your_api_key>" \
 -H "Content-Type: application/json" \
 -d '{"phone": "233551234567", "otp": "123456"}'
```


---


### GET /profile


Retrieve the authenticated caller's profile information including demographic data, preferences, and call statistics.


**Authentication required:** `X-API-Key` + `Authorization: Bearer <jwt_token>`


#### Request


```
GET /caller/api/profile
X-API-Key: <your_api_key>
Authorization: Bearer <jwt_token>
```


#### Responses


**200 OK**


```json
{
 "id": 42,
 "phone_number": "233551234567",
 "country_code": "233",
 "opt_in": true,
 "age_group": "25-34",
 "gender": "male",
 "region": "Greater Accra",
 "language_preference": "English",
 "phone_type": "smart",
 "interests": ["technology", "sports"],
 "call_count": 15,
 "first_call_at": "2024-01-15T10:30:00",
 "last_call_at": "2024-03-20T14:22:00"
}
```


**Response Fields**


| Field | Type | Description |
|---|---|---|
| `id` | integer | Unique caller identifier |
| `phone_number` | string | Normalized international phone number |
| `country_code` | string | Dialing country code |
| `opt_in` | boolean | Whether the caller has opted in to receive ads |
| `age_group` | string or null | Caller's age bracket |
| `gender` | string or null | Caller's gender |
| `region` | string or null | Caller's region or city |
| `language_preference` | string or null | Preferred language for content |
| `phone_type` | string or null | `smart` or `basic` |
| `interests` | array of strings | List of selected interest categories |
| `call_count` | integer | Total number of calls made through Kasa |
| `first_call_at` | ISO 8601 datetime or null | Timestamp of the caller's first Kasa call |
| `last_call_at` | ISO 8601 datetime or null | Timestamp of the caller's most recent Kasa call |


#### curl Example


```bash
curl -X GET https://<server>/caller/api/profile \
 -H "X-API-Key: <your_api_key>" \
 -H "Authorization: Bearer <jwt_token>"
```


---


### PUT /profile


Update the authenticated caller's demographic profile and preferences. All fields are optional; only supplied fields are updated.


**Authentication required:** `X-API-Key` + `Authorization: Bearer <jwt_token>`


#### Request


```
PUT /caller/api/profile
X-API-Key: <your_api_key>
Authorization: Bearer <jwt_token>
Content-Type: application/json
```


**Body** (all fields optional)


```json
{
 "age_group": "25-34",
 "gender": "male",
 "region": "Greater Accra",
 "language_preference": "English",
 "phone_type": "smart",
 "interests": ["technology", "sports"]
}
```


**Accepted Values**


| Field | Accepted values |
|---|---|
| `age_group` | `under-18`, `18-24`, `25-34`, `35-44`, `45-54`, `55-64`, `65+` |
| `gender` | `male`, `female`, `other`, `prefer-not-to-say` |
| `phone_type` | `smart`, `basic` |
| `interests` | `technology`, `business`, `health`, `education`, `entertainment`, `sports`, `food`, `travel`, `finance`, `fashion`, `music`, `news` |


`region` and `language_preference` accept free-form strings.


#### Responses


**200 OK** — Returns the full updated profile (same schema as GET /profile)


```json
{
 "id": 42,
 "phone_number": "233551234567",
 "country_code": "233",
 "opt_in": true,
 "age_group": "25-34",
 "gender": "male",
 "region": "Greater Accra",
 "language_preference": "English",
 "phone_type": "smart",
 "interests": ["technology", "sports"],
 "call_count": 15,
 "first_call_at": "2024-01-15T10:30:00",
 "last_call_at": "2024-03-20T14:22:00"
}
```


#### curl Example


```bash
curl -X PUT https://<server>/caller/api/profile \
 -H "X-API-Key: <your_api_key>" \
 -H "Authorization: Bearer <jwt_token>" \
 -H "Content-Type: application/json" \
 -d '{
   "age_group": "25-34",
   "gender": "male",
   "region": "Greater Accra",
   "language_preference": "English",
   "phone_type": "smart",
   "interests": ["technology", "sports"]
 }'
```


---


### GET /calls


Retrieve the authenticated caller's call history, paginated. Campaign names are intentionally hidden from this response.


**Authentication required:** `X-API-Key` + `Authorization: Bearer <jwt_token>`


#### Request


```
GET /caller/api/calls?page=1&per_page=20
X-API-Key: <your_api_key>
Authorization: Bearer <jwt_token>
```


**Query Parameters**


| Parameter | Type | Default | Max | Description |
|---|---|---|---|---|
| `page` | integer | `1` | — | Page number (1-indexed) |
| `per_page` | integer | `20` | `100` | Number of records per page |


#### Responses


**200 OK**


```json
{
 "calls": [
   {
     "id": 101,
     "timestamp": "2024-03-20T14:22:00",
     "call_type": "Ad",
     "duration_played": 180,
     "call_duration": 5,
     "cost": 0.50,
     "is_survey": false
   }
 ],
 "total": 15,
 "page": 1,
 "pages": 1
}
```


**Response Fields**


| Field | Type | Description |
|---|---|---|
| `calls` | array | List of call records for the requested page |
| `calls[].id` | integer | Unique call record identifier |
| `calls[].timestamp` | ISO 8601 datetime | When the call occurred |
| `calls[].call_type` | string | Type of call (e.g. `Ad`) |
| `calls[].duration_played` | integer | Seconds of audio content played to the caller |
| `calls[].call_duration` | integer | Total call duration in minutes |
| `calls[].cost` | float | Cost of the call to the caller in local currency units |
| `calls[].is_survey` | boolean | Whether the call included a survey |
| `total` | integer | Total number of call records for this caller |
| `page` | integer | Current page number |
| `pages` | integer | Total number of pages |


#### curl Example


```bash
curl -X GET "https://<server>/caller/api/calls?page=1&per_page=20" \
 -H "X-API-Key: <your_api_key>" \
 -H "Authorization: Bearer <jwt_token>"
```


To fetch page 2 with 50 records per page:


```bash
curl -X GET "https://<server>/caller/api/calls?page=2&per_page=50" \
 -H "X-API-Key: <your_api_key>" \
 -H "Authorization: Bearer <jwt_token>"
```


---


### POST /dial


Initiate an outbound callback to the authenticated caller's registered phone number. Once the caller answers, the call is bridged to the specified destination number. The destination must be a valid Ghana number.


**Authentication required:** `X-API-Key` + `Authorization: Bearer <jwt_token>`


#### Request


```
POST /caller/api/dial
X-API-Key: <your_api_key>
Authorization: Bearer <jwt_token>
Content-Type: application/json
```


**Body**


| Field | Type | Required | Description |
|---|---|---|---|
| `destination` | string | Yes | Ghana number to connect to, in `0XXXXXXXXX` or `233XXXXXXXXX` format |


```json
{
 "destination": "233551234567"
}
```


**Accepted destination formats:**


| Format | Example |
|---|---|
| Local (10 digits, leading zero) | `0551234567` |
| International (12 digits) | `233551234567` |


#### Responses


**200 OK — Call successfully initiated**


```json
{
 "success": true,
 "message": "Callback initiated successfully"
}
```


**200 OK — Call could not be initiated (configuration issue)**


```json
{
 "success": false,
 "message": "CRM not configured"
}
```


> **Note:** A `200` response does not guarantee the call will connect. Always check the `success` field in the response body.


**400 Bad Request** — Destination number was not a valid Ghana number


```json
{
 "error": "Invalid destination number"
}
```


#### curl Example


```bash
curl -X POST https://<server>/caller/api/dial \
 -H "X-API-Key: <your_api_key>" \
 -H "Authorization: Bearer <jwt_token>" \
 -H "Content-Type: application/json" \
 -d '{"destination": "233551234567"}'
```


---


## Error Codes


| HTTP Status | Meaning |
|---|---|
| `200` | Request succeeded. For `/dial`, check the `success` field to confirm the action completed. |
| `400` | Bad request — the request body or parameters were invalid or malformed. |
| `401` | Unauthorized — the `X-API-Key` is missing or invalid, or the JWT token is missing, invalid, or expired. |
| `404` | Not found — the requested resource does not exist (e.g. no caller account for the given phone number). |
| `500` | Server error — an unexpected condition occurred on the server. |


---


*Last updated: 2026-03-25*



