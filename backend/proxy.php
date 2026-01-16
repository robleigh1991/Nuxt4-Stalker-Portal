<?php
/**
 * Universal IPTV Proxy - Enhanced Version
 * - M3U8 detection + rewrite
 * - MP4 / MKV / TS / WebM streaming
 * - Proper Range handling
 * - Enhanced error handling and logging
 * - Connection keepalive
 * - Retry logic for failed requests
 */

// --------------------
// ENV
// --------------------
while (ob_get_level()) {
    ob_end_clean();
}

ini_set('display_errors', 0);
ini_set('max_execution_time', 0);
ini_set('output_buffering', 0);
error_reporting(E_ALL & ~E_WARNING & ~E_DEPRECATED);

set_time_limit(0);

// --------------------
// INPUT VALIDATION
// --------------------
$targetUrl  = $_GET['url']        ?? '';
$portalUrl  = $_GET['portalurl']  ?? '';
$macAddress = $_GET['macaddress'] ?? '';
$token      = $_GET['token']      ?? '';

if (!$targetUrl) {
    cors();
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'Missing url parameter',
        'message' => 'Please provide a valid stream URL'
    ]);
    exit;
}

$targetUrl = trim($targetUrl);

// Validate URL format
if (!filter_var($targetUrl, FILTER_VALIDATE_URL)) {
    cors();
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'Invalid URL format',
        'url' => $targetUrl
    ]);
    exit;
}

// --------------------
// COMMON HEADERS
// --------------------
$headers = [
    'User-Agent: Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3',
    'Connection: keep-alive',
    'Accept: */*',
];

if ($portalUrl) {
    $headers[] = 'Referer: ' . rtrim($portalUrl, '/') . '/';
    $headers[] = 'Origin: ' . rtrim($portalUrl, '/');
}

if ($macAddress) {
    $headers[] = 'Cookie: mac=' . $macAddress . '; stb_lang=en; timezone=GMT';
}

if ($token) {
    $headers[] = 'Authorization: Bearer ' . $token;
}

// --------------------
// DETECT M3U8
// --------------------
$path  = parse_url($targetUrl, PHP_URL_PATH);
$query = parse_url($targetUrl, PHP_URL_QUERY);

$isM3U8 =
    ($path && preg_match('/\.m3u8$/i', $path)) ||
    ($query && stripos($query, 'm3u8') !== false) ||
    (isset($_GET['force_m3u8']));

// ====================
// M3U8 HANDLER
// ====================
if ($isM3U8) {
    $maxRetries = 3;
    $retryDelay = 1; // seconds
    $content = false;
    $code = 0;
    $final = '';
    
    for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
        $ch = curl_init($targetUrl);

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_ENCODING       => 'gzip, deflate',
            CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
        ]);

        $content = curl_exec($ch);
        $code    = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $final   = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        $error   = curl_error($ch);
        curl_close($ch);

        if ($content !== false && $code >= 200 && $code < 400) {
            break; // Success
        }

        if ($attempt < $maxRetries) {
            sleep($retryDelay);
        }
    }

    if ($content === false || $code >= 400) {
        cors();
        http_response_code($code >= 400 ? $code : 502);
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'Failed to fetch M3U8',
            'http_code' => $code,
            'url' => $targetUrl,
            'message' => 'Unable to load playlist after ' . $maxRetries . ' attempts'
        ]);
        exit;
    }

    $rewritten = rewriteM3U8($content, $final, $portalUrl, $macAddress, $token);

    cors();
    header('Content-Type: application/vnd.apple.mpegurl');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    echo $rewritten;
    exit;
}

// ====================
// VIDEO STREAM HANDLER
// ====================
cors();
header('Accept-Ranges: bytes');

$streamHeaders = $headers;
$rangeHeader = $_SERVER['HTTP_RANGE'] ?? '';

if ($rangeHeader) {
    $streamHeaders[] = 'Range: ' . $rangeHeader;
}

$statusCode = 200;
$headersSet = false;
$bytesWritten = 0;

$ch = curl_init($targetUrl);

