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

    let targetUrl;
    try {
      targetUrl = new URL(imageUrl);
    } catch (e) {
      return new Response('Invalid URL', { status: 400 });
    }

    // 验证URL是否来自允许的GitHub仓库或其他允许的域名
    const allowedDomains = [
      'raw.githubusercontent.com',
      'github.com',
      'user-images.githubusercontent.com',
      'veloe.onrender.com', // 添加API域名
      'banana-6ot.pages.dev' // 添加当前应用域名
    ];
    
    const allowedRepos = [
      'PicoTrex/Awesome-Nano-Banana-images',
      'songguoxs/gpt4o-image-prompts',
      'jamez-bondos/awesome-gpt4o-images'
    ];

    // 如果是允许的域名，直接允许代理
    if (allowedDomains.includes(targetUrl.hostname)) {
      // 对于这些域名，直接允许，无需进一步检查
    }
    // 如果是data URL，直接返回错误，因为不需要代理
    else if (imageUrl.startsWith('data:')) {
      return new Response('Data URLs do not need proxy', { status: 400 });
    }
    // 如果是其他域名，不允许代理
    else {
      return new Response('Domain not allowed', { status: 403 });
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

    // 返回图片，添加缓存头和其他必要的HTTP头
    return new Response(imageResponse.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 缓存24小时
        'CDN-Cache-Control': 'public, max-age=86400',
        'Cloudflare-CDN-Cache-Control': 'public, max-age=86400',
        'Vary': 'Accept-Encoding',
        // 添加额外的HTTP头以支持图片在新标签页中显示
        'Content-Disposition': 'inline', // 确保图片在浏览器中内联显示，而不是下载
        'Accept-Ranges': 'bytes', // 支持范围请求
        'Content-Length': imageResponse.headers.get('content-length') || '', // 保留原始内容长度
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