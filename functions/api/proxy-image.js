// Cloudflare Pages Function: /api/proxy-image
// 用于反代GitHub图片，解决网络访问问题

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 处理CORS预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // 从查询参数获取原始图片URL
    const imageUrl = url.searchParams.get('url');
    
    if (!imageUrl) {
      return new Response('Missing url parameter', { status: 400 });
    }

    // 验证URL是否来自允许的GitHub仓库
    const allowedDomains = [
      'raw.githubusercontent.com'
    ];
    
    const allowedRepos = [
      'PicoTrex/Awesome-Nano-Banana-images',
      'songguoxs/gpt4o-image-prompts'
    ];

    let targetUrl;
    try {
      targetUrl = new URL(imageUrl);
    } catch (e) {
      return new Response('Invalid URL', { status: 400 });
    }

    // 检查域名
    if (!allowedDomains.includes(targetUrl.hostname)) {
      return new Response('Domain not allowed', { status: 403 });
    }

    // 检查仓库路径
    const isAllowedRepo = allowedRepos.some(repo => 
      targetUrl.pathname.startsWith(`/${repo}/`)
    );
    
    if (!isAllowedRepo) {
      return new Response('Repository not allowed', { status: 403 });
    }

    // 获取原始图片
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Nano-Banana-Image-Proxy/1.0',
      },
    });

    if (!imageResponse.ok) {
      return new Response(`Failed to fetch image: ${imageResponse.status}`, { 
        status: imageResponse.status 
      });
    }

    // 获取内容类型
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // 验证是否为图片类型
    if (!contentType.startsWith('image/')) {
      return new Response('Not an image', { status: 400 });
    }

    // 返回图片，添加缓存头
    return new Response(imageResponse.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 缓存24小时
        'CDN-Cache-Control': 'public, max-age=86400',
        'Cloudflare-CDN-Cache-Control': 'public, max-age=86400',
        'Vary': 'Accept-Encoding',
      },
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