curl_setopt_array($ch, [
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS      => 10,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_TIMEOUT        => 0,
    CURLOPT_CONNECTTIMEOUT => 30,
    CURLOPT_HTTPHEADER     => $streamHeaders,
    CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
    CURLOPT_BUFFERSIZE     => 65536, // 64KB chunks
    
    // Capture response headers from upstream
    CURLOPT_HEADERFUNCTION => function($curl, $header) use (&$statusCode, &$headersSet) {
        $len = strlen($header);
        $header = trim($header);
        
        if ($header === '') {
            return $len;
        }
        
        // Capture status code
        if (preg_match('/^HTTP\/\d\.\d\s+(\d+)/', $header, $matches)) {
            $statusCode = (int)$matches[1];
            return $len;
        }
        
        // Forward important headers
        if (strpos($header, ':') !== false) {
            [$key, $value] = explode(':', $header, 2);
            $key = trim($key);
            $value = trim($value);
            $lowerKey = strtolower($key);
            
            // Critical headers for streaming and seeking
            $allowedHeaders = [
                'content-length',
                'content-range',
                'content-type',
                'content-disposition',
                'accept-ranges',
                'cache-control',
                'last-modified',
                'etag',
                'expires'
            ];
            
            if (in_array($lowerKey, $allowedHeaders)) {
                header("$key: $value", false);
            }
        }
        
        return $len;
    },
    
    // Stream body to client
    CURLOPT_WRITEFUNCTION => function($curl, $data) use (&$statusCode, &$headersSet, &$bytesWritten) {
        // Set status code before first chunk
        if (!$headersSet) {
            http_response_code($statusCode);
            $headersSet = true;
        }
        
        echo $data;
        
        // Flush every 64KB
        if ($bytesWritten % 65536 === 0) {
            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();
        }
        
        $bytesWritten += strlen($data);
        
        // Check if client disconnected
        if (connection_aborted()) {
            return 0; // Stop transfer
        }
        
        return strlen($data);
    },
]);

$result = curl_exec($ch);
$curlError = curl_error($ch);
$curlErrno = curl_errno($ch);
curl_close($ch);

// Handle curl errors
if ($result === false && !connection_aborted()) {
    if (!$headersSet) {
        http_response_code(502);
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'Stream failed',
            'message' => $curlError,
            'errno' => $curlErrno,
            'url' => $targetUrl
        ]);
    }
}

exit;

// ====================
// HELPERS
// ====================
function cors()
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');
    header('Access-Control-Allow-Headers: Range, Content-Type, Authorization');
    header('Access-Control-Expose-Headers: Content-Length, Content-Range, Accept-Ranges');
    header('Access-Control-Max-Age: 3600');
    
    // Handle preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function rewriteM3U8($content, $baseUrl, $portalUrl, $mac, $token)
{
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $proxy  = $scheme . '://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME']) . '/proxy.php';

    $u = parse_url($baseUrl);
    $root = $u['scheme'] . '://' . $u['host'] . (isset($u['port']) ? ':' . $u['port'] : '');
    $path = isset($u['path']) ? dirname($u['path']) . '/' : '/';

    $extra = '';
    if ($portalUrl)  $extra .= '&portalurl=' . urlencode($portalUrl);
    if ($mac)        $extra .= '&macaddress=' . urlencode($mac);
    if ($token)      $extra .= '&token=' . urlencode($token);

    $out = [];

    foreach (preg_split('/\r\n|\n|\r/', $content) as $line) {
        $trim = trim($line);

        // Skip empty lines
        if ($trim === '') {
            $out[] = $line;
            continue;
        }

        // Keep comments/metadata
        if ($trim[0] === '#') {
            $out[] = $line;
            continue;
        }

        // Skip if already proxied
        if (strpos($trim, 'proxy.php') !== false) {
            $out[] = $line;
            continue;
        }

        // Build absolute URL
        if (!preg_match('#^https?://#', $trim)) {
            $trim = ($trim[0] === '/') ? $root . $trim : $root . $path . $trim;
        }

        // Rewrite through proxy
        $out[] = $proxy . '?url=' . urlencode($trim) . $extra;
    }

    return implode("\n", $out);
}