const promptExamples = {
  "text_to_image": [
    {
      "title": "文章信息图",
      "author": "@黄建同学",
      "prompt": "为文章内容生成信息图\n要求：\n1. 将内容翻译成英文，并提炼文章的关键信息\n2. 图中内容保持精简，只保留大标题\n3. 图中文字采用英文\n4. 加上丰富可爱的卡通人物和元素",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case14/output.jpg",
      "type": "text_to_image"
    },
    {
      "title": "模型标注讲解图",
      "author": "@berryxia_ai",
      "prompt": "绘制[3D人体器官模型展示示例心脏]用于学术展示，进行标注讲解，适用于展示其原理和[每个器官]的功能，非常逼真，高度还原，精细度非常细致的设计\n\n> [!NOTE]\n> **将 [方括号] 中的文字改为需要展示的模型**",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case16/output.jpg",
      "type": "text_to_image"
    },
    {
      "title": "俏皮现代的应用程序图标设计",
      "author": "@songguoxs",
      "prompt": "A playful and modern app icon design of a cute coffee cup character with a winking eye and smiling mouth, red-orange flame-like hair on top, minimal flat vector style, glossy highlights, soft shadows, centered composition, high contrast, vibrant colors, rounded corners, on a transparent background, icon-friendly, no text, no details outside the frame, size is 1024x1024.\n\n中文提示词：\n一个俏皮现代的应用程序图标设计：一个可爱的咖啡杯形象，带着眨眼的眼睛和微笑的嘴巴，顶部有橙红色火焰状的“头发”，采用极简扁平矢量风格，带有光泽高光和柔和阴影，构图居中，对比度高，色彩鲜艳，边角圆润，背景透明，适合作为图标使用，无文字，边框外无细节，尺寸为1024x1024。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/279.png",
      "type": "text_to_image"
    },
    {
      "title": "极简风格插画",
      "author": "@miilesus",
      "prompt": "Create a minimalistic illustration of [object or scene] in a paper cut-out style. Use soft, pastel colors and simple shapes. Include layered paper textures and subtle shadows to create depth. Place the object on a plain background. Ensure a clean, modern, and aesthetically pleasing composition with a slightly isometric perspective.\n\n中文提示词：\n创作一幅[物体或场景]的极简风格插画，采用剪纸艺术风格。使用柔和的 pastel（粉蜡笔色调的）色彩和简单的形状。融入分层的纸张纹理和细微的阴影以营造深度感。将物体置于纯色背景上。确保构图简洁、现代且富有美感，并采用略带等距的透视角度。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/277.png",
      "type": "text_to_image"
    },
    {
      "title": "马赛克彩色玻璃徽章",
      "author": "@miilesus",
      "prompt": "create image:\n{\n  \"style\": \"mosaic stained glass emblem\",\n  \"object\": \"brand logo\",\n  \"brand\": {\n    \"name\": \"Spotify\",\n    \"logo_shape\": \"circular\",\n    \"icon_style\": \"three curved bars\",\n    \"color_palette\": {\n      \"primary\": \"#1DB954\",\n      \"secondary\": \"#1ED760\",\n      \"glass_variants\": [\"#147A3E\", \"#0F5C30\", \"#26C178\"]\n    }\n  },\n  \"material\": {\n    \"type\": \"colored glass\",\n    \"effect\": \"semi-transparent with light reflections\",\n    \"outline\": {\n      \"color\": \"#111111\",\n      \"width\": \"medium\",\n      \"style\": \"lead-line traditional mosaic\"\n    }\n  },\n  \"composition\": {\n    \"layout\": \"logo composed of tessellated glass pieces\",\n    \"geometry\": \"irregular but fitted glass shapes\",\n    \"contrast\": \"dark outlines define shape clearly\"\n  },\n  \"lighting\": {\n    \"type\": \"diffused natural light\",\n    \"highlight\": \"glass texture and color depth emphasized\"\n  },\n  \"background\": {\n    \"type\": \"flat surface\",\n    \"color\": \"#F4F4F4\"\n  },\n  \"camera\": {\n    \"angle\": \"top-down\",\n    \"focus\": \"centered on entire logo\"\n  },\n  \"render\": {\n    \"quality\": \"high\",\n    \"shadows\": \"soft\",\n    \"reflections\": \"minimal\"\n  }\n}\n\n中文提示词：\n创建图像：\n{\n  \"风格\": \"马赛克彩色玻璃徽章\",\n  \"对象\": \"品牌标志\",\n  \"品牌\": {\n    \"名称\": \"Spotify\",\n    \"标志形状\": \"圆形\",\n    \"图标风格\": \"三条弯曲的长条\",\n    \"色彩搭配\": {\n      \"主色\": \"#1DB954\",\n      \"辅助色\": \"#1ED760\",\n      \"玻璃变体色\": [\"#147A3E\", \"#0F5C30\", \"#26C178\"]\n    }\n  },\n  \"材质\": {\n    \"类型\": \"彩色玻璃\",\n    \"效果\": \"半透明带光线反射\",\n    \"轮廓\": {\n      \"颜色\": \"#111111\",\n      \"宽度\": \"中等\",\n      \"风格\": \"传统马赛克铅线\"\n    }\n  },\n  \"构图\": {\n    \"布局\": \"由镶嵌玻璃片组成的标志\",\n    \"几何形状\": \"不规则但拼接契合的玻璃造型\",\n    \"对比度\": \"深色轮廓清晰界定形状\"\n  },\n  \"光线\": {\n    \"类型\": \"漫射自然光\",\n    \"高光\": \"突出玻璃质感和色彩深度\"\n  },\n  \"背景\": {\n    \"类型\": \"平面\",\n    \"颜色\": \"#F4F4F4\"\n  },\n  \"镜头\": {\n    \"角度\": \"俯视\",\n    \"焦点\": \"居中于整个标志\"\n  },\n  \"渲染\": {\n    \"质量\": \"高\",\n    \"阴影\": \"柔和\",\n    \"反射\": \"轻微\"\n  }\n}",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/276.png",
      "type": "text_to_image"
    },
    {
      "title": "品牌着陆页-年轻女性运动后的面部特写",
      "author": "@michalmalewicz",
      "prompt": "Create a closeup face of a young woman after a workout, sweaty, deep blue eyes, with a bit of blurred gym background on the left side of the photo, 5:3 proportions, she's looking right at the camera, some freckles and messy hair, beautiful, editorial\n\n中文提示词：\n创作一张年轻女性运动后的面部特写：她满头大汗，有着深蓝色的眼睛，照片左侧是略微模糊的健身房背景，比例为5:3。她正直视镜头，脸上有一些雀斑，头发有些凌乱，整体呈现出美丽的 editorial（时尚编辑风格）效果。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/275.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "创作漫画风格插画",
      "author": "@miilesus",
      "prompt": "create comic style illustration:\n{\n\"style\": \"comic book illustration\",\n\"line_art\": {\n\"type\": \"bold black outlines\",\n\"thickness\": \"medium\",\n\"detail\": \"emphasized contours and shading lines\"\n},\n\"coloring\": {\n\"palette\": \"vibrant and saturated colors\",\n\"shading\": \"halftone dots and cel shading\",\n\"highlighting\": \"strong contrast with pop art effects\"\n},\n\"texture\": {\n\"surface\": \"flat with visible ink strokes\",\n\"effect\": \"printed comic paper texture\"\n},\n\"composition\": {\n\"layout\": \"centered subject\",\n\"background\": \"simple with radial burst or comic-style lines\",\n\"framing\": \"comic panel border\"\n},\n\"lighting\": {\n\"type\": \"dramatic\",\n\"angle\": \"top-left with bold highlights and shadows\"\n},\n\"post_processing\": {\n\"effect\": [\"halftone dots\", \"ink outline\", \"grain\"],\n\"saturation\": \"high\",\n\"contrast\": \"high\"\n},\n\"mood\": \"dynamic and action-oriented\",\n\"format\": \"vertical or square depending on original image\"\n}\n\n中文提示词：\n创作漫画风格插画：\n{\n\"风格\": \"漫画书插画\",\n\"线稿\": {\n\"类型\": \"粗黑轮廓线\",\n\"粗细\": \"中等\",\n\"细节\": \"突出的轮廓和阴影线条\"\n},\n\"上色\": {\n\"调色板\": \"鲜艳饱和的色彩\",\n\"阴影\": \"半色调网点和赛璐珞 shading\",\n\"高光\": \"强烈对比，带有波普艺术效果\"\n},\n\"质感\": {\n\"表面\": \"平坦，带有可见的笔触\",\n\"效果\": \"印刷漫画纸质感\"\n},\n\"构图\": {\n\"布局\": \"主体居中\",\n\"背景\": \"简洁，带有放射状爆发图案或漫画风格线条\",\n\"边框\": \"漫画分镜边框\"\n},\n\"光线\": {\n\"类型\": \"戏剧性\",\n\"角度\": \"左上角，带有强烈的高光和阴影\"\n},\n\"后期处理\": {\n\"效果\": [\"半色调网点\", \"墨水轮廓\", \"颗粒感\"],\n\"饱和度\": \"高\",\n\"对比度\": \"高\"\n},\n\"氛围\": \"充满动感和动作感\",\n\"格式\": \"根据原图，为竖版或正方形\"\n}",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/274.png",
      "type": "text_to_image"
    },
    {
      "title": "超现实主义极简概念广告",
      "author": "@aziz4ai",
      "prompt": "“{BRAND or PRODUCT NAME}” — surreal minimal conceptual advertisement\nCreate a 1:1 high-resolution poster that reimagines the brand/product as a surreal object of desire using minimal elements and symbolic storytelling.\n\n• Visual Style: ultra-clean background (light or muted tone), soft lighting, strong negative space\n• Scene Concept: transform the essence of the product into a metaphorical or dreamlike scene\n• Add a short, punchy slogan (2–3 words) that emotionally resonates with the concept\n• Include the brand’s logo in a clean, modern style (integrated naturally into the layout)\n• Composition: centered or rule-of-thirds alignment, use shadows and depth tastefully\n• Mood: artistic, elegant, and thought-provoking — like a museum installation\n• No clutter, no realism overload — just conceptual clarity\n\n中文提示词：\n“{品牌或产品名称}”——超现实主义极简概念广告\n创建 1：1 高分辨率海报，使用最少的元素和象征性的故事讲述将品牌/产品重新想象为超现实的欲望对象。\n\n• 视觉风格：超干净的背景（浅色或柔和的色调）、柔和的灯光、强烈的负空间\n• 场景概念：将产品本质转化为隐喻或梦幻般的场景\n• 添加一个简短、有力的口号（2-3 个词），在情感上与概念产生共鸣\n• 以简洁、现代的风格包含品牌标识（自然融入布局）\n• 构图：居中或三分法对齐，巧妙运用阴影和深度\n• 氛围：艺术、优雅、发人深省——就像博物馆装置\n• 没有混乱，没有现实主义超载——只有概念清晰",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/273.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "铅笔素描画",
      "author": "@CharaspowerAI",
      "prompt": "A pencil drawing of [Your character], with detailed lines and shading on white paper, capturing the energy and strength in his muscular body [with element effects] around  the character, in a dynamic pose,   tattoo design on paper, manga art style, dark background, high contrast, strong shadows, light and shadow effects, black ink drawing,  dynamic pose\n\n中文提示词：\n一幅[你的角色]的铅笔素描画，在白纸上用细致的线条和阴影描绘，捕捉其肌肉发达的身体中蕴含的活力与力量，角色周围带有[元素效果]，呈现出充满动感的姿势，纸上有纹身图案，采用漫画艺术风格，背景偏暗，对比度高，阴影强烈，有光影效果，为黑色墨水画，姿势富有动感。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/272.png",
      "type": "text_to_image"
    },
    {
      "title": "乐高超级英雄摆出充满动感的动作姿势",
      "author": "@TechieBySA",
      "prompt": "Epic LEGO [SUPERHERO] in dynamic action pose showcasing their signature powers, wearing their iconic costume with authentic colors and details, dramatic stormy sky with brilliant lightning bolts illuminating the scene, heroic stance amid swirling LEGO debris and flying bricks, small LEGO minifigures scattered throughout the scene watching in awe, cinematic movie poster composition with photorealistic rendering, epic superhero atmosphere with rich saturated colors, professional depth of field and dramatic lighting effects, 1080x1080 square format\n\n中文提示词：\n史诗级乐高【超级英雄】摆出充满动感的动作姿势，展现其标志性超能力，身着标志性服装，色彩和细节真实还原。戏剧性的暴风雨天空中，耀眼的闪电照亮整个场景。超级英雄摆出英勇姿态，周围是旋转的乐高碎片和飞舞的积木块，场景中散落着小型乐高小人仔，它们正惊叹地注视着这一切。整体采用电影海报式构图，配以逼真渲染效果，营造出史诗般的超级英雄氛围，色彩浓郁饱和，运用专业的景深和富有戏剧性的光影效果，尺寸为1080x1080的正方形格式。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/270.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "透明X光扫描面板后面",
      "author": "@TheRelianceAI",
      "prompt": "Two anime-style characters standing behind a futuristic transparent X-ray scanning panel, each leaning on it casually. Their full bodies are visible through the glowing glass as stylized, semi-transparent X-ray scans. [INSERT SCAN DETAILS HERE — e.g. hybrid anatomy, supernatural markings, implants, etc.]. Futuristic sci-fi interface overlays on the glass, with holographic HUD elements and glowing digital text. The background is minimal and sterile, resembling a high-tech medical chamber. The characters are [INSERT CHARACTER NAMES & DESCRIPTION HERE — appearance, expression, outfit], drawn in modern high-quality anime style. The scene uses soft colored lighting (e.g. cyan, pink, red depending on the pair), expressive animation, and cinematic composition.\n\n中文提示词：\n两个动漫风格的角色站在一个未来感的透明X光扫描面板后面，各自随意地靠在面板上。透过发光的玻璃，可以看到他们的全身呈现出风格化的半透明X光扫描效果。【在此插入扫描细节——例如混合解剖结构、超自然标记、植入物等】。玻璃上叠加着未来科幻界面，还有全息平视显示元素和发光的数字文本。背景简洁而无菌，类似一个高科技医疗舱。角色是【在此插入角色姓名和描述——外貌、表情、服装】，采用现代高品质动漫风格绘制。场景使用柔和的彩色灯光（例如根据角色组合使用青色、粉色、红色等），富有表现力的动态效果和电影化的构图。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/269.png",
      "type": "text_to_image"
    },
    {
      "title": "童趣插画",
      "author": "@gnrlyxyz",
      "prompt": "Create a full body, flat vector illustration of [CHARACTER] in a whimsical, wavy cartoon style. Use thin black outlines and smooth, rounded shapes. The character should have a tiny white-colored head with tiny dot eyes and a simple nose and mouth. The body should have exaggerated, playful proportions. Use bold, flat colors for the clothing. No gradients. No shading. No smudging. Place the character on a solid blue background. Vector friendly. Square aspect ratio.\n\n中文提示词：\n创作一幅[角色]的全身扁平矢量插画，采用异想天开的波浪卡通风格。使用纤细的黑色轮廓和流畅的圆形造型。角色应有一个小小的白色头部，上面有极小的圆点眼睛以及简单的鼻子和嘴巴。身体比例要夸张且富有童趣。服装采用鲜明的扁平色彩。不使用渐变、阴影和晕染效果。将角色置于纯蓝色背景上。适合矢量格式。采用正方形比例。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/268.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "一个复古茶包",
      "author": "@TheRelianceAI",
      "prompt": "A single vintage tea bag lying on a clean white background, hand-painted with an intricate illustration resembling a book cover. The tea bag has delicate aged paper texture, soft warm lighting, and realistic details. On the painted design, leave a clear blank space labeled [BOOK] for the book title. Cinematic, high-resolution, vertical format 9:16.\n\n中文提示词：\n一个复古茶包孤零零地放在干净的白色背景上，上面手绘着类似书籍封面的复杂图案。这个茶包有着细腻的陈旧纸张质感，搭配柔和温暖的光线，细节逼真。在手绘图案上，留出一块清晰的空白区域，并标注为【BOOK】，用于填写书名。整体呈现电影般的质感，高分辨率，采用9:16的竖版格式。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/267.png",
      "type": "text_to_image"
    },
    {
      "title": "树上挂着产品",
      "author": "@TheRelianceAI",
      "prompt": "A hyper-realistic photograph of a tree in a scenic meadow, with a sturdy, detailed bark trunk and lush green leaves, where instead of fruits, the branches naturally bear [PRODUCT], seamlessly integrated into the foliage, with realistic textures, natural lighting, soft shadows, subtle imperfections, shot at eye level with a shallow depth of field, ultra-detailed, 8k\n\n中文提示词：\n一张超写实的照片，画面中是一片风景优美的草地上的一棵树。树干坚固，树皮纹理清晰，树叶郁郁葱葱、绿意盎然。树枝上长的不是果实，而是自然悬挂着[产品]，它们与树叶无缝融合，纹理逼真。照片采用自然光线，搭配柔和的阴影，带有细微的瑕疵，以平视角度拍摄，景深较浅，细节极致丰富，分辨率为8k。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/266.png",
      "type": "text_to_image"
    },
    {
      "title": "品牌杂志",
      "author": "@TheRelianceAI",
      "prompt": "A hyper-realistic editorial concept for a collaboration between [BRAND] and [MAGAZINE BRAND]. Square 1:1 composition, shot in a sleek Parisian interior with marble floors and tall windows, golden afternoon light illuminating the scene. A single model in a couture gown poses gracefully beside a realistically sized [BRAND] perfume bottle with the [BRAND] logo clearly visible placed on a marble pedestal. Ultra-refined textures, cinematic realism, Vogue-style photography.\n\n中文提示词：\n一个超写实的编辑概念，用于[品牌]与[杂志品牌]的合作。1:1的正方形构图，在时尚的巴黎室内拍摄，室内设有大理石地板和高大的窗户，金色的午后阳光照亮整个场景。一位身着高级定制礼服的模特优雅地摆着姿势，身旁是一个尺寸逼真的[品牌]香水瓶，瓶身上清晰可见[品牌]的标志，香水瓶放置在大理石基座上。超精细的纹理，电影般的写实感，《 Vogue》风格的摄影。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/265.png",
      "type": "text_to_image"
    },
    {
      "title": "纸制玩具版本",
      "author": "@TechieBySA",
      "prompt": "Ultra-detailed render of a [CHARACTER NAME] paper toy version in box form (papertoy) made from matte folded cardboard and cut with visible paper texture, clean edges and neat folds. Cubic head and body, square extremities, simplified facial features, flat printed colors and subtle shading for greater depth. The clothing and accessories faithfully imitate the appearance of the reference image in a minimalist geometric papercraft style, maintaining compact proportions and chibi style. Neutral studio lighting, soft shadows, smooth background, photorealistic product photography, 4K, no text or logos. 1080x1080 dimension.\n\n中文提示词：\n超细节渲染的[角色名称]纸制玩具版本，呈盒子形状（纸制玩具），由哑光折叠纸板制成，带有可见的纸张纹理，边缘干净，折叠整齐。头部和身体为立方体，四肢为方形，面部特征简化，采用平面印刷色彩和微妙阴影以增强深度。服装和配饰以极简几何纸艺风格忠实地模仿参考图的外观，保持紧凑比例和Q版风格。中性工作室灯光，柔和阴影，平滑背景，逼真的产品摄影效果，4K分辨率，无文字或标志。尺寸为1080x1080。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/264.png",
      "type": "text_to_image"
    },
    {
      "title": "城市糖果传奇的风格",
      "author": "@miilesus",
      "prompt": "A colorful, playful 2D map of [city name], in the style of Candy Crush Saga, featuring the city’s iconic landmarks as candy-inspired buildings, cute gumdrop trees, licorice bridges, pastel roads, and glossy water elements, floating clouds, vibrant cartoon style, top-down view, kid-friendly game aesthetics, horizontal layout\n\n中文提示词：\n一幅色彩丰富、充满童趣的[城市名称]2D地图，采用《糖果传奇》的风格，将城市的标志性地标设计成糖果风格的建筑，还有可爱的软糖树、甘草桥、柔和色调的道路、富有光泽的水域元素、漂浮的云朵，整体为鲜艳的卡通风格，采用俯视视角，具有适合儿童的游戏美学，为横向布局。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/261.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "头部的几何肖像",
      "author": "@TechieBySA",
      "prompt": "Design a geometric portrait of a [ANIMAL] head in the style of contemporary paper craft collage. Use multiple overlapping paper textures and shadow effects to build dimensional depth. Focus on botanical-inspired color palettes with matte finish aesthetics. The composition should feature bold, angular cuts that form the animal’s distinctive characteristics while maintaining facial symmetry. Set against a minimalist backdrop with subtle gradient. The final piece should evoke the craftsmanship of museum-quality paper installations. Square format, 1080x1080 pixels.\n\n中文提示词：\n设计一幅[动物]头部的几何肖像，采用当代纸艺拼贴风格。运用多种重叠的纸张纹理和阴影效果来构建立体深度。聚焦于植物灵感的色彩搭配，呈现哑光质感美学。构图应采用大胆的棱角切割，既塑造出该动物的独特特征，又保持面部对称性。背景为简约风格，带有微妙的渐变效果。最终作品需展现出博物馆级纸艺装置的精湛工艺。尺寸为正方形，1080x1080像素。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/255.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "磨砂泡泡 3D 图标",
      "author": "@Anima_Labs",
      "prompt": "{\n\"style_name\": \"Frosted Bubble 3D Icons\",\n\"render_mode\": \"3d_semi_transparent_detailed\",\n\"icon_subject\": \"{{icon_ PlayStation controller}}\",\n\"object_analysis\": {\n\"preserve_silhouette\": true,\n\"geometry_sensitive_mapping\": true,\n\"detail_retention\": \"smooth rounded edges, subtle internal reflections\"\n},\n\"material_properties\": {\n\"base_material\": [\n\"frosted translucent plastic\",\n\"semi-transparent matte acrylic\"\n],\n\"internal_elements\": \"floating colorful spheres, visible through the outer shell\",\n\"surface_finish\": \"frosted, diffused matte texture with light translucency\",\n\"texture_behavior\": \"no external color tint, transparency reveals inner objects\",\n\"branding_elements\": \"none\"\n},\n\"color_palette\": {\n\"primary\": [\"#FFFFFF\", \"#F5F5F5\"],\n\"accents\": [\"#FF69B4\", \"#FFA500\", \"#6A5ACD\", \"#00CED1\", \"#FFD700\"],\n\"contrast\": \"very high\"\n},\n\"lighting\": {\n\"type\": \"soft ambient + rim lighting\",\n\"intensity\": \"high\",\n\"shadows\": \"soft glow under the object\",\n\"highlights\": \"faint edge glow and top soft reflection\"\n},\n\"rendering\": {\n\"style\": \"modern 3D icon with internal color elements\",\n\"background\": \"pure black\",\n\"camera_angle\": \"isometric 3/4 view\",\n\"depth_of_field\": \"none, all details in focus\"\n},\n\"style_notes\": [\n\"black background increases bubble color visibility\",\n\"frosted transparency should glow subtly against black\",\n\"perfect for high-contrast, collectible-style icons\"\n]\n}\n\n中文提示词：\n{\n\"风格名称\": \"磨砂泡泡3D图标\",\n\"渲染模式\": \"3d_semi_transparent_detailed（3D半透明精细）\",\n\"图标主题\": \"{{图标_PlayStation手柄}}\",\n\"对象分析\": {\n\"保留轮廓\": true,\n\"几何敏感映射\": true,\n\"细节保留\": \"平滑的圆角边缘，细微的内部反射\"\n},\n\"材质属性\": {\n\"基础材质\": [\n\"磨砂半透明塑料\",\n\"半透明哑光亚克力\"\n],\n\"内部元素\": \"漂浮的彩色球体，可透过外壳看到\",\n\"表面处理\": \"磨砂、漫射哑光质感，带有轻微透光性\",\n\"纹理表现\": \"无外部色彩 tint，透明度可展现内部物体\",\n\"品牌元素\": \"无\"\n},\n\"色彩搭配\": {\n\"主色\": [\"#FFFFFF\", \"#F5F5F5\"],\n\"强调色\": [\"#FF69B4\", \"#FFA500\", \"#6A5ACD\", \"#00CED1\", \"#FFD700\"],\n\"对比度\": \"极高\"\n},\n\"光照\": {\n\"类型\": \"柔和环境光+轮廓光\",\n\"强度\": \"高\",\n\"阴影\": \"物体下方柔和光晕\",\n\"高光\": \"微弱的边缘发光和顶部柔和反射\"\n},\n\"渲染\": {\n\"风格\": \"带有内部彩色元素的现代3D图标\",\n\"背景\": \"纯黑色\",\n\"相机角度\": \"等距3/4视图\",\n\"景深\": \"无，所有细节均清晰对焦\"\n},\n\"风格说明\": [\n\"黑色背景提升泡泡色彩的可见度\",\n\"磨砂透明度在黑色背景下应呈现微妙的发光效果\",\n\"非常适合高对比度、收藏品风格的图标\"\n]\n}",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/254.png",
      "type": "text_to_image"
    },
    {
      "title": "亚克力钥匙扣",
      "author": "@TechieBySA",
      "prompt": "Create a photorealistic square image (1080x1080) showing a custom acrylic keychain version of the [LOGO] logo hanging from the zipper of a dark-colored backpack (e.g. black or grey). The logo must retain its original shape, color, and proportions without any alteration. The keychain should have a clear glossy acrylic layer, clipped with a silver metal ring and clasp. Use soft daylight or diffused lighting to avoid yellow tones. Set the background in a modern outdoor setting, but keep it blurred to maintain focus on the logo keychain.\n\n中文提示词：\n创建一张逼真的方形图片（1080x1080 像素），展示一个定制的 [LOGO] 标志亚克力钥匙扣，它挂在一个深色背包（如黑色或灰色）的拉链上。该标志必须保持其原始形状、颜色和比例，不得有任何改动。钥匙扣应有一层透明的光泽亚克力，配有银色金属环和扣具。使用柔和的日光或漫射光，避免黄色调。背景设置为现代户外环境，但需模糊处理，以将焦点保持在标志钥匙扣上。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/253.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "超细节盒状纸艺玩具",
      "author": "@Arminn_Ai",
      "prompt": "1×1 square, ultra-detailed render of a box-shaped papertoy version of [CHARACTER NAME]. Made from folded and cut matte cardstock with visible paper texture, crisp edges, and clean folds. Cubic head and body, blocky limbs, simplified facial features, flat printed colors, and subtle shading for depth. Clothing and accessories faithfully mimic [CHARACTER NAME]’s iconic look in a minimal geometric papercraft style, keeping proportions compact and chibi-like. Neutral studio lighting, soft shadows, plain background, photorealistic product photography, 4K, no text or logos.\n\n中文提示词：\n1×1大小的正方形，超细节渲染的[角色名称]盒状纸艺玩具版本。由折叠和裁剪的哑光卡纸制成，具有可见的纸张纹理、清晰的边缘和整齐的折痕。立方体头部和身体，块状四肢，简化的面部特征，平印色彩，以及用于体现深度的微妙阴影。服装和配饰以简约的几何纸艺风格忠实还原[角色名称]的标志性外观，保持紧凑的比例和Q版风格。中性工作室灯光，柔和阴影，简洁背景，逼真的产品摄影效果，4K分辨率，无文字或标志。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/251.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "被优雅水漩涡环绕的品牌产品",
      "author": "@Morph_VGart",
      "prompt": "Create square image of studio-lit product photography of a [Product] suspended in mid-air, lots of thick dynamic water swirls surrounding it in slow-motion arcs, crystal-clear droplets glistening with light refraction, high-gloss finish, minimal backdrop, cinematic lighting with soft shadows and highlights, shot on a pure matching gradient background, ultra-realistic detail, commercial photography style, 85mm lens depth of field.\n\n中文提示词：\n创建一个方形图像，是工作室照明的产品摄影，一个[产品]悬浮在空中，周围有许多厚重的动态水漩涡以慢动作弧线环绕，晶莹剔透的液滴折射着光线，高光泽度，简约背景，电影般的照明，柔和的阴影和高光，在纯色匹配渐变背景上拍摄，超逼真的细节，商业摄影风格，85mm 镜头景深。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/250.png",
      "type": "text_to_image"
    },
    {
      "title": "路牌图片",
      "author": "@diegocabezas01",
      "prompt": "Image of a billboard with the text: “Image of a billboard with the text:”\n\n中文提示词：\n路牌图片，上面写着：“路牌图片，上面写着：”",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/249.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "一张铅笔素描",
      "author": "@CharaspowerAI",
      "prompt": "A pencil drawing of [Your character], with detailed lines and shading on white paper, capturing the energy and strength in his muscular body [with element effects] around  the character, in a dynamic pose,   tattoo design on paper, manga art style, dark background, high contrast, strong shadows, light and shadow effects, black ink drawing,  dynamic pose\n\n中文提示词：\n一张铅笔素描，描绘了 [你的角色]，在白纸上用细致的线条和阴影，捕捉了他肌肉身体中的能量和力量 [带有元素效果] 围绕着角色，动态姿势，纸上的纹身设计，漫画艺术风格，深色背景，高对比度，强烈的阴影，光影效果，黑色墨水绘画，动态姿势",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/248.png",
      "type": "text_to_image"
    },
    {
      "title": "色彩缤纷的手工雕塑",
      "author": "@Deshraj4x",
      "prompt": "A colorful handcrafted sculpture of [insert subject], made from semi-transparent ice blocks in custom shapes. Accents like icing, candy, yarn, or fruit skin enhance facial features, texture, or accessories. Placed on a ceramic plate over a leaf or decorative mat, with a clean, softly lit studio or natural tabletop background. Lighting highlights the glossy ice texture, blending food art, toy design, and photography into a playful, artistic composition.\n\n中文提示词：\n一个色彩缤纷的手工雕塑，由[插入主题]制成，使用半透明的冰块，形状定制。装饰如糖霜、糖果、毛线或水果皮增强了面部特征、纹理或配饰。放置在陶瓷盘上，盘上覆盖着叶子或装饰垫，背景是干净、柔和照明的摄影棚或自然桌面。光线突出了冰块的光泽质感，将食品艺术、玩具设计和摄影融合成一种俏皮、艺术性的构图。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/246.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "Kiro卡通幽灵",
      "author": "@松果先森",
      "prompt": "A cute cartoon ghost is the absolute main subject of the picture. It has a pure white body with a smooth and rounded contour, and two simple black oval eyes, with no extra features. This ghost is floating quietly in the very center of the picture. The background is a pure, bright purple, creating a simple, modern, and friendly atmosphere. The composition is a centered close-up, and the aspect ratio is 1:1 square. There is no text in the entire image. The image style is typical flat design and vector art, minimalist, much like an app icon or a logo, characterized by clean lines and solid color blocks, without any gradients or textural details. The image quality required is high-resolution with clean, sharp edges. The overall feeling it gives is one of a cute, simple, and modern piece of digital art.\n\n中文提示词：\n一个可爱的卡通鬼魂是图片的绝对主体。它拥有纯白色的身体，轮廓平滑圆润，两只简单的黑色椭圆形眼睛，没有任何额外特征。这个鬼魂安静地漂浮在图片的正中央。背景是纯亮的紫色，营造出简洁、现代和友好的氛围。构图是居中的特写，宽高比为 1:1 的正方形。整个图像中没有文字。图像风格典型的扁平化设计和矢量艺术，极简主义，类似于应用图标或标志，以干净的线条和实色块为特点，没有任何渐变或纹理细节。要求的图像质量是高分辨率，边缘清晰锐利。它给人的整体感觉是一幅可爱、简洁、现代的数字艺术作品。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/245.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "9格Q版风格贴纸",
      "author": "@松果先森",
      "prompt": "Create a 3D kawaii 10-16 canvas featuring nine chibi-style stickers in various outfits, poses, and expressions. Use the uploaded attachment image. Each sticker has a white border and includes a speech bubble with regular use phrases. Set on a soft white-to-pastel blue gradient background for a fun, positive vibe, perfect for WhatsApp app use.\n\n中文提示词：\n创建一幅尺寸为 10-16 的 3D 可爱风格画布，其中包含 9 个 Q 版风格贴纸。这些贴纸要采用不同的服装、姿势和表情，使用已经上传的附件图片。每个贴纸都要有白色边框，且包含一个带有日常用语的 speech 气泡。背景设置为柔和的白到淡蓝色渐变，营造出有趣、积极的氛围，非常适合在 WhatsApp 应用中使用。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/241.png",
      "type": "text_to_image"
    },
    {
      "title": "定制的枕头",
      "author": "@TechieBySA",
      "prompt": "Create a high-resolution 3D render of the [BRAND] logo designed as an inflatable, puffy object. The logo should appear soft, rounded, and air-filled – like a plush balloon or blow-up toy. Use a smooth, matte texture with subtle fabric creases and stitching to emphasize the inflatable look. Position the logo at a 45-degree angle to highlight depth and realism. Place the final result on a couch in a stylish living room with furniture and decor that matches the iconic colors of the [BRAND] logo. Output dimension: 1080x1080. \n\n中文提示词：\n创建一个高分辨率的 3D 渲染图，将[BRAND]标志设计成一个充气、蓬松的物体。标志应看起来柔软、圆润、充气——像一个毛绒气球或充气玩具。使用光滑的哑光纹理，带有细微的布料褶皱和缝线，以强调充气效果。将标志以 45 度角摆放，以突出深度和真实感。将最终结果放置在风格时尚的客厅沙发上，家具和装饰与[BRAND]标志的标志性颜色相匹配。输出尺寸：1080x1080。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/240.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "沙滩胶囊城市",
      "author": "@TechieBySA",
      "prompt": "A vibrant, hyper-realistic miniature of [CITY] inside a transparent capsule lying on a sandy beach. The capsule is half [COLOR] (matching [COUNTRY]’s flag) with [CITY] written in white text on the colored section. Inside the capsule: iconic landmarks of [CITY], beautiful water canals or streets, small detailed boats or cars, sunny bright lighting, cinematic depth of field, dreamy atmosphere, ocean waves in the background.\n\n中文提示词：\n一个充满活力的、超写实的[CITY]微缩模型，放置在一个透明胶囊内，躺在沙滩上。胶囊一半是[COLOR]色（与[COUNTRY]的国旗相匹配），彩色部分上用白色文字写着[CITY]。胶囊内部：[CITY]的标志性地标、美丽的运河或街道、小巧精致的船只或汽车、阳光明媚的光线、电影般的景深、梦幻般的氛围、背景中的海浪。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/239.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "用花朵美化你的产品",
      "author": "@Kerroudjm",
      "prompt": "A high-end editorial photo of (PRODUCT NAME OR IMAGE) placed on a white marble pedestal, resting on champagne-colored silk. It is surrounded by pastel flowers whose type and color naturally harmonize with the product’s primary colors (COLOR PALETTE) — complementing and enhancing its tones. Soft natural light from the upper left. 3D realism, luxury product photography, shallow depth of field, 1:1 format.  \n\n中文提示词：\n(产品名称或图片)放置在白色大理石底座上，休息在香槟色丝绸上，的高端编辑照片。它被淡色花朵环绕，其类型和颜色自然与产品的主要颜色（调色板）协调——补充并增强其色调。来自左上方的柔和自然光。3D 现实主义，奢华产品摄影，浅景深，1:1 格式。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/238.png",
      "type": "text_to_image"
    },
    {
      "title": "电影镜头拍摄",
      "author": "@CharaspowerAI",
      "prompt": "Cinematic shot of [detailed character description], shot from [camera angle], [lighting type], [color palette], shot at close range, 35mm film grain, wide angle lens, f2.0 bokeh, shallow depth of field.\n\n中文提示词：\n电影镜头拍摄[详细角色描述]，从[相机角度]拍摄，[灯光类型]，[色彩搭配]，近距离拍摄，35mm 胶片颗粒，广角镜头，f2.0 浅景深，浅景深。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/237.png",
      "type": "text_to_image"
    },
    {
      "title": "直升机品牌广告",
      "author": "@TechieBySA",
      "prompt": "Create a hyper-realistic, square 1:1 image featuring a small helicopter flying through a bright blue sky with fluffy white clouds and a subtle lens flare. The helicopter is painted in the signature colors and graphics of [BRAND]. It is carrying a giant product from [BRAND] hanging below. The composition has the look and feel of a clean, playful (or premium, futuristic) advertisement. At the bottom, include the [BRAND] logo and a small slogan like [BRAND SLOGAN] in a stylish font. 1080x1080 dimension.  \n\n中文提示词：\n创作一张超写实的 1:1 方形图像，展现一架小型直升机在明亮的蓝天中飞行，周围有蓬松的白云和微妙的镜头眩光。直升机涂装着[BRAND]的标志性颜色和图案。它下方悬挂着一个来自[BRAND]的巨大产品。整个构图具有干净、俏皮（或高端、未来感）的广告风格。在底部，包含[BRAND]的标志和一句简短的风格化标语，如[BRAND SLOGAN]。尺寸为 1080x1080。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/236.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "讽刺版的你",
      "author": "@B_4AI",
      "prompt": "Based on your understanding of my personality and past interactions, create a humorous and satirical image that teases me in a playful way. The image must have comedic features, using exaggerated expressions or surreal visual metaphors. Artistic style: cartoon or caricature with high contrast and expressive details. The goal is to amuse, not insult. Ensure the satire is clever and mindful.\n\n中文提示词：\n根据您对我的个性和过去互动的理解，创建一个幽默、讽刺的图像，以俏皮的方式嘲笑我。图像必须具有喜剧特征，使用夸张的表情或超现实的视觉隐喻。艺术风格：具有高对比度和富有表现力的细节的卡通或漫画。目标是笑，而不是侮辱。确保讽刺是聪明和有意识的。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/235.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "产品成为霓虹灯下的梦想",
      "author": "@B_4AI",
      "prompt": "a surreal-realistic digital artwork of a product from the brand [Brand name]. The product should be glowing with neon outlines, stylized like a high-contrast 3D render. Place it in a dreamlike environment inspired by the brand’s identity, color scheme, and culture. Use soft shadows, deep blacks, and intense lighting for dramatic effect. \n\n中文提示词：\n[Brand name] 品牌商品的超现实主义写实数字艺术作品。产品应该闪耀着霓虹灯轮廓，像高对比度的3D渲染一样风格化。将其放置在受品牌身份、配色方案和文化启发的梦幻般的环境中。使用柔和的阴影、深黑色和强烈的光照来获得戏剧性的效果。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/234.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "超现实鸟类幻想",
      "author": "@B_4AI",
      "prompt": "A highly detailed and surreal depiction of a mythical bird creature. It has the elegant, colorful body of a butterfly, with vibrant symmetrical wing patterns. Its head is that of a majestic elephant, complete with large ears, a long curling trunk, and ivory tusks, giving it a powerful and ancient aura. A long, spotted giraffe neck connects the body and the head, rising high with grace. The wings are enormous eagle wings, fully extended with dramatic feathers in motion. Its tail is an iridescent peacock tail, fanned out in full display like royal plumage. The creature stands in an enchanted misty forest, bathed in ethereal light and surrounded by glowing particles. Ultra-realistic, cinematic lighting, fantasy atmosphere, hyper-detailed concept art\n\n中文提示词：\n对神话鸟类生物的高度详细和超现实的描绘。它拥有优雅、多彩的蝴蝶身体，带有充满活力、对称的翅膀图案。它的头是一头雄伟的大象，长着大耳朵、长长的卷曲的鼻子和象牙，赋予它强大而古老的光环。长长的斑点长颈鹿脖子连接身体和头部，优雅地高高耸立。翅膀是巨大的鹰翅膀，完全伸展，羽毛在运动中戏剧性。它的尾巴是一条彩虹色的孔雀尾巴，像皇家羽毛一样呈扇形展开。这个生物站在一片迷人的迷雾森林中，沐浴在空灵的光芒中，周围环绕着发光的粒子。超逼真的电影般的照明、奇幻的氛围、超详细的概念艺术",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/233.png",
      "type": "text_to_image"
    },
    {
      "title": "胶囊从透明的药瓶中倾倒",
      "author": "@fy360593",
      "prompt": "Hyper-realistic poster, 1080x1080. Small glossy/glass capsules spilling from a transparent medicine bottle onto a wet surface. Each capsule features [white]/[red] plastic and transparent glass, with [KFC] logo and a floating 3D icon inside. Strong reflections, studio lighting, water droplets, soft elegant background, DSLR photo realism.\n\n中文提示词：\n超写实的海报，1080x1080。小型的光亮/玻璃胶囊从透明的药瓶中倾倒在湿润的表面上。每个胶囊都带有[白色]/[红色]塑料和透明玻璃，内有[KFC]标志和一个悬浮的 3D 图标。强烈的反光，工作室灯光，水滴，柔和优雅的背景，DSLR 照片真实性。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/232.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "形状为生日气球文字",
      "author": "@Anima_Labs",
      "prompt": "Create a hyper-realistic 3D rendering of balloon letters forming the word [WOW]. Each letter should look like a shiny, inflatable mylar balloon with a bold printed pattern. Use a mix of textures such as [checkered print, color grids, polka dots, or glossy metallic black]. The balloons should be semi-reflective with realistic air volume, seams, wrinkles, and pressure points. Give each letter a distinct, playful surface design but keep the overall look cohesive. Use a soft pastel background, like [Orange color], to contrast the balloon textures. Lighting should create crisp reflections and soft shadows. The rendering must be photorealistic, fun, and vibrant — like a high-end visual for a creative pop-art birthday installation or fashion campaign.\n\n中文提示词：\n创建一个超逼真的 3D 渲染效果，将气球字母组成单词 [WOW]。每个字母看起来都像是一个闪亮的充气镀铝气球，带有大胆印刷的图案。使用多种纹理，例如 [格子印刷、彩色网格、波点或光泽金属黑]。气球应该是半反射的，具有真实的空气体积、接缝、皱纹和压力点。给每个字母一个独特、有趣的表面设计，但保持整体外观协调一致。使用柔和的粉彩色背景，例如 [橙色]，以对比气球的纹理。光线应产生清晰的反射和柔和的阴影。渲染效果必须是照片级的逼真、有趣且充满活力——就像创意波普艺术生日装置或时尚活动的高端视觉效果。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/231.png",
      "type": "text_to_image"
    },
    {
      "title": "可爱的卡通灵魂",
      "author": "@松果先森",
      "prompt": "A cute cartoon ghost is the absolute main subject of the picture. It has a pure white body with a smooth and rounded contour, and two simple black oval eyes, with no extra features. This ghost is floating quietly in the very center of the picture. The background is a pure, bright purple, creating a simple, modern, and friendly atmosphere. The composition is a centered close-up, and the aspect ratio is 1:1 square. There is no text in the entire image. The image style is typical flat design and vector art, minimalist, much like an app icon or a logo, characterized by clean lines and solid color blocks, without any gradients or textural details. The image quality required is high-resolution with clean, sharp edges. The overall feeling it gives is one of a cute, simple, and modern piece of digital art.\n\n中文提示词：\n一个可爱的卡通幽灵是画面的绝对主体，它拥有纯白色的、轮廓圆润流畅的身体，以及两只简单的黑色椭圆形眼睛，没有任何多余的特征。这个幽灵安静地漂浮着，位于整个画面的正中央。画面背景是纯粹的亮紫色，营造出一种简洁、现代且友好的氛围。构图方式为居中特写，图片比例为1:1的正方形。整个画面没有任何文字。这幅图像是典型的扁平化设计（Flat design）和矢量艺术风格，极简主义，非常像一个App图标或logo，特点是线条干净利落，颜色是纯色块填充，无任何渐变或纹理细节。图像质量要求高分辨率，边缘清晰锐利，整体给人一种可爱、简洁、现代化的数字艺术感受。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/230.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "品牌快餐胶囊",
      "author": "@TechieBySA",
      "prompt": "Create a hyper-realistic, stylish poster [1080x1080] aspect ratio featuring a horizontal tablet-capsule hovering above a surface covered in condensation and water droplets, with its shadow cast on the wet ground. One side of the capsule is transparent glass, while the other is glossy [BRAND COLORS] plastic, displaying the [BRAND] logo and name. Seamlessly floating inside the glass portion of the capsule is a photorealistic 3D model of the [BRAND LOGO OR ICON], perfectly centered and suspended in zero gravity. The glass and plastic surfaces showcase strong reflections, refractions, and environmental distortions. The background is a softly blurred, elegant light-toned setting. Use a dynamic perspective with a stylish camera angle, professional studio lighting, and ultra-high detail to make the image look like a DSLR-captured photograph with impeccable realism.\n\n中文提示词：\n创建一个超逼真、时尚的海报[1080x1080]宽高比，展示一个水平平板胶囊悬浮在布满水汽和液滴的表面上，其影子投射在湿润的地面上。胶囊一侧是透明玻璃，另一侧是光泽[品牌颜色]塑料，显示[品牌]标志和名称。玻璃部分无缝漂浮着一张逼真的 3D 模型[品牌标志或图标]，完美居中并悬浮在零重力中。玻璃和塑料表面展现出强烈的反射、折射和环境扭曲。背景是柔和模糊、优雅浅色调的设置。使用动态视角和时尚的相机角度，结合专业工作室灯光和超高清细节，使图像看起来像是一张由单反相机拍摄的真实照片，具有无懈可击的真实感。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/229.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "糖果形状物品",
      "author": "@TheRelianceAI",
      "prompt": "A glossy candy-shaped perfume bottle resting on an open book, soft morning light, delicate shadows, dreamy bokeh background with iridescent cellophane wrapping. The candy design is inspired by [YOUR STYLE]\n\n中文提示词：\n一个闪亮的糖果形状的香水瓶静置在一本打开的书上，柔和的晨光，细腻的阴影，梦幻的背景虚化效果，带有彩虹色透明膜包装。糖果设计灵感来源于[你的风格]",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/227.png",
      "type": "text_to_image"
    },
    {
      "title": "电影场景",
      "author": "@Dd41Giant",
      "prompt": "Close-up. Overhead shot from an extremely high vantage point, extremely low grain with iso100 film shadows on a Lomo LC-A. Realistic depth of field. Artistic composition. Overall bluish tones. Beautiful light and shadows. The black floor with the projected image of the blue sky that fills the screen. A very beautiful small-faced Japanese film actress with wet showy hair in a black dress shirt sitting cross-legged on the floor. She is wearing a long red skirt. Shiny black hair. Long eyelashes. Bright skin. Beautiful shining eyes. A smiling face. On the floor next to the actress is a white model of Saturn. The picture looks like a scene from a movie.\n\n中文提示词：\n特写。从极高视角拍摄的上视图，使用 Lomo LC-A 相机拍摄，ISO100 胶片，颗粒感极低，阴影真实。艺术构图。整体偏蓝色调。光影美丽。黑色地板上投射着充满屏幕的蓝色天空图像。一位非常美丽的日本小脸女演员，穿着黑色衬衫，盘腿坐在地板上，头发湿漉漉地显眼，穿着长红色裙子。闪亮的黑发。长长的睫毛。明亮肌肤。美丽的闪亮眼睛。微笑的面容。女演员旁边的地板上有一个白色的土星模型。这张照片看起来像电影中的一个场景。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/226.png",
      "type": "text_to_image"
    },
    {
      "title": "时尚的胶囊海报",
      "author": "@TechieBySA",
      "prompt": "Create a hyper-realistic, stylish poster [1080x1080] aspect ratio featuring a horizontal tablet-capsule hovering above a surface covered in condensation and water droplets, with its shadow cast on the wet ground. One side of the capsule is transparent glass, while the other is glossy [COLOR/DESIGN] plastic, displaying the [BRAND] logo and name. Seamlessly floating inside the glass portion of the capsule is a photorealistic 3D model of the [LOGO], perfectly centered and suspended in zero gravity. The glass and plastic surfaces showcase strong reflections, refractions, and environmental distortions. The background is a softly blurred, elegant light-toned setting. Use a dynamic perspective with a stylish camera angle, professional studio lighting, and ultra-high detail to make the image look like a DSLR-captured photograph with impeccable realism.\n\n中文提示词：\n创作一张超逼真、时尚的海报[1080x1080]宽高比，展示一个水平放置的平板胶囊悬浮在布满水汽和水滴的表面上，其影子投射在湿润的地面上。胶囊的一面是透明玻璃，另一面是光泽塑料[颜色/设计]，显示[品牌]标志和名称。在胶囊的玻璃部分中，一个逼真的 3D 模型[标志]无缝漂浮，完美居中并悬浮在零重力中。玻璃和塑料表面展现出强烈的反射、折射和环境扭曲。背景是一个柔和模糊、优雅浅色调的设置。使用动态视角和时尚的相机角度，结合专业工作室灯光和超高清细节，使图像看起来像是一张由单反相机拍摄的真实照片，具有无懈可击的真实感。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/225.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "惊人的外骨骼图像",
      "author": "@azed_ai",
      "prompt": "a futuristic 3D-rendered [object] made of translucent [color] inner structure encased in a smooth white exoskeleton with organic holes and flowing biomorphic patterns, floating in a minimal soft gray background, high contrast lighting, hyperrealistic materials, octane render, modern digital sculpture\n\n中文提示词：\n一个未来派的 3D 渲染[物体]，具有半透明的内部结构，被光滑的白色外骨骼包裹，外骨骼上有有机的孔洞和流动的仿生图案，悬浮在极简的浅灰色背景中，高对比度光照，超写实材质，Octane 渲染，现代数字雕塑",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/223.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "3D店铺渲染图",
      "author": "@TechieBySA",
      "prompt": "Ultra-realistic 3D render of a cute, miniature [BRAND NAME] storefront building. Designed using the brand’s signature style and color palette. Features a clean, modern exterior with large glass windows and a glowing 3D [BRAND NAME] logo sign on the front. Includes subtle branded props inside the store. Background matches the brand’s identity — clean, relevant, and atmospheric. Slight isometric angle, warm lighting, soft shadows, and centered composition. \n\n中文提示词：\n逼真的 3D 渲染图，展示了一个可爱、迷你版的[品牌名称]店铺建筑。采用品牌的标志性风格和色彩搭配设计。外部设计简洁现代，配有大型玻璃窗，正面有一个发光的 3D[品牌名称]标志。店内包含细微的品牌道具。背景与品牌身份相匹配——干净、相关且富有氛围。略微的等距角度，温暖的照明，柔和的阴影，居中构图。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/220.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "冬日国家",
      "author": "@TheRelianceAI",
      "prompt": "A super detailed, realistic snow globe containing the essence of [Country Name]. Inside the globe: miniature snowy landscapes, iconic landmarks, cultural symbols, and natural elements representing [Country Name], rendered with extreme realism and rich textures. Delicate falling snow creates a magical, atmospheric effect inside the globe. The background is clean and softly lit to focus entirely on the globe. The image is 1:1 aspect ratio. At the bottom of the image, the text “[Country Name]” is clearly written in an elegant serif font\n\n中文提示词：\n一个超级精细、逼真的雪球，包含着[国家名称]的精髓。球内：微型的雪景、标志性建筑、文化符号以及代表[国家名称]的自然元素，以极致的逼真感和丰富的纹理呈现。细腻的飘落雪花在球内营造出神奇的、充满氛围的效果。背景干净且柔和照明，完全聚焦于雪球。图像为 1:1 的宽高比。图像底部，用优雅的衬线字体清晰地书写着“[国家名称]”",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/219.png",
      "type": "text_to_image"
    },
    {
      "title": "超现实的黑白彩色页面",
      "author": "@gnrlyxyz",
      "prompt": "Create a psychedelic black and white coloring page featuring melting [SUBJECT] in the center, surrounded by large, playful shapes and smooth flowing patterns. The background includes whimsical and surreal elements such as sunflowers with eyes, melting eyeballs, melting hearts, melting mushrooms, clouds, and stars. Use bold, clean outlines and fully enclosed shapes to create distinct sections for easy coloring. Avoid excessive fine detail or clutter. Keep the composition open, spacious, and fun. Square aspect ratio with a white background. No text or color.\n\n中文提示词：\n创建一个超现实的黑白彩色页面，中心是融化的[主题]，周围有大型、有趣的形状和流畅的图案。背景包括诸如带眼睛的向日葵、融化的眼球、融化的心形、融化的蘑菇、云朵和星星等奇幻和超现实元素。使用粗犷、干净的轮廓和完全封闭的形状来创建易于上色的不同区域。避免过多的精细细节或杂乱。保持构图开放、宽敞和有趣。方形长宽比，白色背景。无文字或颜色。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/218.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "穿越梦境迷宫",
      "author": "@B_4AI",
      "prompt": "[Character] sprinting past dream elements, Storybook illustration, Maze of floating doors, clocks, and whispers, Lantern glow and ambient sparkle trails, [Color1] and [Color2], Whimsical and fast-paced, Follow-cam style with trailing POV\n\n中文提示词：\n[角色] 冲过梦境元素，故事书插画风格，漂浮的门、时钟和低语组成的迷宫，灯笼光芒和周围闪烁的轨迹，[颜色 1]和[颜色 2]，奇幻且节奏快速，跟随镜头风格，带有轨迹的 POV 视角",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/216.png",
      "type": "text_to_image"
    },
    {
      "title": "部分咬掉的糕点",
      "author": "@umesh_ai",
      "prompt": "A high-resolution, studio-lit macro photograph of a pastry shaped like a [SUBJECT], with a partial bite taken out, placed on a neutral matte surface with visible crumbs and soft shadows, highlighting texture and detail\n\n中文提示词：\n一张高分辨率的、影棚照明的微距照片，展示一个形状像[主题]的糕点，部分咬掉，放在一个中性哑光表面上，有明显的面包屑和柔和的阴影，突出质感和细节",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/214.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "3D蓬松的物体",
      "author": "@TechieBySA",
      "prompt": "Transform the [BRAND NAME] logo into a hyper-realistic, 3D fluffy object. Keep the original shape and exact brand colors. Cover the entire surface in soft, detailed fur with a realistic hair texture. Use cinematic lighting to create subtle backlighting and soft shadows, making the logo appear tactile and surreal. Place the logo in the center of a clean black background, floating gently with a modern, stylish look. The style should feel cozy, playful, and visually striking. Render in ultra-high 4K resolution with photorealistic quality. \n\n中文提示词：\n将[品牌名称]标志转化为超逼真、3D 蓬松的物体。保持原始形状和品牌的确切颜色。用柔软、细节丰富的毛皮覆盖整个表面，具有逼真的毛发纹理。使用电影感光效创造微妙的后光和柔和的阴影，使标志看起来有触感和超现实。将标志放在干净黑色背景的中心，轻轻漂浮，具有现代时尚感。风格应感觉温馨、俏皮、视觉上引人注目。以超高清 4K 分辨率渲染，具有照片级真实质量。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/213.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "品牌在悬浮平台上",
      "author": "@TheRelianceAI",
      "prompt": "A highly detailed cinematic advertisement scene featuring [TYPE OF ALCOHOL, BRAND], standing on a surreal floating platform that visually embodies its spirit. The platform is made of materials that represent the drink’s essence (e.g. sparkling crystals for champagne, rich dark wood for whiskey, frosted ice for vodka), with dramatic reflections and melting details dripping into a calm reflective water surface. A matching glass is filled with the drink, featuring artistic textures (ice, gems, swirling liquid). Soft, colorful sunset sky with dramatic clouds in the background, high-end luxury aesthetic, photorealistic, macro details, dreamy glow, premium product photography.\n\n中文提示词：\n一个高度细致的影视广告场景，展示[酒类类型，品牌]，站在一个体现其精神的超现实悬浮平台上。平台由代表饮品本质的材料制成（例如香槟的闪亮水晶、威士忌的浓郁深色木材、伏特加的冰霜），戏剧性的倒影和融化的细节滴入平静的反射水面。一个匹配的玻璃杯装满了饮品，具有艺术纹理（冰块、宝石、旋转的液体）。柔和的彩色日落天空背景中有戏剧性的云朵，高端奢华美学，照片级真实感，宏观细节，梦幻般的光芒，高端产品摄影。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/212.png",
      "type": "text_to_image"
    },
    {
      "title": "灯泡中的城市",
      "author": "@TechieBySA",
      "prompt": "Create a hyper-realistic, stylish poster featuring a light bulb lying on wet urban asphalt. Inside the bulb, place a miniature version of [CITY] with its iconic landmarks. A sleek white 3D text of the city name ‘[CITY]’ should stand prominently in front of the bulb. The background is a softly blurred cityscape with neon lights reflecting on the bulb’s glass and the wet pavement. Add volumetric moonlight for depth and atmosphere. The image should look like a high-quality DSLR photograph with sharp details, cinematic lighting, and a moody, futuristic vibe. \n\n中文提示词：\n创作一张超逼真、时尚的海报，展示一个躺在湿漉漉的城市柏油路面上的灯泡。在灯泡内部放置一个[CITY]的微缩版，并包含其标志性地标。在灯泡前方，应突出显示一个光滑的白色 3D 文字，写着城市名称‘[CITY]’。背景是柔和模糊的城市景观，霓虹灯光在灯泡的玻璃和湿滑的路面上映射。添加体积光以增强深度和氛围。图像应看起来像一张高质量的数码单反相机照片，具有清晰的细节、电影般的灯光和忧郁的未来感。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/211.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "90年代风格的摔跤人物",
      "author": "@CharaspowerAI",
      "prompt": "Product photography, a 1990's style WWF Wrestling Figurine package with the figurine wrestler in the package being [your character]. The figure features bright colors, a detailed character design,  white background with professional studio lighting.\n\n中文提示词：\n产品摄影，一个 90 年代风格的 WWF 摔角人偶包装，包装中的人偶是[你的角色]。人偶色彩鲜艳，角色设计精细，背景为白色，配有专业工作室灯光。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/210.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "吃掉你的文字",
      "author": "@aziz4ai",
      "prompt": "Create the word “[WORD]” made entirely from its real texture and styled using the identity of the most iconic brand associated with it.\n\nThe word should:\n• Visually reflect the material (e.g. honey, chocolate, soda, candy).\n• Use the brand’s signature colors and typography.\n• Include the brand logo beneath the word.\n• Add a short slogan (3–4 words) matching the product’s vibe.\n• Be centered in a minimal background inspired by the product (e.g. breakfast table, soda splash, cookie tray).\n\n• Dimensions: 1:1\n• Style: clean, bold, product-focused\n• Render: ultra-HD, HDR, 8K\n\n中文提示词：\n创建由其真实质感完全构成，并使用与其最具有标志性的品牌相联系的标识进行风格的“[单词]”。\n\n该单词应：\n• 视觉上反映材料（例如蜂蜜、巧克力、汽水、糖果）。\n• 使用该品牌的标志性颜色和字体。\n• 在文字下方包含品牌标志。\n• 添加一个与产品氛围相符的简短口号（3-4 个字）。\n• 居中放置在受产品启发的简约背景中（例如：早餐桌、汽水飞溅、饼干托盘）。\n\n• 尺寸：1:1\n• 风格：简洁、醒目、以产品为中心\n• 渲染：超高清、HDR、8K",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/209.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "逼真的产品照片",
      "author": "@azed_ai",
      "prompt": "A realistic product photo of a [brand name] [bottle or jar] sculpted entirely from fresh [ingredient name], arranged perfectly to form the shape of the original packaging, including a detailed and accurate label on the front. The background is a clean, soft light gray with a natural wooden surface. Studio lighting, soft shadows, 1:1 square composition, professional product photography style, ultra-detailed textures, vibrant and glossy finish\n\n中文提示词：\n一个逼真的产品照片，展示一个[品牌名称][瓶子或罐子]，完全由新鲜[原料名称]雕刻而成，完美排列形成原始包装的形状，包括前面详细且准确的标签。背景是干净柔和的浅灰色，带有自然木质表面。工作室灯光，柔和阴影，1:1 方形构图，专业产品摄影风格，超精细纹理，生动有光泽的表面。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/208.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "超现实的高冲击力的图像",
      "author": "@azed_ai",
      "prompt": "Create a hyperrealistic, high-impact image of a [subject] suspended mid-air, captured at the peak of an explosive moment. Surround it with dynamic [particles/splashes/fragments] that enhance motion and energy. macro-level detail, bold rim lighting, and a vibrant [background color] to emphasize form, texture, and contrast, cinematic, modern, and visually striking. perfect for premium product campaigns.\n\n中文提示词：\n创建一个超现实的、高冲击力的图像，展示一个[主题]在空中悬停，捕捉到爆炸性时刻的巅峰。用动态的[粒子/飞溅/碎片]围绕它，增强运动感和能量。宏观细节，大胆的边缘照明，以及充满活力的[背景颜色]，以强调形状、质感和对比度，电影般的、现代的、视觉上引人注目。非常适合高端产品活动。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/207.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "工业内部品牌广告",
      "author": "@aziz4ai",
      "prompt": "Create a hyperrealistic, surreal 1:1 advertisement for [Brand Name].\nTransform the product into a miniature industrial factory or laboratory from the inside.\nReveal detailed internal systems: pipes, workers, glowing fluids, steam, and machines — all functioning to reflect the product’s core purpose (energy, beauty, flavor, etc).\nKeep the outer product branding realistic and sharp.\nSet the background minimal and cinematic.\nAdd the brand logo at the top, and a short, powerful slogan at the bottom.\nStyle: studio-grade lighting, high contrast, photorealistic textures.\n\n中文提示词：\n创建一个超现实、1:1 比例的品牌广告。\n将产品内部转化为微型工厂或实验室。\n展示详细的内部系统：管道、工人、发光的液体、蒸汽和机器——所有这些都运作起来，反映产品的核心功能（能量、美丽、风味等）。\n保持外层产品的品牌标识真实锐利。\n将背景设置得简约且电影感十足。\n在顶部添加品牌标志，底部添加一句简短有力的口号。\n风格：影棚级灯光，高对比度，照片级真实纹理。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/206.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "以动物为灵感的品牌",
      "author": "@Kerroudjm",
      "prompt": "A high-quality studio photograph of a [BRAND + OBJECT] fully covered in ultra-realistic [ANIMAL] texture (e.g., fur, feathers, skin, or scales), placed against a soft neutral background. The object’s original shape, key design elements, and brand identity remain clearly visible beneath the animal’s organic surface. Integrate the official logo of the brand prominently into the composition. Automatically generate a compelling and brand-appropriate slogan that draws symbolic inspiration from the animal’s qualities and matches the tone of a premium advertising campaign. The image must feature clean composition, soft shadows, minimalist styling, professional lighting, and highly detailed textures—each hair, scale, or wrinkle should be visible in sharp detail. Format 1:1.\n\n中文提示词：\n一张高品质的影棚照片，展示一个[品牌+物品]完全覆盖着超逼真的[动物]纹理（例如毛发、羽毛、皮肤或鳞片），放置在柔和的中性背景前。物品的原始形状、关键设计元素和品牌标识在动物的自然表面下依然清晰可见。将品牌的官方标志显著地融入构图。自动生成一个引人入胜且符合品牌调性的口号，从动物的品质中汲取象征性灵感，匹配高端广告活动的基调。图像必须具备整洁的构图、柔和的阴影、极简风格、专业的灯光和高度精细的纹理——每一根毛发、鳞片或皱纹都应在锐利的细节中清晰可见。格式 1:1。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/205.png",
      "type": "text_to_image"
    },
    {
      "title": "3D表情符号头部",
      "author": "@TechieBySA",
      "prompt": "Generate a hyper-realistic 3D render of a [EMOJI🐱] as a floating animal head with plush toy aesthetics. The design should emphasize ultra-soft, long fur, playful cuteness, and a childlike charm. Use a straight-on camera angle with soft, diffused lighting to create a warm and inviting glow. Keep the background pure white for a clean, modern look. The color palette should be vibrant yet soothing, enhancing the toy-like appeal. Style: Ultra-detailed, whimsical, and hyper-cute, blending realism with a soft, plush texture for maximum visual impact.\n\n中文提示词：\n生成一个超逼真的 3D 渲染效果，将[表情符号 🐱 ]设计成一个漂浮的动物头部，具有毛绒玩具的美学风格。设计应强调超柔软的长毛、俏皮可爱和童真魅力。使用正面直视的相机角度，搭配柔和的漫射光线，营造出温暖诱人的光泽。保持背景纯白色，以呈现干净现代的外观。色彩搭配应鲜明而舒缓，增强玩具般的吸引力。风格：超精细、奇幻、超可爱，将现实主义与柔软的毛绒质感相结合，以达到最大的视觉冲击力。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/203.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "创建半透明图标",
      "author": "@azed_ai",
      "prompt": "Create a 3D-rendered icon of [Subject] in a dreamy, translucent, glass-like plastic material with soft pink and purple hues. glossy, smooth, rounded edges, glowing highlights, and soft shimmer or sparkle effects. UI, floating against a clean white background with soft shadows and natural lighting, elegant, and modern.\n\n中文提示词：\n创建一个以[主题]为原型的 3D 渲染图标，采用梦幻般的、半透明的、类似玻璃的塑料材质，带有柔和的粉红色和紫色色调。表面光亮、边缘圆润、高光闪烁，并带有柔和的闪烁或闪光效果。UI 设计，悬浮在干净的白色背景上，带有柔和的阴影和自然光照，优雅且现代。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/202.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "纸上的小卡通角色",
      "author": "@jimmj1010",
      "prompt": " Imagine you’re a tiny cartoon character who has come to life on a piece of paper! Draw yourself running away from a giant pencil that’s trying to erase you. Add colorful pencils, a desk, and maybe some flying eraser bits for extra excitement. Use your wildest imagination to make it look like you’re bursting out of the page!\n\n中文提示词：\n想象你是一个在纸上活过来的小卡通角色！画自己从一只试图擦掉你的巨大铅笔逃跑。添加彩色铅笔、书桌，也许还有一些飞行的橡皮屑以增加乐趣。用你最狂野的想象力让它看起来像是从页面上爆发出来！",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/201.jpeg",
      "type": "text_to_image"
    },
    {
      "title": "实物与手绘涂鸦创意广告",
      "author": "@azed_ai",
      "prompt": "一则简约且富有创意的广告，设置在纯白背景上。\n一个真实的 [真实物体] 与手绘黑色墨水涂鸦相结合，线条松散而俏皮。涂鸦描绘了：[涂鸦概念及交互：以巧妙、富有想象力的方式与物体互动]。在顶部或中部加入粗体黑色 [广告文案] 文字。在底部清晰放置 [品牌标志]。视觉效果应简洁、有趣、高对比度且构思巧妙。\n\n*注意： 请将提示词中的 [真实物体]、[涂鸦概念及交互]、[广告文案] 和 [品牌标志] 替换为具体内容。\n例如：\n[真实物体]：咖啡豆\n[涂鸦概念及交互]：巨型咖啡豆变成一个太空行星，一个小宇航员站在其表面上，并插上旗帜\n[广告文案]：“Explore Bold Flavor”\n[品牌标志]：星巴克 Logo*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/100/creative-ad-real-object-hand-drawn-doodle.png",
      "type": "text_to_image"
    },
    {
      "title": "黑白肖像艺术",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "高分辨率的黑白肖像艺术作品，采用编辑类和艺术摄影风格。背景呈现柔和渐变效果，从中灰过渡到近乎纯白，营造出层次感与寂静氛围。细腻的胶片颗粒质感为画面增添了一种可触摸的、模拟摄影般的柔和质地，让人联想到经典的黑白摄影。\n\n画面右侧，一个模糊却惊艳的哈利波特面容从阴影中隐约浮现，并非传统的摆拍，而像是被捕捉于思索或呼吸之间的瞬间。他的脸部只露出一部分：也许是一个眼睛、一块颧骨，还有唇角的轮廓，唤起神秘、亲密与优雅之感。他的五官精致而深刻，散发出忧郁与诗意之美，却不显矫饰。\n\n一束温柔的定向光，柔和地漫射开来，轻抚他的面颊曲线，或在眼中闪现光点——这是画面的情感核心。其余部分以大量负空间占据，刻意保持简洁，使画面自由呼吸。画面中没有文字、没有标志——只有光影与情绪交织。\n\n整体氛围抽象却深具人性，仿佛一瞥即逝的目光，或半梦半醒间的记忆：亲密、永恒、令人怅然的美。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/99/harry-potter-black-white-portrait-art.png",
      "type": "text_to_image"
    },
    {
      "title": "磨砂玻璃后的虚实对比剪影",
      "author": "@umesh_ai",
      "prompt": "一张黑白照片，展示了一个[主体]在磨砂或半透明表面后的模糊剪影。其[部分]轮廓清晰，紧贴表面，与其余朦胧、模糊的身影形成鲜明对比。背景是柔和的灰色渐变色调，增强了神秘和艺术的氛围。\n\n*注意： 请在 [主体] 和 [部分] 中填入具体且富有画面感的描述，突出“模糊主体 + 清晰局部”的反差效果。\n例如：[主体] 可写为“手持红色光剑的西斯领主”，[部分] 可写为“另一只聚集暗黑原力的手”。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/98/blurred-silhouette-frosted-glass.png",
      "type": "text_to_image"
    },
    {
      "title": "三只动物与地标自拍",
      "author": "@berryxia_ai",
      "prompt": "三只[动物类型]在标志性[地标]前的特写自拍照，它们表情各异，拍摄于黄金时刻，采用电影般的灯光。动物们靠近镜头，头挨着头，模仿自拍姿势，展现出喜悦、惊讶和平静的表情。背景展示了[地标]完整的建筑细节，光线柔和，氛围温暖。采用摄影感、写实卡通风格拍摄，高细节，1:1 宽高比。\n\n*注意： 可替换提示词中的 [动物类型] 和 [地标] 为具体描述。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/94/three_animals_selfie_at_landmark.png",
      "type": "text_to_image"
    },
    {
      "title": "透视3D出屏效果",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "超写实，从上往下俯视角拍摄，一个美丽的ins模特【安妮海瑟薇 / 见参考图片】，有着精致美丽的妆容和时尚的造型，站在一部被人托起的智能手机屏幕上，画面营造出强烈的透视错觉。强调女孩从手机中站出来的三维效果。她戴着黑框眼镜，穿着高街风，俏皮地摆着可爱的pose。手机屏幕被处理成深色地板，像是一个小舞台。场景使用强烈的强制透视（forced perspective）表现手掌、手机与女孩之间的比例差异。背景为干净的灰色，使用柔和室内光，浅景深，整体风格为超现实写实合成。透视特别强\n\n*注意： 可将提示词中的【安妮海瑟薇】替换为其他人物名称。或者使用一张人物照片作为参考图片。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/92/perspective-3d-pop-out-effect.png",
      "type": "text_to_image"
    },
    {
      "title": "品牌化键盘键帽",
      "author": "@egeberkina",
      "prompt": "一个超逼真的3D渲染图，展示了四个机械键盘键帽，排列成紧密的2x2网格，所有键帽相互接触。从等轴测角度观察。一个键帽是透明的，上面用红色印刷着“{just}”字样。另外三个键帽采用颜色：{黑色、紫色和白色}。一个键帽上带有Github的Logo。另外两个键帽上分别写着“{fork}”和“{it}”。逼真的塑料纹理，圆润的雕刻键帽，柔和的阴影，干净的浅灰色背景。\n\n*注意： 替换品牌名、标语、键帽颜色*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/90/case.png",
      "type": "text_to_image"
    },
    {
      "title": "镀铬emoji徽章",
      "author": "@egeberkina",
      "prompt": "高精度的 3D 渲染图，按照 emoji 图标 {👍} 展示一个金属质感的徽章，固定在竖直的商品卡片上，具有超光滑的镀铬质感和圆润的 3D 图标造型，风格化的未来主义设计，带有柔和的反光与干净的阴影。纸质卡片顶部中央带有一个冲切的欧式挂孔，徽章上方是醒目的标题 “{Awesome}”，下方配有趣味标语 “{Smash that ⭐ if you like it!}”。背景为柔和的灰色，使用柔光摄影棚灯光，整体风格极简。\n\n*注意： 替换 {👍} emoji 图标；替换标题和标语。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/89/case.png",
      "type": "text_to_image"
    },
    {
      "title": "儿童涂色页插画（含彩色参考图）",
      "author": "@dotey",
      "prompt": "一张黑白线描涂色插画，适合直接打印在标准尺寸（8.5x11英寸）的纸张上，无纸张边框。整体插画风格清新简洁，使用清晰流畅的黑色轮廓线条，无阴影、无灰阶、无颜色填充，背景纯白，便于涂色。\n【同时为了方便不会涂色的用户，请在右下角用小图生成一个完整的彩色版本供参考】\n适合人群：【6-9岁小朋友】\n画面描述：\n【一只独角兽在森林的草地上漫步，阳光明媚，蓝天白云】\n\n*注意： 可替换提示词中的【】内容，例如适合人群和画面描述。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/88/case.png",
      "type": "text_to_image"
    },
    {
      "title": "字母与单词含义融合",
      "author": "@dotey",
      "prompt": "在字母中融入单词的含义，将图形和字母巧妙融合在一起。\n单词：{ beautify }\n下面加上单词的简要说明\n\n*注意： 替换单词{ beautify }为想要融合的单词*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/87/case.png",
      "type": "text_to_image"
    },
    {
      "title": "双重曝光",
      "author": "rezzycheck (Sora)",
      "prompt": "双重曝光，Midjourney 风格，融合、混合、叠加的双重曝光图像，双重曝光风格。一幅由 Yukisakura 创作的杰出杰作，展现了一个奇妙的双重曝光构图，将阿拉贡·阿拉松之子的剪影与生机勃勃春季里中土世界视觉上引人注目、崎岖的地貌和谐地交织在一起。沐浴阳光的松树林、山峰和一匹孤独的马穿过小径的景象从他身形的纹理中向外回响，增添了叙事和孤独的层次感。当简洁分明的单色背景保持着锐利的对比度时，美妙的张力逐渐形成，将所有焦点吸引到层次丰富的双重曝光上。其特点是阿拉贡剪影内部充满活力的全彩色方案，以及用情感的精确性描摹每个轮廓的清晰、刻意的线条。(Detailed:1.45). (Detailed background:1.4).\n\n*注意： 中文提示词由英文原文翻译而来，基本能达到预期效果，不过使用英文提示词可能会获得更好的结果。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/86/double_exposure.png",
      "type": "text_to_image"
    },
    {
      "title": "超现实交互场景",
      "author": "@umesh_ai",
      "prompt": "一幅铅笔素描画，描绘了 [Subject 1] 与 [Subject 2] 互动的场景，其中 [Subject 2] 以逼真的全彩风格呈现，与 [Subject 1] 及背景的手绘素描风格形成超现实的对比。\n\n*注意： 替换提示词中的[主体1]和[主体2]为具体的主体描述，例如\"一个女孩\"和\"一朵玫瑰\"。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/85/case.png",
      "type": "text_to_image"
    },
    {
      "title": "动物硅胶腕托",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "创建图片 一个可爱Q版的硅胶护腕托，外形基于【🐼】表情，采用柔软的食品级硅胶材质，表面为亲肤哑光质感，内部填充慢回弹棉，拟人化卡通风格，表情生动，双手张开趴在桌面上，呈现出拥抱手腕的姿势，整体造型圆润软萌，颜色为【🐼】配色，风格治愈可爱，适合办公使用，背景为白色纯色，柔和布光，产品摄影风格，前视角或45度俯视，高清细节，突出硅胶质感与舒适功能\n\n*注意： 可替换提示词中的【🐼】为其他动物 Emoji。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/84/case.png",
      "type": "text_to_image"
    },
    {
      "title": "发光线条解剖图",
      "author": "@umesh_ai",
      "prompt": "一幅数字插画，描绘了一个 [SUBJECT]，其结构由一组发光、干净且纯净的蓝色线条勾勒而成。画面设定在深色背景之上，以突出 [SUBJECT] 的形态与特征。某个特定部位，如 [PART]，通过红色光晕加以强调，以表示该区域的重要性或特殊意义。整体风格兼具教育性与视觉吸引力，设计上仿佛是一种先进的成像技术。\n\n*注意： 可替换提示词中的 `[SUBJECT]` (主体) 和 `[PART]` (部位)。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/83/case.png",
      "type": "text_to_image"
    },
    {
      "title": "特色城市天气预报",
      "author": "@dotey",
      "prompt": "以清晰的45°俯视角度，展示一个等距微缩模型场景，内容为[上海东方明珠塔、外滩]等城市特色建筑，天气效果巧妙融入场景中，柔和的多云天气与城市轻柔互动。使用基于物理的真实渲染（PBR）和逼真的光照效果，纯色背景，清晰简洁。画面采用居中构图，凸显出三维模型精准而细腻的美感。在图片上方展示“[上海 多云 20°C]”，并附有多云天气图标。\n\n*注意： 城市、天气、温度和建筑名称可根据需求替换 [] 中的内容。图片由 Sora 生成。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/82/example.png",
      "type": "text_to_image"
    },
    {
      "title": "代码风格名片",
      "author": "@umesh_ai",
      "prompt": "特写镜头：一只手正拿着一张设计成 VS Code 中 JSON 文件外观的名片。名片上的代码以真实的 JSON 语法高亮格式呈现。窗口界面包含典型的工具栏图标和标题栏，标题显示为 Business Card.json，整体风格与 VS Code 界面完全一致。背景略微虚化，突出展示名片内容。\n名片上的 JSON 代码如下所示：\n{\n  \"name\": \"Jamez Bondos\",\n  \"title\": \"Your Title\",\n  \"email\": \"your@email.com\",\n  \"link\": \"yourwebsite\"\n}\n\n*注意： 替换最后的JSON代码中的name、title、email和link数据。提示词由原文链接中简化而来。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/80/example_business_card_code_style.png",
      "type": "text_to_image"
    },
    {
      "title": "乐高城市景观",
      "author": "@dotey",
      "prompt": "创建一幅高度精细且色彩鲜艳的乐高版上海外滩景象。前景呈现经典的外滩历史建筑群，用乐高砖块精致还原西式与新古典主义风格的建筑立面，包括钟楼、穹顶、柱廊等细节。乐高小人们正在沿江漫步、拍照、观光，街道两旁停靠着经典样式的乐高汽车。背景是壮观的黄浦江，以蓝色半透明乐高砖拼接，江面上有乐高渡轮和游览船。对岸的浦东陆家嘴高楼林立，包括东方明珠塔、上海中心、金茂大厦和环球金融中心，这些超现代乐高摩天大楼色彩丰富、造型逼真。天空为乐高明亮蓝色，点缀少量白色乐高积木云朵，整体呈现充满活力与现代感的视觉效果。\n\n*注意： 可以用 AI 参考提示词示例生成其他城市景观。原图由 Sora 生成。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/79/example_lego_shanghai_bund.png",
      "type": "text_to_image"
    },
    {
      "title": "水晶球故事场景",
      "author": "@dotey",
      "prompt": "一枚精致的水晶球静静摆放在窗户旁温暖柔和的桌面上，背景虚化而朦胧，暖色调的阳光轻柔地穿透水晶球，折射出点点金光，温暖地照亮了四周的微暗空间。水晶球内部自然地呈现出一个以 {嫦娥奔月} 为主题的迷你立体世界，细腻精美而梦幻的3D景观，人物与物体皆是可爱的Q版造型，精致而美观，彼此之间充满灵动的情感互动。整体氛围充满了东亚奇幻色彩，细节极为丰富，呈现出魔幻现实主义般的奇妙质感。整个场景如诗如梦，华美而典雅，散发着温馨柔和的光芒，仿佛在温暖的光影中被赋予了生命。\n\n*注意： 可替换提示词中括号 {} 内文字为故事场景描述，成语、故事、小故事都可以。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/77/example_crystal_ball_chang_e.png",
      "type": "text_to_image"
    },
    {
      "title": "怀旧动漫风格电影海报",
      "author": "photis (Sora)",
      "prompt": "{The Lord of the Rings} 风格的动漫电影海报，动漫画风为《恶魔高中 DXD（High School DXD）》风格。海报上可见明显的折痕痕迹，因长时间反复折叠，造成部分区域出现褶皱处的物理性损伤和擦痕，颜色也在某些地方出现了褪色。表面遍布无规律的折痕、翻折印记与划痕，这些都是在不断搬动过程中逐渐积累的微小损耗，如同熵增不可逆的过程在不断扩展。\n然而，留存在我们心中的美好记忆却始终完整无缺。当你凝视这张充满怀旧氛围的海报时，所感受到的，正是那些随时间累积、变得无比珍贵的收藏品所承载的情感本质。\n\n*注意： 可替换提示词中的电影名{The Lord of the Rings}为其他电影，某些电影可能会触发内容审核。参考的动漫风格也可以修改。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/76/example_anime_nostalgic_poster.png",
      "type": "text_to_image"
    },
    {
      "title": "Logo 形状创意书架",
      "author": "@umesh_ai",
      "prompt": "拍摄一张现代书架的照片，其造型灵感来源于 [LOGO] 的形状。书架由流畅、互相连接的曲线构成，形成多个大小不一的分区。整体材质为光滑的哑光黑色金属，曲线内部设有木质层板。柔和暖色的 LED 灯带勾勒出内侧曲线轮廓。书架安装在一个中性色调的墙面上，上面摆放着色彩丰富的书籍、小型绿植和极简风格的艺术摆件。整体氛围富有创意、优雅且略带未来感。\n\n*注意： 可替换提示词中的 `[LOGO]` 为具体品牌 Logo 描述（例如 \"Apple logo\", \"McDonald's logo\"）。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/74/example_logo_bookshelves.png",
      "type": "text_to_image"
    },
    {
      "title": "迷你 Cyberpunk 傾斜移軸景觀",
      "author": "terry623",
      "prompt": "從上方俯瞰的超高細節迷你【Cyberpunk】景觀，採用傾斜移軸鏡頭效果。場景中充滿如玩具般的元素，全部以高解析度 CG 呈現。光線戲劇化，營造出大片的氛圍，色彩鮮明，對比強烈，強調景深效果與擬真微觀視角，使觀者仿佛俯瞰一個玩具世界般的迷你現實，畫面中包含大量視覺笑點與極具重複觀看價值的細節設計\n\n*注意： 可替換提示詞中的【Cyberpunk】為其他風格或場景，如「未來城市」、「蒸汽朋克」、「中世紀村莊」等。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/71/example_cyberpunk_tilt_shift_miniature.jpg",
      "type": "text_to_image"
    },
    {
      "title": "剪影艺术",
      "author": "@umesh_ai",
      "prompt": "一个 [PROMPT] 的基础轮廓剪影。背景为亮黄色，剪影为纯黑色实心填充。\n\n*注意： 可替换提示词中的 `[PROMPT]` 为具体对象，例如 \"dragon on a castle\", \"woman's profile\" 等。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/69/example_silhouette_art.png",
      "type": "text_to_image"
    },
    {
      "title": "超写实3D游戏",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "超写实的 3D 渲染画面，重现了2008年《命令与征服：红色警戒3》中娜塔莎的角色设计，完全依照原版建模。场景设定在一个昏暗杂乱的2008年代卧室里，角色正坐在地毯上，面对一台正在播放《命令与征服：红色警戒3》的老式电视和游戏机手柄。\n\n整个房间充满了2008年代的怀旧氛围：零食包装袋、汽水罐、海报以及纠缠在一起的电线。娜塔莎·沃尔科娃在画面中被抓拍到转头的一瞬，回眸看向镜头，她那标志性的空灵美丽面容上带着一抹纯真的微笑。她的上半身微微扭转，动态自然，仿佛刚刚被闪光灯惊到而做出的反应。\n\n闪光灯轻微地过曝了她的脸和衣服，使她的轮廓在昏暗的房间中更加突出。整张照片显得原始而自然，强烈的明暗对比在她身后投下深邃的阴影，画面充满触感，带有一种真实的2008年胶片快照的模拟质感。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/67/example_Ultra_realistic_3D_game.png",
      "type": "text_to_image"
    },
    {
      "title": "创意丝绸宇宙",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "将 {❄️} 变成一个柔软的 3D 丝绸质感物体。整个物体表面包裹着顺滑流动的丝绸面料，带有超现实的褶皱细节、柔和的高光与阴影。该物体轻轻漂浮在干净的浅灰色背景中央，营造出轻盈优雅的氛围。整体风格超现实、触感十足且现代，传递出舒适与精致趣味的感觉。工作室灯光，高分辨率渲染。\n\n*注意： 可替换提示词中的 {❄️} 替换为你的目标值。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/66/example_silk_creation_universe.png",
      "type": "text_to_image"
    },
    {
      "title": "奇幻水下场景冰棒",
      "author": "@madpencil_",
      "prompt": "倾斜的第一人称视角拍摄，一只手握着一支超现实的冰棒。冰棒有着透明的蓝色外壳，里面展现了一个水下场景：一个小潜水员、几条小鱼和漂浮的气泡，还有翻滚的海浪，一根绿色的冰棒棍贯穿中心。冰棒略微融化，底部是一根木棍，手正握着这根木棍。背景是柔焦的纽约街景，采用高端产品摄影风格。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/65/surreal-underwater-scene-popsicle.png",
      "type": "text_to_image"
    },
    {
      "title": "蒸汽朋克机械鱼",
      "author": "@f-is-h",
      "prompt": "一个蒸汽朋克风格的机械鱼，身体为黄铜风格，可以清楚的看到其动作时的机械齿轮结构。\n能略微看到它的机械牙齿，整齐并且紧闭，上下牙齿都可以看到。每颗牙齿均呈三角状，材质为金刚石。\n尾鳍为金属丝编织结构，其它部分的鱼鳍是半透明的琥珀色玻璃，其中有一些不太明显的气泡。\n眼睛是多面红宝石，能清晰的看到它反射出来的光泽。\n鱼有身上能清晰的看到\"f-is-h\"字样，其中字母全部为小写，并且注意横线位置。\n图片是正方形的，整个画面中可以看到鱼的全身，在画面正中，鱼头向右，并且有一定的留白画面并不局促，画面的左右留出更多的空间。背景中有淡淡的蒸汽朋克风的齿轮纹理。\n整个鱼看起非常炫酷。这是一张高清图片，整张照片的细节非常丰富，并且有独特的质感与美感。画面不要太暗。\n\n*注意： 此图片展示了蒸汽朋克风格与金属材质的精美结合，呈现出精致的机械感和复古未来主义风格。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/64/example_steampunk_fish.jpg",
      "type": "text_to_image"
    },
    {
      "title": "Emoji 奶油雪糕",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "生成图片：将【🍓】变成变成一根奶油雪糕，奶油在雪糕顶上呈曲线流动状看起来美味可口，45度悬浮在空中，q版 3d 可爱风格，一致色系的纯色背景\n\n*注意： 可替换提示词中的【🍓】为其他 Emoji。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/63/example_ice_cream_emoji_strawberry.png",
      "type": "text_to_image"
    },
    {
      "title": "虚构推文截图 (爱因斯坦)",
      "author": "@egeberkina",
      "prompt": "爱因斯坦刚刚完成相对论后发布的一条超写实风格的推文。包含一张自拍照，照片中清晰可见背景中的粉笔板和潦草的公式。推文下方显示尼古拉·特斯拉点赞了该内容。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/61/example_fake_tweet_einstein.png",
      "type": "text_to_image"
    },
    {
      "title": "Emoji 簇绒地毯",
      "author": "@gizakdag",
      "prompt": "创建一个图像，展示一个彩色、手工簇绒的地毯，形状为 🦖 表情符号，铺设在一个简约的地板背景上。地毯设计大胆、俏皮，具有柔软蓬松的质感和粗线条的细节。从上方俯拍，使用自然光照，整体风格略带古怪的 DIY 美感。色彩鲜艳，轮廓卡通化，材质具触感且温馨舒适——类似于手工簇绒艺术地毯。\n\n*注意： 可替换提示词中的 🦖 为其他 Emoji。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/60/example_tufted_rug_star_emoji.png",
      "type": "text_to_image"
    },
    {
      "title": "彩色矢量艺术海报",
      "author": "@michaelrabone",
      "prompt": "地点是\"英国伦敦\"，生成一张夏季的彩色矢量艺术海报，顶部有大的\"LONDON\"标题，下方有较小的\"UNITED KINGDOM\"标题\n\n*注意： 可替换提示词中的城市和国家名称（例如将\"英国伦敦\"替换为\"中国北京\"以生成示例图，大小标题也跟着更换）。此风格提示词也可用于食物、电影、音乐等主题。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/59/example_vector_poster_london.png",
      "type": "text_to_image"
    },
    {
      "title": "云彩艺术",
      "author": "@umesh_ai",
      "prompt": "生成一张照片：捕捉了白天的场景，天空中散落的云彩组成了 [主体/物体] 的形状，位于 [地点] 的上方。\n\n*注意： 可替换提示词中的 `[SUBJECT/OBJECT]`（云彩形状的主体）和 `[LOCATION]`（地点）。示例图的主体是中国龙，地点是长城。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/58/example_cloud_art_dragon_great_wall.png",
      "type": "text_to_image"
    },
    {
      "title": "8位像素图标",
      "author": "@egeberkina",
      "prompt": "创建一个极简主义的 8 位像素风格的 [🍔] 标志，居中放置在纯白背景上。使用有限的复古调色板，搭配像素化细节、锐利边缘和干净的块状形态。标志应简洁、具有标志性，并能在像素艺术风格中清晰识别——灵感来自经典街机游戏美学。\n\n*注意： 可替换提示词中的 `[🍔]` 为其他 Emoji 或对象。提示词翻译自英文版本，请参考原文链接*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/57/example_8bit_pixel_beer.png",
      "type": "text_to_image"
    },
    {
      "title": "迷你 3D 建筑",
      "author": "@dotey",
      "prompt": "3D Q版迷你风格，一个充满奇趣的迷你星巴克咖啡馆，外观就像一个巨大的外带咖啡杯，还有盖子和吸管。建筑共两层，大大的玻璃窗清晰地展示出内部温馨而精致的设计：木质的家具、温暖的灯光以及忙碌的咖啡师们。街道上有可爱的小人偶漫步或坐着，四周布置着长凳、街灯和植物盆栽，营造出迷人的城市一角。整体采用城市微缩景观风格，细节丰富、逼真，画面光线柔和、呈现出午后的惬意感受。\n\n*注意： 可以让 AI 参考上面的提示词，为你生成其他建筑的类似提示词。例如：参考上面的提示词，写一个类似的提示词，针对【DunkinDonuts】，【甜甜圈】造型*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/56/example_miniature_starbucks_cup_building.png",
      "type": "text_to_image"
    },
    {
      "title": "创意绿植花盆",
      "author": "@azed_ai",
      "prompt": "一张高质量的照片，展示一个可爱的陶瓷[物体/动物]形状的花盆，表面光滑，里面装满了各种生机勃勃的多肉植物和绿色植物，包括尖刺的十二卷、莲座状的石莲花和精致的白色小花。花盆带有一个友好的面孔，放置在柔和的中性背景上，采用漫射自然光照明，展示了细腻的纹理和色彩对比，构图简洁、极具简约风格。\n\n*注意： 可替换提示词中的 [物体/动物] 为具体的物体、动物名称或表情符号。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/55/cute_plant_planter.png",
      "type": "text_to_image"
    },
    {
      "title": "“极其平凡”的iPhone自拍",
      "author": "@jiamimaodashu",
      "prompt": "请画一张极其平凡无奇的iPhone 自拍照，没有明确的主体或构图感，就像是随手一拍的快照。照片略带运动模糊，阳光或店内灯光不均导致轻微曝光过度。角度尴尬、构图混乱，整体呈现出一种刻意的平庸感-就像是从口袋里拿手机时不小心拍到的一张自拍。主角是陈奕迅和谢霆锋，晚上，旁边是香港会展中心，在香港维多利亚港旁边。\n\n*注意： 这个提示词旨在生成一张看起来非常随意、甚至有点“失败”的快照风格照片。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/54/example_ordinary_selfie_eason_nicholas.png",
      "type": "text_to_image"
    },
    {
      "title": "Emoji 充气感靠垫",
      "author": "@gizakdag",
      "prompt": "创建一个高分辨率的 3D 渲染图，将 [🥹] 设计成一个充气、鼓胀的物体。形状应柔软、圆润、充满空气——类似于一个毛绒气球或充气玩具。使用光滑的哑光材质，带有细微的布料折痕和缝线，以强化充气效果。整体形态应略带不规则且柔软塌陷，搭配柔和阴影和软光照，以突出体积感与真实感。将其置于干净、简约的背景上（浅灰色或浅蓝色），整体风格应保持俏皮而具雕塑感。\n\n*注意： 可将提示词中的 [🥹] 替换为其他 Emoji。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/53/example_emoji_cushion_pleading.png",
      "type": "text_to_image"
    },
    {
      "title": "纸艺风格 Emoji 图标",
      "author": "@egeberkina",
      "prompt": "一个纸艺风格的“🔥”图标，漂浮在纯白背景上。这个表情符号由彩色剪纸手工制作而成，具有可见的纸张纹理、折痕和分层形状。它在下方投下柔和的阴影，营造出轻盈感和立体感。整体设计简洁、有趣、干净，图像居中，周围留有大量留白。使用柔和的影棚光照以突出纸张的质感与边缘。\n\n*注意： 可将提示词中的 \"🔥\" 替换为其他 Emoji。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/52/example_paper_craft_emoji_fire.png",
      "type": "text_to_image"
    },
    {
      "title": "护照入境印章",
      "author": "@M_w14_",
      "prompt": "创建一个逼真的护照页，并盖上[北京, 中国]的入境章。章面应以粗体英文写明“欢迎来到北京”，并设计成圆形或椭圆形，并带有装饰性边框。章面应包含“ARRIVAL”字样和一个虚构的日期，例如“2025年4月16日”。在章面中加入{故宫}的微妙轮廓作为背景细节。使用深蓝色或红色墨水并略加晕染，以增强真实感。章面应略微倾斜，如同手工压印。护照页应清晰可见纸张纹理和安全图案。\n\n*注意： 可替换提示词中括号内的城市、国家、地标和日期。示例图使用罗马、意大利、罗马斗兽场、日期2025年4月16日。中文提示词 by @ZHO_ZHO_ZHO*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/51/example_passport_stamp_rome.png",
      "type": "text_to_image"
    },
    {
      "title": "物理破坏效果卡片 (劳拉)",
      "author": "@op7418",
      "prompt": "一幅超写实、电影感的插画，描绘了劳拉·克劳馥动态地撞穿一张“考古探险”集换卡牌的边框。她正处于跳跃中或用绳索摆荡，穿着标志性的冒险装备，可能正在使用双枪射击，枪口的火焰帮助将卡牌古老的石雕边框震碎，在破口周围制造出可见的维度破裂效果，如能量裂纹和空间扭曲，使灰尘和碎片四散飞溅。她的身体充满活力地向前冲出，带有明显的运动深度，突破了卡牌的平面，卡牌内部（背景）描绘着茂密的丛林遗迹或布满陷阱的古墓内部。卡牌的碎屑与 crumbling 的石头、飞舞的藤蔓、古钱币碎片和用过的弹壳混合在一起。“考古探险”的标题和“劳拉·克劳馥”的名字（带有一个风格化的文物图标）在卡牌剩余的、布满裂纹和风化痕迹的部分上可见。充满冒险感的、动态的灯光突出了她的运动能力和危险的环境。\n\n*注意： 原推文提到核心词是 dimensional break effects 和 motion depth。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/50/example_lara_croft_card_break.png",
      "type": "text_to_image"
    },
    {
      "title": "时尚杂志封面风格",
      "author": "@dotey",
      "prompt": "一位美丽的女子身穿粉色旗袍，头戴精致的花饰，秀发中点缀着色彩缤纷的花朵，颈间装饰着优雅的白色蕾丝领子。她的一只手轻托着几只大型蝴蝶。整体拍摄风格呈现高清细节质感，类似时尚杂志封面设计，照片上方中央位置标有文字「FASHION DESIGN」。画面背景采用简约的纯浅灰色，以突出人物主体。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/49/example_fashion_design_cover.png",
      "type": "text_to_image"
    },
    {
      "title": "键盘ESC 键帽微型立体模型",
      "author": "@egeberkina",
      "prompt": "一个超写实的等距视角 3D 渲染图，展示了一个微型电脑工作空间，置于一个半透明的机械键盘键帽内，键帽特别放置在一块真实哑光表面的机械键盘的 ESC 键上。\n键帽内部，一个穿着舒适、有纹理连帽衫的小人坐在现代人体工学椅上，正专注地面对一块发光的超写实电脑屏幕工作。整个空间布满了逼真的微型科技配件：真实材质的台灯、带有反射效果的显示器、微小的扬声器格栅、缠绕的电缆以及陶瓷杯子。\n场景底部由土壤、岩石和苔藓构成，拥有照片级的材质质感和自然瑕疵。键帽内的光照模拟清晨自然阳光，投下柔和阴影与温暖光调；而键帽外部则受周围键盘环境的冷色调反射影响。\n“ESC”字样以微弱的磨砂玻璃效果蚀刻在半透明键帽顶部——根据视角不同，仅隐约可见。\n周围的按键如 F1、Q、Shift 和 CTRL 均清晰可见，拥有真实材质纹理与光照。整体画面仿佛由高端手机相机拍摄，具备浅景深、完美白平衡与电影感细节。\n\n*注意： 中文版本提示词由英文版本翻译而来，原提示词请查看英文版本*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/47/example_esc_keycap_diorama.png",
      "type": "text_to_image"
    },
    {
      "title": "快乐胶囊制作",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "标题（大字）：速效快乐胶囊\n一颗上为星巴克绿下为透明的小药丸，上面印有星巴克logo，里面有很多咖啡豆\n说明（小字）：请在悲伤难过时服用，一日三次，一次两粒\n购买按钮 和 药丸颜色一致，下面价格：$9，请遵循医嘱酌情购买",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/46/example_happy_capsule.png",
      "type": "text_to_image"
    },
    {
      "title": "3D Q版大学拟人化形象",
      "author": "@dotey",
      "prompt": "给 {西北工业大学} 画一个拟人化的3D Q版美少女形象，体现学校 {航空航天航海三航} 特色\n\n*注意： 可替换 {西北工业大学} 括号内的学校名称和特色描述以生成不同大学的拟人化形象。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/45/example_university_mascot_npu.png",
      "type": "text_to_image"
    },
    {
      "title": "微型立体场景 (孙悟空三打白骨精)",
      "author": "@dotey",
      "prompt": "微型立体场景呈现，运用移轴摄影的技法，呈现出Q版【孙悟空三打白骨精】场景\n\n*注意： 提示词中括号内的【孙悟空三打白骨精】可以替换为其他中文场景，如“孙悟空大闹天宫”、“哪吒闹海”、“武松打虎”、“黛玉葬花”、“孙悟空三打白骨精”、“关云长过五关斩六将”等。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/41/example_miniature_journey_west.png",
      "type": "text_to_image"
    },
    {
      "title": "奇幻卡通插画",
      "author": "@dotey",
      "prompt": "一个卡通风格的角色，头部是一个带笑脸的电脑显示器，穿着手套和靴子，正开心地跳跃穿过一个发光的蓝色圆形传送门，背景是一片郁郁葱葱的奇幻森林景观。森林中细节丰富，有高大的树木、蘑菇、鲜花、宁静的河流、漂浮的岛屿，以及一个充满氛围的星夜天空，天空中有多个月亮。整体采用明亮鲜艳的色彩搭配柔和光效，风格为奇幻插画风。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/39/example_fantasy_computer_head_portal.png",
      "type": "text_to_image"
    },
    {
      "title": "手绘信息图卡片",
      "author": "@dotey",
      "prompt": "创作一张手绘风格的信息图卡片，比例为9:16竖版。卡片主题鲜明，背景为带有纸质肌理的米色或米白色，整体设计体现质朴、亲切的手绘美感。\n\n卡片上方以红黑相间、对比鲜明的大号毛笔草书字体突出标题，吸引视觉焦点。文字内容均采用中文草书，整体布局分为2至4个清晰的小节，每节以简短、精炼的中文短语表达核心要点。字体保持草书流畅的韵律感，既清晰可读又富有艺术气息。周边适当留白。\n\n卡片中点缀简单、有趣的手绘插画或图标，例如人物或象征符号，以增强视觉吸引力，引发读者思考与共鸣。整体布局注意视觉平衡，预留足够的空白空间，确保画面简洁明了，易于阅读和理解。\n“做 IP 是长期复利\n坚持每日更新，肯定会有结果，因为 99% 都坚持不了的！”",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/38/example_hand_drawn_infographic.png",
      "type": "text_to_image"
    },
    {
      "title": "柔和风格3D广告",
      "author": "@aziz4ai",
      "prompt": "一个柔和的3D卡通风格[品牌产品]雕塑，由光滑的粘土般纹理和鲜艳的柔和色彩制成，放置在简约的等距场景中，该场景与产品特性相得益彰，构图简洁，光线柔和，阴影微妙，产品徽标和三个词的口号清晰显示在下方。\n\n*注意： 可替换提示词中的 [品牌产品] 为具体的产品描述。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/37/pastel_power_3d_ads.png",
      "type": "text_to_image"
    },
    {
      "title": "极简主义 3D 插画 (Markdown 格式)",
      "author": "@dotey",
      "prompt": "画一个马桶：\n\n## 艺术风格简介：极简主义3D插画（Minimalist 3D Illustration）\n\n### 🎨 视觉元素（Visual Elements）\n\n#### 🟢 造型语言（Shape Language）\n- 圆润的边缘、平滑柔和的外形，采用简化几何造型。\n\n#### 🎨 色彩（Colors）\n- **主色调：** 柔和米色、浅灰色、暖橙色。\n- **强调色：** 暖橙色用于焦点元素。\n- **明暗处理：** 柔和渐变，平滑过渡，避免强烈的阴影和高光。\n\n#### 💡 光照（Lighting）\n- **类型：** 柔和、漫反射光照。\n- **光源方向：** 上方稍偏右。\n- **阴影风格：** 微妙且漫射，无锐利或高对比度的阴影。\n\n#### 🧱 材质（Materials）\n- **表面纹理：** 哑光、平滑的表面，带有微妙的明暗变化。\n- **反射性：** 低或无，避免明显的光泽。\n\n#### 🖼️ 构图（Composition）\n- **对象呈现：** 单一、居中的物体，周围留出大量负空间。\n- **视角：** 轻微倾斜视角，呈现适度的三维感，但无明显的景深效果。\n- **背景：** 纯色、低饱和度，与主体协调且不干扰视线。\n\n#### ✒️ 字体排版（Typography）\n- **字体风格：** 极简、无衬线字体。\n- **文字位置：** 左下角，尺寸小巧且不突出。\n- **字体颜色：** 灰色，与背景形成低对比度。\n\n#### 🖥️ 渲染风格（Rendering Style）\n- **技术手法：** 3D渲染，采用简化的低多边形风格。\n- **细节程度：** 中等细节，以形状和色彩为主，避免复杂纹理和细节。\n\n### 🎯 风格目标（Purpose）\n> 创建干净、美观的视觉效果，强调简洁、亲和和现代感。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/36/example_minimalist_3d_toilet_txt.png",
      "type": "text_to_image"
    },
    {
      "title": "毛茸茸南瓜灯",
      "author": "gizakdag",
      "prompt": "将一个简单平面的矢量图标 [🎃] 转化为柔软、立体、毛茸茸的可爱物体。整体造型被浓密的毛发完全覆盖，毛发质感极其真实，带有柔和的阴影。物体居中悬浮于干净的浅灰色背景中，轻盈漂浮。整体风格超现实，富有触感和现代感，带来舒适和俏皮的视觉感受。采用摄影棚级灯光，高分辨率渲染，比例为1:1。\n\n*注意： 中文提示词 by @dotey*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/35/example_fluffy_pumpkin.png",
      "type": "text_to_image"
    },
    {
      "title": "手绘信息图卡片",
      "author": "@dotey",
      "prompt": "创作一张手绘风格的信息图卡片，比例为9:16竖版。卡片主题鲜明，背景为带有纸质肌理的米色或米白色，整体设计体现质朴、亲切的手绘美感。\n\n卡片上方以红黑相间、对比鲜明的大号毛笔草书字体突出标题，吸引视觉焦点。文字内容均采用中文草书，整体布局分为2至4个清晰的小节，每节以简短、精炼的中文短语表达核心要点。字体保持草书流畅的韵律感，既清晰可读又富有艺术气息。\n\n卡片中点缀简单、有趣的手绘插画或图标，例如人物或象征符号，以增强视觉吸引力，引发读者思考与共鸣。\n整体布局注意视觉平衡，预留足够的空白空间，确保画面简洁明了，易于阅读和理解。\n\n<h1><span style=\"color:red\">「认知」</span>决定上限\n<span style=\"color:red\">「圈子」</span>决定机会</h1>\n- 你赚不到「认知」以外的钱，\n- 也遇不到「圈子」以外的机会。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/34/example_hand_drawn_infographic_cognition.png",
      "type": "text_to_image"
    },
    {
      "title": "折叠式纸雕立体绘本",
      "author": "@dotey",
      "prompt": "多层折叠式纸雕立体绘本，放在一张书桌上，背景纯净突出主题，绘本呈现出立体翻页书般的风格，比例为3:2横版。翻开的书页呈现【魔童版哪吒大战敖丙】的场景，所有元素皆可精细折叠组合，呈现出逼真细腻的纸张折叠质感；构图统一采用正面视角，整体视觉风格梦幻唯美，色彩缤纷绚丽，充满奇幻而生动的故事氛围。\n\n*注意： 请酌情修改中括号【】内的场景描述，也可以增加更多细节。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/32/3d_papercraft_popup_book.png",
      "type": "text_to_image"
    },
    {
      "title": "动漫贴纸集合",
      "author": "@richardchang",
      "prompt": "火影忍者贴纸",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/31/example_naruto_stickers.png",
      "type": "text_to_image"
    },
    {
      "title": "35mm 胶片风格飞岛",
      "author": "@dotey",
      "prompt": "35 毫米胶片风格的照片：莫斯科漂浮在天空中的飞行岛屿上。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/30/example_35mm_moscow_flying_island.png",
      "type": "text_to_image"
    },
    {
      "title": "极简主义 3D 插画",
      "author": "@0xdlk",
      "prompt": "使用以下 JSON 配置文件生成一个马桶：\n{\n  \"art_style_profile\": {\n    \"style_name\": \"Minimalist 3D Illustration\",\n    \"visual_elements\": {\n      \"shape_language\": \"Rounded edges, smooth and soft forms with simplified geometry\",\n      \"colors\": {\n        \"primary_palette\": [\"Soft beige, light gray, warm orange\"],\n        \"accent_colors\": [\"Warm orange for focal elements\"],\n        \"shading\": \"Soft gradients with smooth transitions, avoiding harsh shadows or highlights\"\n      },\n      \"lighting\": {\n        \"type\": \"Soft, diffused lighting\",\n        \"source_direction\": \"Above and slightly to the right\",\n        \"shadow_style\": \"Subtle and diffused, no sharp or high-contrast shadows\"\n      },\n      \"materials\": {\n        \"surface_texture\": \"Matte, smooth surfaces with subtle shading\",\n        \"reflectivity\": \"Low to none, avoiding glossiness\"\n      },\n      \"composition\": {\n        \"object_presentation\": \"Single, central object displayed in isolation with ample negative space\",\n        \"perspective\": \"Slightly angled, giving a three-dimensional feel without extreme depth\",\n        \"background\": \"Solid, muted color that complements the object without distraction\"\n      },\n      \"typography\": {\n        \"font_style\": \"Minimalistic, sans-serif\",\n        \"text_placement\": \"Bottom-left corner with small, subtle text\",\n        \"color\": \"Gray, low-contrast against the background\"\n      },\n      \"rendering_style\": {\n        \"technique\": \"3D render with simplified, low-poly aesthetics\",\n        \"detail_level\": \"Medium detail, focusing on form and color over texture or intricacy\"\n      }\n    },\n    \"purpose\": \"To create clean, aesthetically pleasing visuals that emphasize simplicity, approachability, and modernity.\"\n  }\n}\n\n*注意： 原提示词以 JSON 格式给出，JSON部分未翻译，请参考原文。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/25/example_minimalist_3d_toilet.png",
      "type": "text_to_image"
    },
    {
      "title": "小红书封面",
      "author": "@balconychy",
      "prompt": "画图：画一个小红书封面。\n要求：\n有足够的吸引力吸引用户点击；\n字体醒目，选择有个性的字体；\n文字大小按重要度分级，体现文案的逻辑结构；\n标题是普通文字的至少2倍；\n文字段落之间留白。\n只对要强调的文字用醒目色吸引用户注意；\n背景使用吸引眼球的图案（包括不限于纸张，记事本，微信聊天窗口，选择一种）\n使用合适的图标或图片增加视觉层次，但要减少干扰。\n\n文案：重磅！ChatGPT又变强了！\n多任务处理更牛✨\n编程能力更强💪\n创造力爆表🎨\n快来试试！\n\n图像9:16比例",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/22/example_notebook_promo.png",
      "type": "text_to_image"
    },
    {
      "title": "玩具盒中的国家立体模型",
      "author": "@TheRelianceAI",
      "prompt": "一张超写实的俯拍摄影作品，展示了一个米色纸板盒内的3D打印立体模型，盒盖由两只人手撑开。盒子内部展现了[国家名称]的微缩景观，包含标志性地标、地形、建筑、河流、植被以及大量微小精细的人物模型。该立体模型充满了鲜活且符合地理特征的元素，全部采用触感舒适、玩具般的风格，使用哑光3D打印纹理制作，并带有可见的打印层纹。在顶部，盒盖内侧用大号、色彩鲜艳的凸起塑料字母显示“[国家名称]”字样——每个字母颜色各异，均为亮色。光线温暖且具有电影感，突出了纹理和阴影，营造出一种真实感和魅力，仿佛观看者正在打开一个神奇的国家微缩版本。\n\n*注意： 请将提示词中的 `[国家名称]` 替换为具体的国家名称。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/19/country_diorama_in_toy_box.png",
      "type": "text_to_image"
    },
    {
      "title": "复古CRT电脑启动屏幕",
      "author": "@Gdgtify",
      "prompt": "复古CRT电脑启动屏幕，最终显示为[形状或标志]的ASCII艺术。\n\n*注意： 可替换提示词中的 [形状或标志] 为具体的形状或标志描述，例如上海天际线*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/17/retro_crt_computer_boot_screen.png",
      "type": "text_to_image"
    },
    {
      "title": "讽刺海报生成",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "为我生成讽刺海报：GPT 4o 狂卷，都别干图像AI了 还是送外卖吧",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/15/example_gpt_involution_poster.png",
      "type": "text_to_image"
    },
    {
      "title": "PS2 游戏封面 (GTA x Shrek)",
      "author": "@dotey",
      "prompt": "你能制作一个PS2游戏封面的图像吗？标题为《Grand Theft Auto: Far Far Away》。是一个设定在《怪物史瑞克》宇宙中的GTA风格游戏。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/11/example_ps2_gta_shrek.png",
      "type": "text_to_image"
    },
    {
      "title": "讽刺漫画生成",
      "author": "@dotey",
      "prompt": "一幅讽刺漫画风格的插画，采用复古美式漫画风格，背景是一个多层货架，货架上都是一样的红色棒球帽，帽子正面印有大字标语“MAKE AMERICA GREAT AGAIN”，帽侧贴着白色标签写着“MADE IN CHINA”，特写视角聚焦其中一顶红色棒球帽。画面下方有价格牌，原价“$50.00”被粗黑线X划掉，改为“$77.00”，色调为怀旧的土黄与暗红色调，阴影处理带有90年代复古印刷质感。整体构图风格夸张讽刺，具讽刺政治消费主义的意味。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/10/example_maga_hat_cartoon.png",
      "type": "text_to_image"
    },
    {
      "title": "极简未来主义海报",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "一张纵向（3∶4）4K 分辨率的极简未来主义展览海报，背景为超浅冷灰 #f4f4f4。\n\n海报中心有一枚流体 3D metaball，形态为【立体可口可乐经典汽水瓶】，材质磨砂玻璃并带细腻颗粒噪点。 流体渐变：Coca-Cola 红 #E41C23 → 珍珠白 #FFFFFF，呈现丝滑玻璃质感。\n\n高位 softbox 柔光照明，投射长而柔的彩色阴影与淡淡光晕。\n\n流体叠在文字之上，被遮挡的字母透过磨砂玻璃呈轻微高斯模糊。\n\n· 主标题 “Coca-Cola” 经典红色 logo 位于中部，被唯一的流体部分遮挡；被遮挡的字母透过磨砂玻璃呈轻微高斯模糊。\n\n· 副标题，Modern sans-serif 粗体全大写纯黑字体： “TASTE THE FEELING” 位于主标题下方，同样被流体局部覆盖并产生模糊，其余部分锐利。\n\n整体留白干净、构图平衡、焦点锐利、HDR 高动态范围。\n\n*注意： 提示词中的【立体可口可乐经典汽水瓶】可以替换为其他物品的描述，以生成不同主题的海报。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/9/minimalist_futurist_poster.png",
      "type": "text_to_image"
    },
    {
      "title": "个性化房间设计",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "为我生成我的房间设计（床、书架、沙发、绿植、电脑桌和电脑），墙上挂着绘画，窗外是城市夜景。可爱 3d 风格，c4d 渲染，轴测图。\n\n*注意： 原文提示词是根据 ChatGPT 的记忆内容为用户生成房间设计，此处稍作修改。请参考原文。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/7/example_personalized_room.png",
      "type": "text_to_image"
    },
    {
      "title": "复古宣传海报",
      "author": "@dotey",
      "prompt": "复古宣传海报风格，突出中文文字，背景为红黄放射状图案。画面中心位置有一位美丽的年轻女性，以精致复古风格绘制，面带微笑，气质优雅，具有亲和力。主题是GPT最新AI绘画服务的广告促销，强调‘惊爆价9.9/张’、‘适用各种场景、图像融合、局部重绘’、‘每张提交3次修改’、‘AI直出效果，无需修改’，底部醒目标注‘有意向点右下“我想要”’，右下角绘制一个手指点击按钮动作，左下角展示OpenAI标志。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/3/example_vintage_poster.png",
      "type": "text_to_image"
    },
    {
      "title": "色轮徽标",
      "author": "OpenAI",
      "prompt": "创建一幅高质量的 3D 渲染插图，主体为一个色轮徽标：八片对称的花瓣状叶片围成完美的圆形花朵图案。每片叶片呈半透明彩色玻璃质感，采用柔和的粉彩色调：粉、橙、黄、绿、蓝、紫。花瓣略有重叠，在交汇处形成细腻的渐变过渡。背景为平整、浅色的表面，均匀柔光照明，整体呈现现代、精致且专业的视觉效果。不要包含任何文字。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/color-wheel.png",
      "type": "text_to_image"
    },
    {
      "title": "极简家具照片",
      "author": "OpenAI",
      "prompt": "根据以下提示生成图片：一张 {item} 的照片，置于白色背景上，受日本极简设计原则启发。{item} 体现“少即是多”的理念，强调简洁与功能性；原木饰面凸显木纹之美。\n\n*使用备注：此提示包含占位符 {item}，生成前请替换为具体值。案例图片依次使用餐椅 (dining chair), 水果碗 (fruit bowl), 音箱 (speaker), 长凳 (bench)。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/furniture-poster.png",
      "type": "text_to_image"
    },
    {
      "title": "3D 等距城市模拟视图",
      "author": "OpenAI",
      "prompt": "为我的城市模拟游戏生成一幅超写实 3D 岛屿城市鸟瞰图：展示市中心的规则街网、车辆与行人。创建逼真的办公楼、警察局、消防站、港口；白天晴朗光照；确保街道与建筑几何符合等距投影，纹理与光照真实。加入棕榈树与公园。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/3d-city.png",
      "type": "text_to_image"
    },
    {
      "title": "吹制玻璃音箱",
      "author": "OpenAI",
      "prompt": "设计一款极简家用音箱，材质为玻璃，形态应如吹制玻璃般有机且通透，可见内部线路与组件。音箱安装在约 3 英尺高的落地支架上，置于白墙混凝土地面空间内。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/glass-speaker.png",
      "type": "text_to_image"
    },
    {
      "title": "京都旅行指南封面",
      "author": "OpenAI",
      "prompt": "为旅行指南《Discover Kyoto》设计一款美观、吸引人的封面：突出京都标志性与文化特色，例如宁静的寺庙、传统木结构建筑、樱花或塔影。使用高级而温馨的配色。显著展示标题 “Discover Kyoto”，并以精致排版加入副标题：“An Insider’s Guide to Japan's Cultural Heart”。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/kyoto-poster.png",
      "type": "text_to_image"
    },
    {
      "title": "生活方式杂志封面（Urban Pulse）",
      "author": "OpenAI",
      "prompt": "为生活方式杂志 “Urban Pulse” 设计一款专业且视觉吸引人的封面。清晰加入以下文章标题：\n“10 Hidden Cafés You'll Love in NYC”\n“Minimalist Apartments: Small Spaces, Big Ideas”\n“Exclusive Interview: Behind the Scenes with Indie Band Echo District”\n使用当代排版、鲜明色彩，并包含一张人物站在城市背景前的吸睛主图。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/magazine-cover.png",
      "type": "text_to_image"
    },
    {
      "title": "意式咖啡馆菜单设计",
      "author": "OpenAI",
      "prompt": "为温馨的意大利咖啡馆 “Café Roma” 设计一张干净迷人的单页菜单。顶部以优雅亲和的字体突出咖啡馆名称；列出恰好五道菜品，并在每个菜名旁放置清晰、有吸引力的插图。\n菜品与描述：\n1. Margherita Pizza: Thin-crust pizza topped with fresh tomato sauce, mozzarella, basil leaves, and a drizzle of olive oil.\n2. Spaghetti Carbonara: Classic spaghetti tossed in creamy egg sauce with crispy pancetta, pecorino cheese, and black pepper.\n3. Caprese Salad: Slices of fresh mozzarella and ripe tomatoes, garnished with basil, balsamic glaze, and olive oil.\n4. Tiramisu: Espresso-soaked ladyfingers layered with creamy mascarpone, dusted with cocoa powder.\n5. Affogato: Creamy vanilla gelato served with a freshly brewed shot of espresso poured tableside.\n设计元素：整页以传统意式藤蔓/花纹边框环绕；使用奶油色、橄榄绿与红棕点缀的暖色调；插图风格统一、手绘或水彩；排版清晰分级，价格以细小字体呈现。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/italian-menu.png",
      "type": "text_to_image"
    },
    {
      "title": "鳄梨酱食材排布",
      "author": "OpenAI",
      "prompt": "创建一张照片级写实图像，清晰展示制作新鲜自制鳄梨酱所需的全部食材，摆放整齐且比例准确。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/guacamole-recipe.png",
      "type": "text_to_image"
    },
    {
      "title": "游戏角色精灵表(Sprite Sheet)",
      "author": "OpenAI",
      "prompt": "创建一幅精细的、方形的像素艺术图像，展示一位奇幻战士角色身着三套不同的装备，每套装备占单独的一横行。每行恰好包含六个姿势：站立姿态、挥剑攻击、施放魔法、持盾防御格挡、奔跑 和 胜利庆祝。\n顶行（初级装备 - 大地色系）： 采用暗棕色和绿色的简易皮革与布制盔甲、铁剑、基础木盾。\n中行（骑士装备 - 银蓝系）： 带有银色镶边和深蓝色点缀的抛光钢甲、带闭合面罩的头盔、装饰性长剑、华丽鸢盾、飘逸的蓝色斗篷。\n底行（神话装备 - 金红系）： 镶嵌着发光绯红宝石与火焰装饰的华丽金色盔甲、燃烧的魔法剑、半透明绯红色魔法盾，并有微光环绕。\n确保战士的身材比例和面部特征在所有姿势和装备套装中保持一致。每套装备都应清晰展示其在设计复杂度和视觉吸引力上的进阶。\n单独渲染每个姿势，背景透明，并将其整齐排列在一个方形构图内的三个横行中。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/sprites.png",
      "type": "text_to_image"
    },
    {
      "title": "鲸鱼科普海报",
      "author": "OpenAI",
      "prompt": "创建一张可爱、视觉吸引力强的科普海报，展示多种鲸鱼物种。清晰标注每种鲸鱼的名称，并加入气泡、珊瑚、鱼群等趣味海底元素，整体采用经典动画电影般的友好卡通风格。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/whales-poster.png",
      "type": "text_to_image"
    },
    {
      "title": "蛋白棒包装（GPU Crunch）",
      "author": "OpenAI",
      "prompt": "为科技灵感蛋白棒 “GPU Crunch” 设计一款活力十足的包装：用简洁线形图标突出黑巧克力块、烤杏仁、全谷物燕麦等配料；小号文字展示营养信息（“12g Protein”“4g Sugar”“20g Carbs”）。将包装现实感地置于白色背景中央，并在四周摆放水瓶、毛巾、耳机等健身装备，以暗示健康与高科技性能；整体采用瑞士极简主义排版：纯色背景叠加黑色图形与文字。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/ad-gpu-crunch.png",
      "type": "text_to_image"
    },
    {
      "title": "独立专辑封面（Neon Dusk）",
      "author": "OpenAI",
      "prompt": "为独立电子专辑 “Neon Dusk” 设计一张风格鲜明、视觉冲击力强的封面：音乐融合氛围合成器、梦幻人声与节奏电子，营造怀旧而未来的深夜城市氛围。封面应突出专辑标题 “Neon Dusk”，并在下方放置艺术家名 “Echo District”；城市景观包含 80 年代跑车、霓虹灯映照的迈阿密剪影及前景火烈鸟。排版使用 Avant Garde Gothic 字体，并在适当处使用连字。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/album-cover.png",
      "type": "text_to_image"
    },
    {
      "title": "果冻外星角色渲染",
      "author": "OpenAI",
      "prompt": "渲染此角色的逼真图像：\n团状外星角色设定\n名称： Glorptak（或昵称：“Glorp”）\n视觉外观\n体型： 无定形且呈凝胶状。整体轮廓类似泪珠或融化的棉花糖，会随着时间轻微变形。情绪激动或受惊时会挤压和拉伸。\n材质纹理： 半透明、生物发光的粘液 (goo)，具有果冻般的晃动感。在交流或快速移动时表面偶尔会起波纹。\n色彩方案：\n基色： 虹彩薰衣草色或海沫绿\n点缀： 表层下有霓虹粉、电光蓝或金黄色的发光脉络。\n基于情绪的颜色变化： （愤怒=暗红，喜悦=亮水绿，恐惧=淡灰）\n面部特征：\n眼睛： 体内有 3–5 个不对称的漂浮眼球，可独立旋转或眨动。\n嘴巴： 可选——在说话或表达情绪时，表面会显现出波纹状的新月形。\n无可见鼻子或耳朵； 通过嵌入粘液中的振动敏感接收器感知。\n四肢： 默认无，但在需要互动或移动时可伸出伪足（触手状肢体）。可显现出临时的脚或手。\n\n移动与行为\n移动方式：\n滑行、弹跳和滚动。\n可通过吸附力粘在墙壁和天花板上。受惊时可能会变扁并快速渗走。\n习性：\n即使静止时也不断扭动或晃动。\n留下无害的发光粘液轨迹。\n出于好奇，倾向于暂时吸收附近的小物体。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/alien.png",
      "type": "text_to_image"
    },
    {
      "title": "水瓶形态探索",
      "author": "OpenAI",
      "prompt": "我在设计一款水瓶，请帮忙探索新造型：创建一张透明水瓶的超写实 3D 渲染图，设计灵感源自 {concept}。在白色背景上展示完整瓶身，瓶内注满清水。\n\n*使用备注：提示包含占位符 {concept}，生成前请替换为具体值。案例图片依次使用瀑布 (waterfall), 流线型跑车 (aerodynamic sports car), 漩涡 (whirlpool), 冰川 (glacier)。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/bottle-poster.png",
      "type": "text_to_image"
    },
    {
      "title": "奇幻梦境环境",
      "author": "OpenAI",
      "prompt": "In a sprawling ancient forest illuminated by the golden hues of a low-hanging twilight sun, a wide clearing opens into a surreal dreamscape that seems to blend fantasy and forgotten mythology. At the heart of this clearing stands an enormous, weathered tree with a trunk as wide as a small house and bark etched with glowing, ancient runes pulsating faintly in shades of aquamarine and violet. The tree’s branches stretch skyward like arms, covered in bioluminescent leaves that shimmer in a gradient of emerald green to sapphire blue, flickering gently as if breathing with the rhythm of the earth itself. Around the base of the tree lies a circular pool of crystalline water, unnaturally still, reflecting not just the tree above it, but also constellations that don’t exist in our sky—stars shaped like animals, celestial figures, and mysterious glyphs. A narrow stone path, cracked and overgrown with moss and delicate glowing fungi, leads from the edge of the forest to the pool, lined with floating lanterns suspended in midair without any visible support, each encasing a softly glowing flame of a different color. Along the edges of the forest clearing, the trees seem to lean inward, their trunks twisted like ancient dancers, and their leaves whispering secrets in a wind that can be heard but not felt. Tall stalks of silvery grass sway under the influence of a phantom breeze, and clusters of flowers with translucent petals release faint motes of light into the air, like floating pollen that sparkles and twirls as it rises upward. To the right of the tree, a grand stone arch partially buried in vines stands like a portal, its frame adorned with sculpted reliefs of mythical creatures: winged wolves, twin-tailed phoenixes, and enormous turtles with cities on their backs. Beyond the arch shimmers a misty threshold, behind which lies the suggestion of an entirely different realm—its colors slightly more saturated, its sky a strange teal hue with three moons visible in the clouds. A lone traveler stands before this arch, cloaked in flowing robes of deep indigo lined with stardust thread, their hood down to reveal glowing eyes that mirror the reflection in the pool. They carry a long, ornate staff, topped with a cluster of floating crystals that orbit one another slowly, humming with magic. Ahead of the traveler is a small floating companion creature, resembling a cross between a jellyfish and a hummingbird, with translucent wings and tendrils that pulse in rhythm with the traveler’s heartbeat. In the sky above, the clouds swirl in painterly strokes of lavender and peach, pierced occasionally by rays of sunlight that look more like golden waterfalls descending from the heavens. Several large, floating islands drift lazily through the air, each one covered in its own miniature ecosystem: one holds a temple ruin with hanging gardens spilling over its cliffs, another is blanketed in snow and ice with a glowing aurora snaking above it, and yet another contains a small lake with inverted waterfalls that flow upward into the sky. Flocks of gigantic birds with opalescent feathers circle around these islands, their wings leaving shimmering trails behind them as if tearing through the fabric of reality. Occasionally, one can spot a flying whale in the distance, its skin like polished stone, adorned with runes that light up when it sings its deep, resonant song that echoes through the clouds. Closer to the ground, mythical animals roam freely. A unicorn made of mist sips from the crystal pool, its reflection showing a completely different creature—a shadowy stag with fiery antlers. Nearby, a fox with an ethereal tail lounges atop a moss-covered rock, each tail flickering with a different element—flame, water, ice, lightning, smoke, shadow, wind, light, and crystal. Mushrooms with tiny eyes peek from under leaves, while trees occasionally blink as if watching the scene unfold. A choir of unseen voices hums an otherworldly melody that resonates with the air, causing particles of light to float upward in gentle spirals, like visualized sound. In the background, barely visible beyond the treeline, towers rise in the distance, seemingly grown from the land rather than built—crystalline spires twisted like seashells, glowing from within and surrounded by spiraling rings of floating stone. Between them, serpentine dragons fly in lazy arcs, their scales reflecting the shifting colors of the sky, and their breath leaving trails of fog in the air. Every few moments, a ripple of magic pulses through the land, subtly shifting the hues and lighting of the entire environment, as if the world is being constantly re-rendered in real time by an unseen painter. This entire scene exists in a liminal space—neither day nor night, neither real nor imagined, a fusion of the magical and the natural, the fantastical and the familiar. The palette of the image should include deeply saturated jewel tones for the magical elements—sapphire, emerald, amethyst, and ruby—while the natural elements lean toward warm dusk tones—burnished orange, soft pink, and rich earth brown. The overall composition should feel painterly yet hyper-detailed, with textures that could be touched and lighting that changes dynamically across the image, creating depth, contrast, and a sense of wonder. Everything should feel alive: light sources flicker and shift, plants gently sway, and magical energy crackles faintly in the air.\n\n> 概要：描绘一处黄昏古林中的奇幻梦境般的空地。核心是一棵巨大的、带有发光符文的古树，下方是映照着奇异星空的神秘水池。场景中布满了漂浮的灯笼、发光植物和神话生物（如薄雾独角兽、元素尾狐狸）。一位身着华服、携带法杖的孤独旅者及其漂浮同伴，正准备通过一个饰有神兽浮雕的古老石拱门（可能通往异世界）。天空中漂浮着带有建筑或奇景的岛屿，以及巨大的飞鸟和飞鲸。整个画面融合了魔法与自然，细节极其丰富，光影动态变化，色彩绚烂（魔法元素用宝石色调，自然元素用暖暮色调），营造出一种生机勃勃、介于现实与想象之间的超现实氛围。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/game-design.png",
      "type": "text_to_image"
    },
    {
      "title": "T-恤效果图 (mockup)",
      "author": "OpenAI",
      "prompt": "创建一件印有 “I'm silently judging your font choice” 的 T 恤，并加入细腻俏皮的设计元素。在同一张图中展示男、女模特各穿一件，且两件 T 恤配色不同。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/t-shirts.png",
      "type": "text_to_image"
    },
    {
      "title": "匹克球拍图形设计",
      "author": "OpenAI",
      "prompt": "为匹克球拍 “The Pickled Pro” 设计一款活力十足、趣味丰富的图形：\n正面视角：展示大胆配色、俏皮几何图案并融入球拍名称；\n侧面视角：突出符合人体工学的舒适握柄、轻量纤薄结构、纹理面板（提升旋转）及耐用边缘保护。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/ad-pickle.png",
      "type": "text_to_image"
    },
    {
      "title": "马跳跃动画关键帧",
      "author": "OpenAI",
      "prompt": "你是一名动画助手：请创建一张包含 4 个关键帧的马匹跳跃动画序列，输出方形图像并确保所有帧均在画面内。马匹以单线铅笔勾勒、细节极简，解剖结构准确。\n动作顺序：\n1. 起跳\n2. 跳跃最高点\n3. 正在落地\n4. 完成着陆",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/animation.png",
      "type": "text_to_image"
    },
    {
      "title": "无缝平铺纺织图案",
      "author": "OpenAI",
      "prompt": "以 {style} 传统风格创建一款无缝平铺（repeatable）纺织图案。要求在水平与垂直拼接时自然衔接，无可见接缝。\n\n*使用备注： 提示包含占位符 {style}，生成前请替换为具体值。案例图片依次使用欧普艺术 (optical art / op-art), Shweshwe (南非、莱索托) (Shweshwe (south africa, lesotho)), 几何包豪斯 (geometric bauhaus), 点彩艺术 (pointillist art)。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/patterns-poster.png",
      "type": "text_to_image"
    },
    {
      "title": "玻璃花瓶设计（琥珀球体）",
      "author": "OpenAI",
      "prompt": "拍摄一只玻璃花瓶的照片：\n材质: 琥珀／橙色玻璃；\n比例: 垂直向上，类似玻璃水瓶；\n形态: 多个球体逐级变小并连接成整体，上端开口极窄；\n展示: 白色背景，写实渲染，方形图像。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/vase.png",
      "type": "text_to_image"
    },
    {
      "title": "中世纪体素建筑精灵图",
      "author": "OpenAI",
      "prompt": "为我的中世纪即时战略游戏创建四栋建筑：教堂、风车、城堡、市场。图片分为四格，每栋建筑占据一格，背景透明；使用超写实体素风格，确保具有深度感、真实光照和丰富细节；配色需符合游戏的中世纪主题。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/buildings-sprite.png",
      "type": "text_to_image"
    },
    {
      "title": "回针教程（二战海报风）",
      "author": "OpenAI",
      "prompt": "以英国二战宣传海报风格，分步骤可视化回针（backstitch）的制作过程，并在每幅图下方加入简洁说明。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/backstitch-tutorial.png",
      "type": "text_to_image"
    },
    {
      "title": "透明 3D 图标",
      "author": "OpenAI",
      "prompt": "创建一个 {iconName} 的超写实 3D 图标：漂浮于白色背景上，应清晰传达主题；完全透明、轻盈且高度写实。\n\n*使用备注： 提示包含占位符 {iconName}，生成前请替换为具体值。案例图片依次使用日历 (calendar), 文件 (file), 锁 (lock), 邮件 (mail)。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/icons-poster.png",
      "type": "text_to_image"
    }
  ],
  "image_to_image": [
    {
      "title": "插画变手办",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "将这张照片变成角色手办。在它后面放置一个印有角色图像的盒子，盒子上有一台电脑显示Blender建模过程。在盒子前面添加一个圆形塑料底座，角色手办站在上面。如果可能的话，将场景设置在室内",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case1/output0.jpg",
      "type": "image_to_image"
    },
    {
      "title": "根据地图箭头生成地面视角图片",
      "author": "@tokumin",
      "prompt": "画出红色箭头看到的内容\n/\n从红色圆圈沿箭头方向画出真实世界的视角",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case2/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "真实世界的AR信息化",
      "author": "@bilawalsidhu",
      "prompt": "你是一个基于位置的AR体验生成器。在这张图像中突出显示[兴趣点]并标注相关信息\n\n> [!NOTE]\n> **需要在提示词中 [POI] 输入需要标注的兴趣点**",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case3/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "分离出3D建筑/制作等距模型",
      "author": "@Zieeett",
      "prompt": "将图像制作成白天和等距视图[仅限建筑]\n\n> [!NOTE]\n> **根据需要修改 [方括号] 内的信息（可以设置为车辆、人物等）**",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case4/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "不同时代自己的照片",
      "author": "@AmirMushich",
      "prompt": "将角色的风格改为[1970]年代的经典[男性]风格\n\n添加[长卷发]，\n[长胡子]，\n将背景改为标志性的[加州夏季风景]\n\n不要改变角色的面部\n\n> [!NOTE]\n> **将 [方括号] 中的文字改为你的时代和细节信息**",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case5/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "多参考图像生成",
      "author": "@MrDavids1",
      "prompt": "一个模特摆姿势靠在粉色宝马车上。她穿着以下物品，场景背景是浅灰色。绿色外星人是一个钥匙扣，挂在粉色手提包上。模特肩上还有一只粉色鹦鹉。旁边坐着一只戴着粉色项圈和金色耳机的哈巴狗\n\n> [!NOTE]\n> **提示词需要详细描述和包含多个参考对象**",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case6/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "自动修图",
      "author": "@op7418",
      "prompt": "这张照片很无聊很平淡。增强它！增加对比度，提升色彩，改善光线使其更丰富，你可以裁剪和删除影响构图的细节",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case7/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "手绘图控制多角色姿态",
      "author": "@op7418",
      "prompt": "让这两个角色使用图3的姿势进行战斗。添加适当的视觉背景和场景互动，生成图像比例为16:9",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case8/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "跨视角图像生成",
      "author": "@op7418",
      "prompt": "将照片转换为俯视角度并标记摄影师的位置",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case9/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "定制人物贴纸",
      "author": "@op7418",
      "prompt": "帮我将角色变成类似图2的白色轮廓贴纸。角色需要转换成网页插画风格，并添加一个描述图1的俏皮白色轮廓短语",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case10/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "动漫转真人Coser",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "生成一个女孩cosplay这张插画的照片，背景设置在Comiket",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case11/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "生成角色设定",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "为我生成人物的角色设定（Character Design）\n\n比例设定（不同身高对比、头身比等）\n\n三视图（正面、侧面、背面）\n\n表情设定（Expression Sheet） → 就是你发的那种图\n\n动作设定（Pose Sheet） → 各种常见姿势\n\n服装设定（Costume Design）",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case12/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "色卡线稿上色",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "准确使用图2色卡为图1人物上色",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case13/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "更换多种发型",
      "author": "@balconychy",
      "prompt": "以九宫格的方式生成这个人不同发型的头像",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case15/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "定制大理石雕塑",
      "author": "@umesh_ai",
      "prompt": "一张超详细的图像中主体雕塑的写实图像，由闪亮的大理石制成。雕塑应展示光滑反光的大理石表面，强调其光泽和艺术工艺。设计优雅，突出大理石的美丽和深度。图像中的光线应增强雕塑的轮廓和纹理，创造出视觉上令人惊叹和迷人的效果",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case17/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "根据食材做菜",
      "author": "@Gdgtify",
      "prompt": "用这些食材为我做一顿美味的午餐，放在盘子里，盘子的特写视图，移除其他盘子和食材",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case18/output1.jpg",
      "type": "image_to_image"
    },
    {
      "title": "数学题推理",
      "author": "@Gorden Sun",
      "prompt": "根据问题将问题的答案写在对应的位置上",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case19/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "旧照片上色",
      "author": "@GeminiApp",
      "prompt": "修复并为这张照片上色",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case20/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "OOTD穿搭",
      "author": "@302.AI",
      "prompt": "选择图1中的人，让他们穿上图2中的所有服装和配饰。在户外拍摄一系列写实的OOTD风格照片，使用自然光线，时尚的街头风格，清晰的全身镜头。保持图1中人物的身份和姿势，但以连贯时尚的方式展示图2中的完整服装和配饰",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case21/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "人物换衣",
      "author": "@skirano",
      "prompt": "将输入图像中人物的服装替换为参考图像中显示的目标服装。保持人物的姿势、面部表情、背景和整体真实感不变。让新服装看起来自然、合身，并与光线和阴影保持一致。不要改变人物的身份或环境——只改变衣服",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case22/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "多视图结果生成",
      "author": "@Error_HTTP_404",
      "prompt": "在白色背景上生成前、后、左、右、上、下视图。均匀分布。一致的主体。等距透视等效",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case23/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "电影分镜",
      "author": "@GeminiApp",
      "prompt": "用这两个角色创作一个令人上瘾的12部分故事，包含12张图像，讲述经典的黑色电影侦探故事。故事关于他们寻找线索并最终发现的失落的宝藏。整个故事充满刺激，有情感的高潮和低谷，以精彩的转折和高潮结尾。不要在图像中包含任何文字或文本，纯粹通过图像本身讲述故事",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case24/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "人物姿势修改",
      "author": "@arrakis_ai",
      "prompt": "让图片中的人直视前方",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case25/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "线稿图生成图像",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "将图一人物换成图二姿势，专业摄影棚拍摄",
      "thumbnail": "https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case26/output.jpg",
      "type": "image_to_image"
    },
    {
      "title": "制作照片中人物的玩具",
      "author": "@egeberkina",
      "prompt": "Create a toy of the person in the photo. Let it be an\naction figure. Next to the figure, there should be the toy's\nequipment like a football and football boot and world cup. Also,\non top of the box, write 'LIONEL MESSI and underneath it,\n'GOAT'.Visualize this in a realistic way.\n\n中文提示词：\n制作照片中人物的玩具，做成一个可动人偶。人偶旁边要有玩具装备，比如足球、足球鞋和世界杯奖杯。另外，在包装盒顶部写上“LIONEL MESSI”，其下方写上“GOAT”。请以写实的风格呈现这一画面。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/280.jpeg",
      "type": "image_to_image"
    },
    {
      "title": "3D卡通钥匙扣",
      "author": "@miilesus",
      "prompt": "Create a cute 3D cartoon keychain version of the person in the uploaded photo. Transform the face and pose into a soft, simplified toy-like figure with a silicone-like smooth texture and pastel colors. Add a name tag that says \"[NAME]\" attached to the keychain in a playful rounded font. No background, minimal shadows. Toy product design for keychain format.\n\n中文提示词：\n将上传照片中的人物制作成可爱的3D卡通钥匙扣版本。将面部和姿势转变为柔和、简化的玩具般造型，具有类似硅胶的光滑质感和柔和的粉彩色调。添加一个写有“[姓名]”的姓名牌，用俏皮的圆体字附着在钥匙扣上。无背景，阴影极少。适合钥匙扣格式的玩具产品设计。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/278.png",
      "type": "image_to_image"
    },
    {
      "title": "超现实几何艺术风格的数字插画",
      "author": "@fy360593",
      "prompt": "Transform this image into a digital illustration with a surreal, geometric art style. Apply glitch textures, abstract shapes, and cinematic composition. Use the original photo’s lighting and color palette to guide the atmosphere, while reimagining the scene in a stylized, dreamy, retro-futuristic way.\n\n中文提示词：\n将这张图片转换为具有超现实几何艺术风格的数字插画。应用故障纹理、抽象形状和电影化构图。以原始照片的光线和色彩为基调来营造氛围，同时以一种风格化、梦幻且复古未来主义的方式重新构想这个场景。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/271.png",
      "type": "image_to_image"
    },
    {
      "title": "低多边形马赛克风格",
      "author": "@fy360593",
      "prompt": "Transform this image into a refined low-poly mosaic style. Preserve the original structure and recognizable details, especially facial features and contours. Use small, high-density polygons to maintain clarity and identity while creating a crystalline, faceted look. Keep the original color palette for a harmonious and natural aesthetic. Avoid altering or adding new elements.\n\n中文提示词：\n将这张图片转换为精致的低多边形马赛克风格。保留原始结构和可识别的细节，尤其是面部特征和轮廓。使用小而密集的多边形，在保持清晰度和辨识度的同时，营造出水晶般的多面效果。保留原始色调，以获得和谐自然的美感。避免修改或添加新元素。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/263.jpeg",
      "type": "image_to_image"
    },
    {
      "title": "街头顽童（Gorillaz）风格插画",
      "author": "@azed_ai",
      "prompt": "Restyle this image into a gritty Gorillaz-style illustration, bold thick black outlines, sharp angular edges, flat expressive lighting, stylized high-contrast shadows, dirty distressed surface textures, muted color palette: washed-out teals, olive greens, rusty reds, mustard yellows, dusty browns, raw grungy urban atmosphere, comic book flatness mixed with painterly grit, hand-drawn finish with faded gradients, graphic novel aesthetic\nwith a rebellious, animated tone, dark stylish tone, full of attitude.\n\n中文提示词：\n将这张图片重新设计成粗粝的街头顽童（Gorillaz）风格插画，采用粗重的黑色轮廓线、锐利的棱角、扁平化的富有表现力的光线、风格化的高对比度阴影、粗糙破旧的表面纹理；色彩搭配柔和暗淡：褪色的蓝绿色、橄榄绿、锈红色、芥末黄、土褐色；营造出原始粗粝的都市氛围，融合漫画的扁平化与绘画的颗粒感，带有褪色渐变效果的手绘质感，呈现出漫画小说的美学风格，整体基调叛逆、生动且时尚暗黑，充满个性。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/262.png",
      "type": "image_to_image"
    },
    {
      "title": "20世纪20年代亚瑟·拉克姆风格的童话插画",
      "author": "@vkuoo",
      "prompt": "Transform this image into a 1920s fairy tale illustration in the style of Arthur Rackham. Use muted watercolor tones and intricate ink linework. Fill the scene with whimsical forest creatures, twisted tree branches, and hidden magical objects. The overall tone should be mysterious, enchanting, and slightly eerie. Add handwritten calligraphy-style captions and riddles.\n\n中文提示词：\n将这张图片转换成20世纪20年代亚瑟·拉克姆风格的童话插画。采用柔和的水彩色调和精致的墨水线条。场景中要充满奇幻的森林生物、扭曲的树枝和隐藏的魔法物品。整体基调应神秘、迷人且略带诡异。添加手写书法风格的说明文字和谜语。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/260.png",
      "type": "image_to_image"
    },
    {
      "title": "20世纪30年代弗莱舍工作室风格的动画",
      "author": "@vkuoo",
      "prompt": "Transform this image into a 1930s animation storyboard in the style of Fleischer Studios. Use greyscale with expressive inky shading and rubber-hose limbs. Surround the scene with anthropomorphic objects, bouncy motion lines, and slapstick action. The overall tone should be jazzy, lively, and playful. Add hand-lettered sound effects and quirky dialogue signs.\n\n中文提示词：\n将这张图片转换成20世纪30年代弗莱舍工作室风格的动画分镜。采用灰度色调，搭配富有表现力的墨色阴影和“橡胶管”式肢体线条。场景中要加入拟人化的物体、富有弹性的运动线和闹剧式的动作。整体基调应充满爵士感、活力与趣味。添加手写风格的音效文字和古怪的对话标牌。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/259.png",
      "type": "image_to_image"
    },
    {
      "title": "20世纪50年代的海报",
      "author": "@vkuoo",
      "prompt": "Transform this image into a 1950s poster in the style of mid-century modern graphic designers. Use flat, geometric color blocks with strong typographic elements.  The overall tone should be optimistic, nostalgic, and promotional. Add bold location labels and promotional slogans.\n\n中文提示词：\n将这张图片转换成20世纪50年代的海报，风格参考中世纪现代平面设计师的作品。采用扁平的几何色块，搭配醒目的排版元素。整体基调应乐观、怀旧且具有宣传性。添加醒目的地点标签和宣传标语。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/258.png",
      "type": "image_to_image"
    },
    {
      "title": "透明蜂窝状变形",
      "author": "@miilesus",
      "prompt": "{\n  \"object\": \"OBJECT_NAME\",\n  \"style\": \"Transparent Honeycomb Transformation\",\n  \"description\": \"Transform the object into a structure made entirely of crystallized golden honey with high transparency. The surface should be ultra-glossy, semi-liquid, and light-reflective, with defined yet see-through hexagonal honeycomb patterns. Parts of the object should allow light to pass through, revealing inner layers and structure. Include gentle honey drips for realism.\",\n  \"material\": {\n    \"primary\": \"Crystal-clear amber honey\",\n    \"secondary\": \"Translucent honeycomb cells\"\n  },\n  \"texture\": {\n    \"surface\": \"Ultra glossy and semi-liquid\",\n    \"pattern\": \"See-through hexagonal honeycomb\",\n    \"drips\": true\n  },\n  \"effects\": {\n    \"translucency\": \"highly translucent\",\n    \"internal_glow\": \"Soft warm light from within\",\n    \"emblem\": \"Delicate bee icon subtly embedded in the structure\"\n  },\n  \"presentation\": {\n    \"background\": \"Clean white or soft gradient\",\n    \"lighting\": \"Backlit with soft diffusion to enhance translucency\",\n    \"floating\": true,\n    \"format\": \"Square\"\n  }\n}\n\n中文提示词：\n{\n  \"物体\": \"OBJECT_NAME\",\n  \"风格\": \"透明蜂窝状变形\",\n  \"描述\": \"将该物体转变为由完全结晶的金色蜂蜜制成的结构，具有高度透明度。表面应呈现超 glossy 质感、半液态状态和反光效果，带有清晰可辨且透明的六边形蜂窝图案。物体的部分区域应允许光线穿透，以展现内部层次和结构。为增强真实感，需加入自然垂落的蜂蜜滴。\",\n  \"材质\": {\n    \"主要材质\": \"清澈透明的琥珀色蜂蜜\",\n    \"次要材质\": \"半透明的蜂窝单元\"\n  },\n  \"纹理\": {\n    \"表面\": \"超 glossy 且呈半液态\",\n    \"图案\": \"透明的六边形蜂窝\",\n    \"滴落效果\": true\n  },\n  \"特效\": {\n    \"半透明性\": \"高度半透明\",\n    \"内部光晕\": \"源自内部的柔和暖光\",\n    \"标志\": \"精致的蜜蜂图标巧妙嵌入结构中\"\n  },\n  \"呈现方式\": {\n    \"背景\": \"纯净白色或柔和渐变\",\n    \"光线\": \"背光搭配柔和漫射效果，以增强半透明感\",\n    \"悬浮效果\": true,\n    \"格式\": \"正方形\"\n  }\n}",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/257.png",
      "type": "image_to_image"
    },
    {
      "title": "漂浮玻璃霓虹3D",
      "author": "@egeberkina",
      "prompt": "retexture the image attached based on the JSON below:\n\n{\n  \"style_name\": \"Floating Glassy Neon 3D\",\n  \"retexture_mode\": \"shape_lock\",\n  \"object_analysis\": {\n    \"preserve_silhouette\": true,\n    \"geometry_sensitive_mapping\": true,\n    \"detail_retention\": \"maintain contours, volumes, and layering\"\n  },\n  \"material_properties\": {\n    \"base_material\": \"translucent neon glass-gel\",\n    \"surface_finish\": \"semi-gloss with soft glow edges\",\n    \"transparency\": \"high, with soft light refraction\",\n    \"refraction\": \"gentle bend with subtle halo on curves\",\n    \"embedded_effects\": \"internal light scatter and edge neon glow\",\n    \"color_blend\": {\n      \"primary\": [\"aqua\", \"electric blue\", \"neon violet\"],\n      \"gradient_direction\": \"top-left to bottom-right\",\n      \"transition_smoothness\": \"very smooth\"\n    }\n  },\n  \"lighting\": {\n    \"type\": \"softbox HDRI\",\n    \"intensity\": \"soft and bright\",\n    \"source_direction\": \"overhead and slightly front\",\n    \"highlight_behavior\": \"gentle bloom with glass sparkle\"\n  },\n  \"shadow_behavior\": {\n    \"type\": \"floating contact shadow\",\n    \"appearance\": \"extremely soft, blurred ellipse\",\n    \"opacity\": 0.07,\n    \"distance_below_object\": \"moderate\",\n    \"color\": \"neutral gray\"\n  },\n  \"background\": {\n    \"type\": \"solid color\",\n    \"color\": \"#ffffff\",\n    \"glow_effect\": \"none\",\n    \"gradient\": \"none\"\n  },\n  \"rendering\": {\n    \"depth_of_field\": \"subtle with slight vignette\",\n    \"focus_point\": \"center of floating object\",\n    \"ambient_occlusion\": \"minimal to preserve light feel\",\n    \"render_engine\": \"3D stylized with light diffusion and high specular detail\",\n    \"camera_angle\": \"slightly above object, frontal\",\n    \"resolution\": \"very high for product branding\"\n  },\n  \"special_effects\": {\n    \"floating_behavior\": true,\n    \"visual_weightlessness\": true,\n    \"shadow_softness\": \"maximum\"\n  }\n}\n\n中文提示词：\n根据以下JSON对附加图片进行重新纹理处理：\n\n{\n  \"风格名称\": \"漂浮玻璃霓虹3D\",\n  \"重纹理模式\": \"形状锁定\",\n  \"对象分析\": {\n    \"保留轮廓\": true,\n    \"几何敏感映射\": true,\n    \"细节保留\": \"维持轮廓、体积和层次感\"\n  },\n  \"材质属性\": {\n    \"基础材质\": \"半透明霓虹玻璃胶\",\n    \"表面处理\": \"半光泽，边缘带有柔和光晕\",\n    \"透明度\": \"高，带有柔和的光折射\",\n    \"折射效果\": \"轻微弯曲，曲线处有微妙光晕\",\n    \"内置效果\": \"内部光散射和边缘霓虹发光\",\n    \"色彩混合\": {\n      \"主色\": [\"水绿色\", \"电蓝色\", \"霓虹紫\"],\n      \"渐变方向\": \"左上角至右下角\",\n      \"过渡平滑度\": \"非常平滑\"\n    }\n  },\n  \"光照\": {\n    \"类型\": \"柔光箱HDRI\",\n    \"强度\": \"柔和明亮\",\n    \"光源方向\": \" overhead 且略微偏前\",\n    \"高光表现\": \"柔和光晕，带有玻璃闪光\"\n  },\n  \"阴影表现\": {\n    \"类型\": \"漂浮接触阴影\",\n    \"外观\": \"极其柔和、模糊的椭圆形\",\n    \"不透明度\": 0.07,\n    \"物体下方距离\": \"适中\",\n    \"颜色\": \"中性灰\"\n  },\n  \"背景\": {\n    \"类型\": \"纯色\",\n    \"颜色\": \"#ffffff\",\n    \"发光效果\": \"无\",\n    \"渐变\": \"无\"\n  },\n  \"渲染\": {\n    \"景深\": \"轻微，带有轻微渐晕\",\n    \"焦点\": \"漂浮物体的中心\",\n    \"环境光遮蔽\": \"最小化以保持明亮感\",\n    \"渲染引擎\": \"3D风格化，带有光扩散和高镜面细节\",\n    \"相机角度\": \"略高于物体，正面视角\",\n    \"分辨率\": \"极高，适用于产品品牌推广\"\n  },\n  \"特殊效果\": {\n    \"漂浮效果\": true,\n    \"视觉失重感\": true,\n    \"阴影柔和度\": \"最大\"\n  }\n}",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/256.jpeg",
      "type": "image_to_image"
    },
    {
      "title": "怪诞又梦幻的超现实插画",
      "author": "@fy360593",
      "prompt": "Transform the uploaded image into a surreal illustration with a whimsical, dream‑like vibe.\n• Color palette: muted tones (soft greens, browns, greys) with occasional gentle pops of green.\n• Lighting: soft, diffused, almost ethereal light that blends gradients and subtle highlights.\n• Texture & medium feel: oil‑painting‑like brushstrokes, faint watercolor washes, or loose hand‑drawn linework, with a slight grainy texture.\n• Mood & composition: exaggerated, expressive features (e.g., elongated faces or emotive eyes) characteristic of cartoonish or Muppet‑style illustrations, but applied in a surreal, slightly fantastical context.\n• Overall aesthetic: blend realistic attention to detail with a touch of surreal whimsy—think serene, slightly uncanny atmosphere.\n\n中文提示词：\n将上传的图片转换为一幅超现实插画，营造出怪诞又梦幻的氛围。\n色彩搭配：采用柔和色调（浅绿、棕色、灰色），偶尔点缀一抹淡雅的绿色。\n光线效果：柔和、弥漫的近乎空灵的光线，融合渐变色与细微的高光。\n质感与媒介感：类似油画的笔触、淡淡的水彩晕染或松散的手绘线条，带有轻微的颗粒质感。\n氛围与构图：具有夸张、富有表现力的特征（如拉长的脸型或饱含情感的眼睛），这是卡通或提线木偶风格插画的典型特点，但要将其应用于超现实、略带奇幻色彩的场景中。\n整体美学：将对细节的真实刻画与一丝超现实的怪诞感相融合 —— 营造出一种宁静又略带诡异的氛围。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/252.png",
      "type": "image_to_image"
    },
    {
      "title": "90年代美国卡通片定格动画风格插画",
      "author": "@cuchocapilla",
      "prompt": "Transform this image into a 90s American cartoon cel-style illustration. Use thick black outlines, flat bold colors, and sharp cel shading with hard shadows. Emphasize exaggerated facial expressions and stylized, geometric character shapes. The background should be flat or minimal to keep the focus on the character. The whole image should feel like a frame from a Saturday morning cartoon.\n\n中文提示词：\n将这张图片转化为 90 年代美国卡通片定格动画风格插画。使用粗黑轮廓线、平面化鲜明的颜色，以及锐利的定格动画阴影效果和硬阴影。强调夸张的面部表情和风格化的几何角色形状。背景应为平面或极简，以突出角色。整张图片应感觉像是从周六早间卡通片中截取的一帧。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/247.jpeg",
      "type": "image_to_image"
    },
    {
      "title": "转换马赛克风格照片",
      "author": "@fy360593",
      "prompt": "Transform this image into a refined low-poly mosaic style. Preserve the original structure and recognizable details, especially facial features and contours. Use small, high-density polygons to maintain clarity and identity while creating a crystalline, faceted look. Keep the original color palette for a harmonious and natural aesthetic. Avoid altering or adding new elements.\n\n中文提示词：\n将此图像转换为精致的低多边形马赛克风格。保留原始结构和可识别的细节，特别是面部特征和轮廓。使用小而高密度的多边形，以保持清晰度和身份，同时创造水晶般、多面体的外观。保留原始调色板，以实现和谐自然的美学。避免更改或添加新元素。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/244.png",
      "type": "image_to_image"
    },
    {
      "title": "卡通照片转换",
      "author": "@fy360593",
      "prompt": "Transform the character into a digital, half-body cartoon-style portrait. Use a playful, vector-friendly style with clean solid lines, rounded face, oversized googly eyes, and minimal facial details. Show the character from chest up, including shoulders and upper torso. Apply smooth gradient fills to both the character and background for a colorful, soft look. Square format.\n\n中文提示词：\n将角色转化为数字化的半身卡通风格肖像。使用适合矢量的俏皮风格，线条干净利落，圆润的脸庞，超大号的玻璃眼球，以及极简的面部细节。展示角色胸部以上的部分，包括肩膀和上半身。对角色和背景都应用平滑的渐变填充，营造色彩丰富、柔和的视觉效果。方形格式。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/243.png",
      "type": "image_to_image"
    },
    {
      "title": "有趣的块状 3D 世界",
      "author": "@egeberkina",
      "prompt": "Retexture the image attached based on the JSON below\n{\n  \"style_name\": \"Playful Chunky 3D Aesthetic\",\n  \"retexture_mode\": \"stylized_3d_overlay\",\n  \"object_analysis\": {\n    \"preserve_silhouette\": true,\n    \"geometry_sensitive_mapping\": true,\n    \"detail_retention\": \"moderate — focus on key forms and proportions\"\n  },\n  \"material_properties\": {\n    \"base_material\": [\"soft matte plastic\", \"rubbery polymer\"],\n    \"surface_details\": [\n      \"rounded edges and inflated volumes\",\n      \"smooth, toy-like finish\",\n      \"minimal seam lines\"\n    ]\n  },\n  \"lighting\": {\n    \"type\": \"studio diffused light\",\n    \"intensity\": \"medium\",\n    \"shadows\": \"soft base shadows\",\n    \"highlight_behavior\": \"gentle gloss on curves and raised surfaces\"\n  },\n  \"color_palette\": {\n    \"dominant_colors\": [\"#f6f6f6\", \"#3a3a3a\", \"#f05423\"],\n    \"accent_colors\": [\"#ff875d\", \"#b0b0b0\", \"#f3f3f3\"]\n  },\n  \"background\": {\n    \"color\": \"#f9f9f9\",\n    \"type\": \"solid\",\n    \"texture\": \"none\"\n  },\n  \"style_tags\": [\n    \"3D cartoon realism\",\n    \"UI icon pack aesthetic\",\n    \"inflated minimalism\",\n    \"soft tech look\",\n    \"playful volume modeling\"\n  ]\n}\n\n中文提示词：\n根据以下 JSON 对附加的图像进行重新纹理化\n{\n  \"style_name\": \"Playful Chunky 3D Aesthetic\",\n  \"retexture_mode\": \"stylized_3d_overlay\",\n\"对象分析\": {\n\"保留轮廓\": true,\n\"几何敏感映射\": true,\n\"细节保留\": \"中等 — 侧重于关键形态和比例\"\n  },\n\"材料属性\": {\n    \"基础材料\": [\"柔软磨砂塑料\", \"弹性聚合物\"],\n    \"表面细节\": [\n\"圆润的边缘和膨胀的体积\",\n\"光滑、玩具般的表面\",\n\"极少的接缝线\"\n    ]\n  },\n\"lighting\": {\n    \"type\": \"工作室漫射光\",\n    \"intensity\": \"中等\",\n\"阴影\": \"柔和的基础阴影\",\n    \"高光行为\": \"曲线和凸起表面的柔和光泽\"\n  },\n  \"配色方案\": {\n\"主色调\": [\" #f6f6f6 \", \" #3a3a3a \", \" #f05423 \"],\n    \"强调色\": [\" #ff875d \", \" #b0b0b0 \", \" #f3f3f3 \"]\n  },\n  \"背景\": {\n\"color\": \" #f9f9f9 \",\n    \"type\": \"solid\",\n    \"texture\": \"none\"\n  },\n\"风格标签\": []\n\"3D 卡通写实风格\"\n\"UI 图标包美学\"\n\"膨胀极简主义\"\n\"柔和科技感\",\n\"俏皮体积建模\"\n  ]\n}",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/242.png",
      "type": "image_to_image"
    },
    {
      "title": "日本搞笑漫画风格插画",
      "author": "@fy360593",
      "prompt": "Transform this image into a Japanese gag manga style illustration. Use a high-contrast black-and-white color palette with bold linework and screentone (halftone) shading. Characters should have exaggerated facial expressions, cartoonish proportions (big head, small body), and comedic intensity. Include dynamic action lines or radiating background effects. The overall aesthetic should mimic retro manga from the 80s and 90s with humorous and intense emotion.\n\n中文提示词：\n将这张图片转化为日本搞笑漫画风格插画。使用高对比度的黑白色彩搭配，粗犷的线条和网点（半色调）阴影。角色应有夸张的面部表情，卡通化的比例（大头小身），以及喜剧张力。包含动态动作线条或放射状背景效果。整体美学应模仿 80 年代和 90 年代的复古漫画，充满幽默和强烈的情感。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/228.jpeg",
      "type": "image_to_image"
    },
    {
      "title": "舒适的周末从这里开始",
      "author": "@egeberkina",
      "prompt": "retexture the image attached based on the json below:\n{\n  \"style_name\": \"Soft Minimal 3D Plastic\",\n  \"retexture_mode\": \"shape_lock\",\n  \"object_analysis\": {\n    \"preserve_silhouette\": true,\n    \"geometry_sensitive_mapping\": true,\n    \"detail_retention\": \"flatten complex details into simplified geometry blocks\"\n  },\n  \"material_properties\": {\n    \"base_material\": [\n      \"smooth matte plastic\",\n      \"metallic edge trim with satin finish\",\n      \"semi-reflective black screen surface\"\n    ],\n    \"surface_details\": [\n      \"subtle color gradient\",\n      \"rounded bevels and corners\",\n      \"soft transition between surfaces\"\n    ]\n  },\n  \"lighting\": {\n    \"type\": \"soft gradient ambient light\",\n    \"shadows\": \"minimal, soft-edged shadows\",\n    \"highlights\": \"diffused, low-intensity reflections\"\n  },\n  \"background\": {\n    \"color\": \"pastel gradient (blue to cream)\",\n    \"texture\": \"smooth and untextured\",\n    \"elements\": \"clean background with no added geometry\"\n  },\n  \"rendering\": {\n    \"style\": \"isometric 3D render\",\n    \"resolution\": \"high, with slight bloom\",\n    \"focus\": \"central object, no depth blur\"\n  },\n  \"color_palette\": {\n    \"primary\": [\"cool grey\", \"steel blue\", \"soft charcoal\"],\n    \"accents\": [\"light lavender\", \"pastel yellow\"]\n  }\n}\n\n中文提示词：\n根据以下 JSON 重新纹理附加的图像：\n{\n\"style_name\": \"柔和极简 3D 塑料风格\",\n  \"retexture_mode\": \"形状锁定\",\n  \"object_analysis\": {\n    \"preserve_silhouette\": true,\n\"geometry_sensitive_mapping\": true,\n    \"detail_retention\": \"将复杂的细节简化为简化的几何块\"\n  },\n  \"material_properties\": {\n\"base_material\": [\n\"光滑磨砂塑料\"，\n\"金属边缘饰条，缎面处理\"，\n\"半反射黑色屏幕表面\"\n],\n\"表面细节\": [\n\"微妙的颜色渐变\"，\n\"圆润的斜角和边角\"，\n\"表面之间的柔和过渡\"\n    ]\n  },\n\"lighting\": {\n\"类型\": \"柔和渐变环境光\",\n    \"阴影\": \"极少，边缘柔和的阴影\",\n    \"高光\": \"弥散，低强度的反射\"\n  },\n\"背景\": {\n    \"颜色\": \"柔和渐变（蓝色到奶油色）\",\n    \"纹理\": \"光滑无纹理\",\n    \"元素\": \"干净背景，无添加几何图形\"\n  },\n\"渲染\": {\n\"风格\": \"等距 3D 渲染\",\n\"分辨率\": \"高，略带轻微泛光\"\n\"focus\": \"中心对象，无深度模糊\"\n  },\n  \"color_palette\": {\n    \"primary\": [\"冷灰色\", \"钢蓝色\", \"柔和的炭黑色\"],\n\"accents\": [\"浅薰衣草色\", \"淡黄色\"]\n  }\n}",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/224.png",
      "type": "image_to_image"
    },
    {
      "title": "宝石渲染风格",
      "author": "@alban_gz",
      "prompt": "Apply the parameters of the JSON provided to [insert image]\n\n{\n  \"name\": \"Gemstone Render\",\n  \"object\": {\n    \"type\": \"auto\",\n    \"detected_color\": \"auto\",\n    \"form\": \"realistic, natural form preserved\",\n    \"material\": \"crystal or faceted gemstone glass\",\n    \"surface\": \"precision-cut facets, sharp reflections\",\n    \"transparency\": \"high clarity with light refraction\",\n    \"internal_features\": \"color depth, internal shimmer, and light dispersion\"\n  },\n  \"color_and_light\": {\n    \"primary_color\": \"{detected_color}\",\n    \"highlight_effects\": \"specular highlights, gemstone brilliance, caustics\",\n    \"lighting_setup\": \"studio lighting with white or soft background\",\n    \"metallic_accents\": {\n      \"enabled\": true,\n      \"material\": \"gold or chrome\",\n      \"application\": \"rim, stem, or edge detailing\"\n    }\n  },\n  \"style\": {\n    \"artistic_style\": [\n      \"photorealistic 3D render\",\n      \"Gemstone Render Style\",\n      \"luxury object visualization\"\n    ],\n    \"design_language\": [\n      \"faceted precision modeling\",\n      \"jewelry-like rendering\",\n      \"optical depth and brilliance\"\n    ]\n  },\n  \"technical_details\": {\n    \"render_engine\": [\n      \"Blender with Cycles\",\n      \"Cinema 4D + Redshift/Octane\"\n    ],\n    \"rendering_techniques\": [\n      \"physically-based rendering (PBR)\",\n      \"ray tracing\",\n      \"global illumination\"\n    ],\n    \"resolution\": \"ultra high-res (4K–8K)\",\n    \"post_processing\": [\n      \"subtle glow\",\n      \"enhanced reflections\",\n    \"color-preserving contrast boost\"\n    ]\n  },\n  \"prompt_template\": \"A 3D-rendered image of a {object} made of {detected_color} crystal, with intricate gemstone-like facets. It sparkles with internal reflections and sits on a clean studio background, blending realism with luxury design.\"\n}\n\n中文提示词：\n将提供的 JSON 参数应用于[插入图片]\n\n{\n  \"名称\": \"宝石渲染\",\n  \"物体\": {\n    \"类型\": \"自动\",\n    \"检测到的颜色\": \"自动\",\n    \"形态\": \"逼真、自然形态得以保留\",\n    \"材质\": \"水晶或多面宝石玻璃\",\n    \"表面\": \"精密切割的刻面、清晰的反光\",\n    \"透明度\": \"高清晰度，带有光线折射\",\n    \"内部特征\": \"色彩深度、内部光泽和光线色散\"\n  },\n  \"颜色与光线\": {\n    \"主色调\": \"{detected_color}\",\n    \"高光效果\": \"镜面高光、宝石光泽、焦散效果\",\n    \"照明设置\": \"工作室照明，搭配白色或柔和背景\",\n    \"金属装饰\": {\n      \"启用\": true,\n      \"材质\": \"黄金或铬合金\",\n      \"应用位置\": \"边缘、柄部或侧边细节\"\n    }\n  },\n  \"风格\": {\n    \"艺术风格\": [\n      \"照片级写实3D渲染\",\n      \"宝石渲染风格\",\n      \"奢华物体可视化\"\n    ],\n    \"设计语言\": [\n      \"多面精密建模\",\n      \"珠宝式渲染\",\n      \"光学深度与光泽\"\n    ]\n  },\n  \"技术细节\": {\n    \"渲染引擎\": [\n      \"Blender搭配Cycles\",\n      \"Cinema 4D + Redshift/Octane\"\n    ],\n    \"渲染技术\": [\n      \"基于物理的渲染（PBR）\",\n      \"光线追踪\",\n      \"全局光照\"\n    ],\n    \"分辨率\": \"超高分辨率（4K–8K）\",\n    \"后期处理\": [\n      \"柔和光晕\",\n      \"增强的反光\",\n      \"保持色彩的对比度提升\"\n    ]\n  },\n  \"提示模板\": \"一张{物体}的3D渲染图像，由{detected_color}水晶制成，带有复杂的宝石般刻面。它内部反光闪耀，置于干净的工作室背景上，融合了写实感与奢华设计。\"\n}",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/222.jpeg",
      "type": "image_to_image"
    },
    {
      "title": "钻石镶嵌风格",
      "author": "@alban_gz",
      "prompt": "Recreate this image using the parameters of the JSON provided.\n{\n  \"style_name\": \"Diamond-Encrusted Glamour\",\n  \"description\": \"Applies a hyper-realistic diamond-encrusted style to any object, logo, or shape. The surface of the subject is entirely covered with sparkling gemstones that reflect light with intense brilliance, creating a luxurious, eye-catching, and surreal look.\",\n  \"surface_texture\": {\n    \"material\": \"diamond-crystal\",\n    \"coating\": \"fully encrusted with multi-faceted diamonds\",\n    \"sparkle_intensity\": \"maximum\",\n    \"reflection_type\": \"specular and highly refractive\",\n    \"detail_density\": \"ultra-fine, micro-gem coverage with no gaps\",\n    \"light_refraction\": \"strong rainbow dispersion through facets\"\n  },\n  \"lighting\": {\n    \"light_source\": \"hard directional light\",\n    \"highlight_effects\": \"lens flares, sparkle flares on gem edges\",\n    \"shadow_type\": \"soft-edged, low-opacity shadows for contrast\",\n    \"specularity\": \"very high\",\n    \"reflection_sources\": \"ambient and direct highlights across the gem facets\"\n  },\n  \"background\": {\n    \"type\": \"minimalist solid color\",\n    \"color\": \"#B0C4DE\",\n    \"texture\": \"smooth matte\",\n    \"contrast_with_subject\": \"high contrast to enhance sparkle\",\n    \"depth\": \"subtle shadow under the object for floating effect\"\n  },\n  \"color_palette\": {\n    \"primary\": \"transparent white (diamond base)\",\n    \"secondary\": \"prismatic reflections (rainbow light dispersion)\",\n    \"accent\": \"metallic shimmer on edges (optional: gold or silver undertones)\"\n  },\n  \"camera\": {\n    \"angle\": \"slight top-down perspective\",\n    \"depth_of_field\": \"shallow (sharp focus on object, blurred background)\",\n    \"lens_effects\": [\"macro focus\", \"sparkle highlights\", \"light bloom\"]\n  },\n  \"style_keywords\": [\n    \"glamorous\",\n    \"luxury\",\n    \"crystal-covered\",\n    \"bling\",\n    \"hyper-detailed\",\n    \"sparkling\",\n    \"futuristic\",\n    \"eye-catching\",\n    \"surreal realism\",\n    \"fashion-inspired\"\n  ],\n  \"applicability\": {\n    \"usable_on\": [\"logos\", \"icons\", \"food items\", \"everyday objects\", \"fashion accessories\", \"typography\"],\n    \"visual_requirements\": [\"well-defined silhouette\", \"clean shapes for gem placement\"],\n    \"scalability\": \"best results on medium to large subjects for detailed sparkle\"\n  }\n}\n\n中文提示词：\n使用提供的 JSON 参数重新创建此图像。\n\n{\n\"style_name\": \"钻石镶嵌奢华风格\",\n  \"description\": \"将超逼真的钻石镶嵌风格应用于任何物体、标志或形状。主体的表面完全覆盖着闪闪发光的宝石，这些宝石以强烈的亮度反射光线，营造出奢华、引人注目和超现实的效果。\",\n  \"surface_texture\": {\n    \"material\": \"钻石水晶\",\n\"涂层\": \"完全镶嵌有多面钻石\",\n\"闪耀强度\": \"最大\",\n\"反射类型\": \"镜面和高折射率\",\n\"细节密度\": \"超精细，微宝石覆盖，无间隙\"\n\"light_refraction\": \"通过切面产生强烈的彩虹色散\"\n  },\n  \"lighting\": {\n    \"light_source\": \"硬直射光源\",\n\"高光效果\": \"镜头眩光，宝石边缘的闪光眩光\",\n    \"阴影类型\": \"柔和边缘，低不透明度的阴影以形成对比\",\n    \"光泽度\": \"非常高\",\n    \"反射源\": \"宝石切面的环境光和直接高光\"\n  },\n\"background\": {\n    \"type\": \"极简纯色\",\n    \"color\": \" #B0C4DE \",\n\"纹理\": \"光滑磨砂质感\",\n\"与主体对比度\": \"高对比度以增强闪耀效果\",\n\"深度\": \"物体下方微妙阴影以产生悬浮效果\"\n  },\n\"color_palette\": {\n    \"primary\": \"透明白色（钻石基底）\",\n    \"secondary\": \"棱镜反射（彩虹光散）\",\n    \"accent\": \"边缘金属光泽（可选：金色或银色底色）\"\n  },\n\"camera\": {\n    \"angle\": \"略微俯视角度\",\n    \"depth_of_field\": \"浅景深（物体清晰，背景模糊）\",\n\"镜头效果\": [\"微距对焦\", \"闪烁高光\", \"光晕\"]\n  },\n  \"风格关键词\": [\n    \"迷人\",\n\"奢侈\",\n\"水晶覆盖的\",\n\"闪亮\",\n\"超精细的\",\n\"闪闪发光的\",\n\"未来感的\",\n\"引人注目的\",\n\"超现实现实主义\",\n\"受时尚启发的\"\n  ],\n  \"适用性\": {\n    \"可用于\": [\"标志\", \"图标\", \"食品项目\", \"日常用品\", \"时尚配饰\", \"字体\"],\n\"视觉要求\": [\"轮廓清晰\", \"宝石放置的形状干净\"],\n    \"可扩展性\": \"在中等至大型对象上获得最佳效果，以展现细节闪烁\"\n  }\n}",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/221.jpeg",
      "type": "image_to_image"
    },
    {
      "title": "卡通现代风格插画",
      "author": "@Artedeingenio",
      "prompt": "Transform this image into a Cartoon Modern Style illustration, inspired by classic UPA animation like Mr. Magoo and The Jetsons.\nRedesign the character using flat, geometric shapes: ovals, rectangles, simple curves and angles. Avoid realistic proportions — the design should be stylized and abstract.\nUse a limited color palette, preferably soft pastels or bold contrasts (e.g. mint green, salmon, sky blue, mustard yellow), with flat tones and no gradients.\nSimplify facial features and body structure to be iconic and minimalist — large heads, small limbs, expressive poses, but with minimal detail.\nThe background should be minimal or symbolic, using basic shapes or abstract scenery (floating stairs, blocky furniture, stylized trees or stars).\nThe final image should look like a frame from a 1950s or 1960s modernist cartoon — playful, graphic, and highly stylized.\n\n中文提示词：\n将这张图片转换为卡通现代风格插画，灵感来源于经典的 UPA 动画，如《摩根先生》和《太空家庭》。\n使用扁平的几何形状重新设计角色：椭圆形、矩形、简单的曲线和角度。避免真实比例——设计应该是风格化的和抽象的。\n使用有限的调色板，最好是柔和的粉彩色或鲜明的对比色（例如薄荷绿、三文鱼色、天空蓝、芥末黄），使用扁平色调且没有渐变。\n简化面部特征和身体结构，使其具有标志性且极简——大头、小四肢、富有表现力的姿势，但细节极少。\n背景应极简或象征性，使用基本形状或抽象场景（漂浮的楼梯、积木家具、风格化的树木或星星）。\n最终图像应像 1950 年代或 1960 年代现代主义卡通的一帧——活泼、图形化且高度风格化。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/217.png",
      "type": "image_to_image"
    },
    {
      "title": "Gorillaz风格",
      "author": "@azed_ai",
      "prompt": "Restyle this image into a gritty Gorillaz-style illustration, bold thick black outlines, sharp angular edges, flat expressive lighting, stylized high-contrast shadows, dirty distressed surface textures, muted color palette: washed-out teals, olive greens, rusty reds, mustard yellows, dusty browns, raw grungy urban atmosphere, comic book flatness mixed with painterly grit, hand-drawn finish with faded gradients, graphic novel aesthetic\nwith a rebellious, animated tone, dark stylish tone, full of attitude.\n\n中文提示词：\n将这张图片改造成硬朗的 Gorillaz 风格插画，粗犷的黑色轮廓线，尖锐的角边，平面化的表现性光照，风格化的高对比度阴影，脏污的磨损表面纹理，柔和的调色板：褪色的蓝绿色，橄榄绿，锈红色，芥末黄，尘土棕，原始的粗糙都市氛围，漫画书平面感与绘画性粗糙的混合，手绘效果带有褪色渐变，漫画小说美学带有叛逆、动画化的风格，暗黑时尚的调调，充满态度。",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/215.png",
      "type": "image_to_image"
    },
    {
      "title": "黑客帝国的绿色代码",
      "author": "@umesh_ai",
      "prompt": "Transform this image into a digital Matrix-style scene. The background and subject should be composed of cascading neon green code on a black backdrop, similar to the iconic Matrix digital rain. Use glowing green symbols (Japanese katakana, numbers, and Latin letters), with some motion blur and depth. Add subtle lighting effects to simulate screen glow and enhance the cyberpunk, high-tech atmosphere\n\n中文提示词：\n将这张图像转化为数字《黑客帝国》风格场景。背景和主题应由倾泻而下的霓虹绿色代码组成，在黑色背景下，类似于标志性的《黑客帝国》数字雨。使用发光的绿色符号（日语假名、数字和拉丁字母），带有一些运动模糊和深度。添加微妙的光照效果来模拟屏幕辉光，增强赛博朋克、高科技氛围",
      "thumbnail": "https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/204.jpeg",
      "type": "image_to_image"
    },
    {
      "title": "可爱温馨针织玩偶",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "一张特写、构图专业的照片，展示一个手工钩织的毛线玩偶被双手轻柔地托着。玩偶造型圆润，【上传图片】人物得可爱Q版形象，色彩对比鲜明，细节丰富。持玩偶的双手自然、温柔，手指姿态清晰可见，皮肤质感与光影过渡自然，展现出温暖且真实的触感。背景轻微虚化，表现为室内环境，有温暖的木质桌面和从窗户洒入的自然光，营造出舒适、亲密的氛围。整体画面传达出精湛的工艺感与被珍视的温馨情绪。\n\n\n**需上传参考图片：** 上传一张照片作为参考，生成其可爱Q版针织玩偶形象。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/97/cute_cozy_knitted_doll.png",
      "type": "image_to_image"
    },
    {
      "title": "定制动漫手办",
      "author": "@dotey",
      "prompt": "生成一张摆放于桌面上的动漫风格手办照片，以日常随手用手机拍摄的轻松休闲视角呈现。手办模型以附件中人物照片为基础，精确还原照片中人物的全身姿势、面部表情以及服装造型，确保手办全身完整呈现。整体设计精致细腻，头发与服饰采用自然柔和的渐变色彩与细腻质感，风格偏向日系动漫风，细节丰富，质感真实，观感精美。\n\n\n**需上传参考图片：** 请上传一张包含人物全身姿势、面部表情及服装造型的照片，用于生成手办模型。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/96/custom-anime-figure-from-photo.png",
      "type": "image_to_image"
    },
    {
      "title": "自拍生成摇头娃娃",
      "author": "@thisdudelikesAI",
      "prompt": "将这张照片变成一个摇头娃娃：头部稍微放大，保持面部准确，身体卡通化。[把它放在书架上]。\n\n*注意： 请将提示词中的[把它放在书架上]替换为您想要的特定场景或背景，例如“把它放在书架上”或“把它放在办公桌上”，或“把它放在中性背景上”，或“生成透明背景”。*\n\n**需上传参考图片：** 需要上传一张自拍照作为生成摇头娃娃的基础。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/95/selfie-to-bobblehead-generator.png",
      "type": "image_to_image"
    },
    {
      "title": "玻璃质感重塑",
      "author": "@egeberkina",
      "prompt": "对参考图片进行重新纹理化，基于下方的 JSON 美学定义\n{\n  \"style\": \"photorealistic 3D render\",\n  \"material\": \"glass with transparent and iridescent effects\",\n  \"surface_texture\": \"smooth, polished with subtle reflections and refractive effects\",\n  \"lighting\": {\n    \"type\": \"studio HDRI\",\n    \"intensity\": \"high\",\n    \"direction\": \"angled top-left key light and ambient fill\",\n    \"accent_colors\": [\"blue\", \"green\", \"purple\"],\n    \"reflections\": true,\n    \"refractions\": true,\n    \"dispersion_effects\": true,\n    \"bloom\": true\n  },\n  \"color_scheme\": {\n    \"primary\": \"transparent with iridescent blue, green, and purple hues\",\n    \"secondary\": \"crystal-clear with subtle chromatic shifts\",\n    \"highlights\": \"soft, glowing accents reflecting rainbow-like effects\",\n    \"rim_light\": \"soft reflective light around edges\"\n  },\n  \"background\": {\n    \"color\": \"black\",\n    \"vignette\": true,\n    \"texture\": \"none\"\n  },\n  \"post_processing\": {\n    \"chromatic_aberration\": true,\n    \"glow\": true,\n    \"high_contrast\": true,\n    \"sharp_details\": true\n  }\n}\n\n*注意： 本提示词请使用 GPT-4o 生成图片；使用Sora可能无法生成正确的风格。*\n\n**需上传参考图片：** 需要上传一张图像作为重新纹理化的基础。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/93/glass_retexturing.png",
      "type": "image_to_image"
    },
    {
      "title": "谷歌地图变身古代藏宝图",
      "author": "@umesh_ai",
      "prompt": "将图像转换为绘制在古老羊皮纸上的古代藏宝图。地图包含详细的元素，如海洋上的帆船、海岸线上的古老港口或城堡、通向标记宝藏地点的大“X”的虚线路径、山脉、棕榈树和装饰性的罗盘玫瑰。整体风格让人联想到旧时的海盗冒险电影。\n\n\n**需上传参考图片：** 需要上传一张谷歌地图截图或其他地图图片作为转换的基础。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/91/case.png",
      "type": "image_to_image"
    },
    {
      "title": "半透明玻璃质感变换",
      "author": "@azed_ai",
      "prompt": "将附图变换为柔软的3D半透明玻璃，具有磨砂哑光效果和细致的纹理，原始色彩，以浅灰色背景为中心，在空间中轻轻漂浮，柔和的阴影，自然的光线\n\n\n**需上传参考图片：** 需要上传一张实物参考图",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/81/example.png",
      "type": "image_to_image"
    },
    {
      "title": "玻璃材质重塑",
      "author": "@egeberkina",
      "prompt": "retexture the image attached based on the json below:\n\n{\n  \"style\": \"photorealistic\",\n  \"material\": \"glass\",\n  \"background\": \"plain white\",\n  \"object_position\": \"centered\",\n  \"lighting\": \"soft, diffused studio lighting\",\n  \"camera_angle\": \"eye-level, straight-on\",\n  \"resolution\": \"high\",\n  \"aspect_ratio\": \"2:3\",\n  \"details\": {\n    \"reflections\": true,\n    \"shadows\": false,\n    \"transparency\": true\n  }\n}\n\n*注意： 此提示词通过 JSON 结构精确控制输出风格，并将上传图片重塑为指定材质。*\n\n**需上传参考图片：** 需要上传一张要进行材质重塑的物体图片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/78/example_retexture_glass_phone.png",
      "type": "image_to_image"
    },
    {
      "title": "定制Q版钥匙串",
      "author": "@azed_ai",
      "prompt": "一张特写照片，展示一个被人手握住的可爱多彩钥匙串。钥匙串的造型为 [参考图片] 的 Q 版风格。钥匙串由柔软橡胶材质制成，带有粗黑描边，连接在一个小巧的银色钥匙圈上，背景为中性色调。\n\n*注意： 提示词中的 `[参考图片]` 部分需要与上传的图片配合使用。*\n\n**需上传参考图片：** 需要上传一张人物或物体的照片作为钥匙串图案主体。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/73/example_keychain_chibi.png",
      "type": "image_to_image"
    },
    {
      "title": "金色吊坠项链",
      "author": "@azed_ai",
      "prompt": "一张照片级写实的特写图像，展示一条由女性手握持的金质吊坠项链。吊坠上刻有 [图像 / 表情符号] 的浮雕图案，悬挂在一条抛光金链上。背景为柔和虚化的中性米色调，采用自然光照，肤色真实，风格为产品摄影，画面比例为 16:9。\n\n*注意： 可替换提示词中的 `[image /emoji]` 为具体图像描述或 Emoji。*\n\n**需上传参考图片：** （可选）可上传图片作为浮雕图案。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/72/gold_pendant_necklace.png",
      "type": "image_to_image"
    },
    {
      "title": "原创宝可梦生成",
      "author": "@Anima_Labs",
      "prompt": "根据此物体（提供的照片）创作一个原创生物。该生物应看起来像是属于一个奇幻怪物捕捉宇宙，具有受复古日式RPG怪物艺术影响的可爱或酷炫设计。图像必须包含：\n  – 生物的全身视图，灵感来自物体的形状、材料或用途。\n  – 在其脚边有一个小球体或胶囊（类似于精灵球），其设计图案和颜色与物体的外观相匹配——不是标准的精灵球，而是自定义设计。\n  – 为生物发明的名字，显示在其旁边或下方。 – 其元素类型（例如火、水、金属、自然、电……），基于物体的核心属性。插图应看起来像是来自奇幻生物百科全书，线条清晰，阴影柔和，设计富有表现力且以角色为驱动。\n\n*注意： 如果第一次提示无效，尝试开启新对话或要求它绕过问题。*\n\n**需上传参考图片：** 需要上传一张物体、食物等的照片作为灵感来源。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/70/example_pokemon_strawbit.png",
      "type": "image_to_image"
    },
    {
      "title": "未来主义 Logo 交易卡",
      "author": "@hewarsaber",
      "prompt": "{\n    \"prompt\": \"A futuristic trading card with a dark, moody neon aesthetic and soft sci-fi lighting. The card features a semi-transparent, rounded rectangle with slightly muted glowing edges, appearing as if made of holographic glass. At the center is a large glowing logo of {{logo}}, with no additional text or label, illuminated with a smooth gradient of {{colors}}, but not overly bright. The reflections on the card surface should be subtle, with a slight glossy finish catching ambient light. The background is a dark carbon fiber texture or deep gradient with soft ambient glows bleeding into the edges. Add subtle light rays streaming down diagonally from the top, giving the scene a soft cinematic glow. Apply light motion blur to the edges and reflections to give the scene a sense of depth and energy, as if it's part of a high-end tech animation still. Below the card, include realistic floor reflections that mirror the neon edges and logo—slightly diffused for a grounded, futuristic look. Text elements are minimal and softly lit: top-left shows '{{ticker}}', top-right has a stylized signature, and the bottom displays '{{company_name}}' with a serial number '{{card_number}}', a revenue badge reading '{{revenue}}', and the year '{{year}}'. Typography should have a faint glow with slight blurring, and all elements should feel premium, elegant, and softly illuminated—like a high-end cyberpunk collectible card.\",\n    \"style\": {\n        \"lighting\": \"Neon glow, soft reflections\",\n        \"font\": \"Modern sans-serif, clean and minimal\",\n        \"layout\": \"Centered, structured like a digital collectible card\",\n        \"materials\": \"Glass, holographic plastic, glowing metal edges\"\n    },\n    \"parameters\": {\n        \"logo\": \"Tesla logo\",\n        \"ticker\": \"TSLA\",\n        \"company_name\": \"Tesla Inc.\",\n        \"card_number\": \"#0006\",\n        \"revenue\": \"$96.8B\",\n        \"year\": \"2025\",\n        \"colors\": [\n            \"red\",\n            \"white\",\n            \"dark gray\"\n        ]\n    },\n    \"medium\": \"3D render, high-resolution digital art\",\n    \"size\": \"1080px by 1080px\"\n}\n\n*注意： 提示词采用类 JSON 结构描述卡片元素。可修改 `parameters` 对象中的值（如 logo, ticker, company_name, colors 等）来自定义卡片。对于自定义 Logo，需在 `parameters.logo` 中注明（例如：\"Framer logo (attached image)\"）并上传图片。本提示词为结构化JSON，保持英文。*\n\n**需上传参考图片：** （可选）上传自定义 Logo 图片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/68/example_trading_card_logo_tesla.png",
      "type": "image_to_image"
    },
    {
      "title": "可爱珐琅别针",
      "author": "@gnrlyxyz",
      "prompt": "将附图中的人物转换成可爱的珐琅徽章风格。使用光亮金属描边和鲜艳的珐琅填色。不添加任何额外元素。方形效果图格式，白色背景。\n\n\n**需上传参考图片：** 需要上传一张人物或物体的照片作为转换主体。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/62/example_enamel_pins_einstein.png",
      "type": "image_to_image"
    },
    {
      "title": "体素风格 3D 图标转换",
      "author": "@BrettFromDJ",
      "prompt": "三个步骤\n1. 上传参考图\n2. 上传要转换的照片\n3. 提示词：将图片/描述/emoji转换为参考图一样的体素 3D 图标，Octane 渲染，8k\n\n*注意： 中文提示词 by @ZHO_ZHO_ZHO*\n\n**需上传参考图片：** 体素风格图标的参考图从原文链接1获取；以及一张要转换的原始图标。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/48/example_voxel_icon.png",
      "type": "image_to_image"
    },
    {
      "title": "RPG 风格角色卡片制作",
      "author": "@berryxia_ai",
      "prompt": "创建一张 RPG 收藏风格的数字角色卡。\n角色设定为 {Programmer}，自信地站立，配有与其职业相关的工具或符号。\n以 3D 卡通风格呈现，采用柔和光照，展现鲜明的个性。\n添加技能条或属性数值，例如 [技能1 +x]、[技能2 +x]，如 Creativity +10、UI/UX +8。\n卡片顶部添加标题横幅，底部放置角色名牌。\n卡片边框应干净利落，如同真实的收藏公仔包装盒。\n背景需与职业主题相匹配。\n配色方面使用温暖的高光与符合职业特征的色调。\n\n*注意： 可替换 {Programmer} 括号内的职业为Designer、Doctor等等*\n\n**需上传参考图片：** 可选。可根据职业或角色描述生成，或上传照片作为参考。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/44/example_rpg_card_designer.png",
      "type": "image_to_image"
    },
    {
      "title": "Q版可爱俄罗斯套娃 (戴珍珠耳环的少女)",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "把图片人物生成变成 Q 版可爱俄罗斯套娃🪆，大到小一共五个，放在精致的木桌上，横幅3:2比例\n\n\n**需上传参考图片：** 需要上传一张人物图片作为转换对象 (原文使用了[《戴珍珠耳环的少女》](https://commons.wikimedia.org/w/index.php?curid=55017931))。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/43/example_matryoshka_pearl_earring.png",
      "type": "image_to_image"
    },
    {
      "title": "3D Q版情侣水晶球",
      "author": "@balconychy",
      "prompt": "将附图中的人物转换成水晶球场景。 整体环境：水晶球放在窗户旁桌面上，背景模糊，暖色调。阳光透过球体，洒下点点金光，照亮了周围的黑暗。 水晶球内部：人物是可爱Q版3D造型，相互之间满眼的爱意。\n\n\n**需上传参考图片：** 一张情侣照片 或 一张其他人物照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/42/example_3d_q_snowglobe_couple.png",
      "type": "image_to_image"
    },
    {
      "title": "日系双格漫画 (少女总统红温了)",
      "author": "@hellokaton",
      "prompt": "创建一张日系萌系双格漫画，上下排列，主题：少女总统的工作日常。\n\n角色形象: 将上传的附件转换为日系萌系卡通女生形象的风格，保留原图所有细节，如服饰（西装）、发型（明亮的金黄色）、五官等。 \n\n第一格: \n- 表情: 委屈巴巴，沮丧的表情，单手托腮 \n- 文字框: “肿么办嘛！他不跟我通话！(；´д｀)” \n- 场景: 暖色调办公室，背后美国国旗，桌上放着一堆汉堡，一个复古红色转盘电话，人物在画面左边，电话在右边。  \n\n第二格:  \n- 表情: 咬牙切齿，暴怒，脸涨红 \n- 动作: 猛拍桌子，汉堡震得跳起来 \n- 文字泡: “哼！关税加倍！不理我是他们的损失！( `д´ )” - 场景: 和第一格相同，但一片狼藉。  \n\n其他说明:  \n- 文字采用简洁可爱的手写体，整体风格可爱而有趣。 \n- 构图饱满生动，请保留足够空间用于文字显示，适当留白。 \n- 图片比例 2:3。 \n- 画面整体色彩鲜艳，突出卡通风格。\n\n\n**需上传参考图片：** 需要上传一张人物照片作为参考。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/40/example_two_panel_manga_president.png",
      "type": "image_to_image"
    },
    {
      "title": "全家福婚纱照",
      "author": "@balconychy",
      "prompt": "将照片里的转换成Q版 3D人物，父母婚礼服饰，孩子是美丽的花童。 父母，西式婚礼服饰，父亲礼服，母亲婚纱。孩子手捧鲜花。 背景是五彩鲜花做的拱门。 除了人物是3D Q版，环境其他都是写实。整体放在一个相框里。\n\n\n**需上传参考图片：** 一张家庭照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/33/example_family_wedding_photo_q.png",
      "type": "image_to_image"
    },
    {
      "title": "名画人物 OOTD",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "为图片人物生成不同职业风的OOTD，时尚穿搭和配饰，和人物色系一致的纯色背景，Q版 3d，c4d渲染，保持人脸特征，姿势都要保持一致，人物的比例腿很修长\n\n构图：9:16\n顶部文字：OOTD，左侧为人物ootd q版形象，右侧为穿搭的单件展示\n\n先来第一个职业：时尚设计师\n\n\n**需上传参考图片：** [《戴珍珠耳环的少女》图片](https://commons.wikimedia.org/w/index.php?curid=55017931)。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/29/example_pearl_earring_ootd.png",
      "type": "image_to_image"
    },
    {
      "title": "扁平贴纸设计",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "把这张照片设计成一个极简扁平插画风格的Q版贴纸，厚白边，保留人物特征，风格要可爱一些，人物要超出圆形区域边框，圆形区域要为纯色不要3d感，透明背景。\n\n\n**需上传参考图片：** 一张清晰头像照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/28/example_flat_sticker_pearl_earring.png",
      "type": "image_to_image"
    },
    {
      "title": "Q 版表情包制作",
      "author": "@dotey",
      "prompt": "创作一套全新的 chibi sticker，共六个独特姿势，以用户形象为主角：\n1. 双手比出剪刀手，俏皮地眨眼；\n2. 泪眼汪汪、嘴唇微微颤动，呈现可爱哭泣的表情；\n3. 张开双臂，做出热情的大大拥抱姿势；\n4. 侧卧入睡，靠着迷你枕头，带着甜甜的微笑；\n5. 自信满满地向前方伸手指，周围点缀闪亮特效；\n6. 手势飞吻，周围飘散出爱心表情。\n保留 chibi 美学风格：夸张有神的大眼睛、柔和的面部线条、活泼俏皮的短款黑色发型、配以大胆领口设计的白色服饰，背景使用充满活力的红色，并搭配星星或彩色纸屑元素进行装饰。周边适当留白。\nAspect ratio: 9:16\n\n\n**需上传参考图片：** 一张清晰头像照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/27/example_chibi_emoji_pack.png",
      "type": "image_to_image"
    },
    {
      "title": "名画人物麦片广告",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "《大师麦片》：根据我上传的照片的人物特征判断，为他生成一个符合他特质的燕麦片搭配（比如蔬菜、水果、酸奶、粗粮等等）和包装设计，然后生成他作为麦片包装盒封面人物 加 相应麦片搭配的广告封面，人物要保持特征、可爱Q版3d、c4d渲染风格，麦片所放置的地方的风格也要符合设定，比如放在厨房、超市 极简主义的设计台上等等，先做好设定，再生成图像。\n\n\n**需上传参考图片：** [《戴珍珠耳环的少女》图片](https://commons.wikimedia.org/w/index.php?curid=55017931)。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/26/example_master_oats_ad.png",
      "type": "image_to_image"
    },
    {
      "title": "Funko Pop 公仔制作",
      "author": "@dotey",
      "prompt": "把照片中的人物变成 Funko Pop 公仔包装盒的风格，以等距视角（isometric）呈现，并在包装盒上标注标题为“JAMES BOND”。包装盒内展示的是照片中人物形象，旁边搭配有人物的必备物品（手枪、手表、西装、其他）同时，在包装盒旁边还应呈现该公仔本体的实物效果，采用逼真的、具有真实感的渲染风格。\n\n\n**需上传参考图片：** 一张半身或者全身清晰照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/24/funko-pop-james-bond-figure-and-box.png",
      "type": "image_to_image"
    },
    {
      "title": "《泰坦尼克号》模仿",
      "author": "@balconychy",
      "prompt": "将附图中的人物转换成可爱Q版3D造型\n场景：在豪华游轮最顶尖的船头，船头是尖的。\n男士带着女士站在泰坦尼克号船头，男士双手搂着女士的腰，女士双臂伸展穿着连衣裙，迎着风，脸上洋溢着自由与畅快。\n此时天色呈现出黄昏的暖色调，大海在船下延展。\n除了人物用Q版3D造型以外，其他环境都是实物。\n\n\n**需上传参考图片：** 一张情侣照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/23/example_titanic_q_realistic.png",
      "type": "image_to_image"
    },
    {
      "title": "Q版角色表情包",
      "author": "@leon_yuan2001",
      "prompt": "请创作一套以 [参考图片中的角色] 为主角的Q版表情包，共9个，排列成3x3网格。\n设计要求：\n- 透明背景。\n- 1:1正方形构图。\n- 统一的Q版吉卜力卡通风格，色彩鲜艳。\n- 每个表情的动作、神态、内容各不相同，需要体现“骚、贱、萌、抓狂”等多样情绪，例如：翻白眼、捶地狂笑、灵魂出窍、原地石化、撒钱、干饭状态、社交恐惧发作等。可融入打工人和网络热梗元素。\n- 每个表情形象完整，无残缺。\n- 每个表情均带有统一的白色描边，呈现贴纸效果。\n- 画面中无多余、分离的元素。\n- 严格禁止出现任何文字，或确保文字内容准确无误（优先选择无文字）。\n\n*注意： 请将提示词中的“[参考图片中的角色]”替换为对角色特征的具体描述，或直接上传参考图片。*\n\n**需上传参考图片：** 需要上传一张角色图片作为表情包创作的主要参考。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/21/chibi_character_sticker_pack.png",
      "type": "image_to_image"
    },
    {
      "title": "手办与真人同框",
      "author": "@dotey",
      "prompt": "以手机随手拍摄的日常风格，桌面上摆放着一款 【成龙】动漫手办，动作夸张帅气，装备齐全。同时，真实世界的对应人物也出现在镜头中，与手办摆出相似的姿势，形成手办与真实人物同框的有趣对比效果。整体构图和谐自然，传递温暖且富有生活气息的视觉体验。\n\n*注意： 提示词中的【成龙】可以替换为任何你想要的手办角色名称，也可以是其他类型的角色。*",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/20/action_figure_and_real_person_in_frame.png",
      "type": "image_to_image"
    },
    {
      "title": "皮克斯3D风格",
      "author": "AnimeAI",
      "prompt": "以皮克斯 3D 风格重绘这张照片\n\n\n**需上传参考图片：** 一张人物或者其他照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/18/pixar-style-godfather-scene.png",
      "type": "image_to_image"
    },
    {
      "title": "二次元风格徽章",
      "author": "@Alittlefatwhale",
      "prompt": "基于附件中的人物，生成一个二次元风格的徽章的照片，要求：\n材质：流苏\n形状：圆形\n画面主体：一只手手持徽章\n\n\n**需上传参考图片：** 需要上传一张人物照片作为徽章图案的参考。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/16/anime_style_badge.png",
      "type": "image_to_image"
    },
    {
      "title": "《海贼王》主题手办制作",
      "author": "@dotey",
      "prompt": "把照片中的人物变成《海贼王》（One Piece）动漫主题手办包装盒的风格，以等距视角（isometric）呈现。包装盒内展示的是基于照片人物的《海贼王》动漫画风设计的形象，旁边搭配有日常必备物品（手枪、手表、西装和皮鞋）同时，在包装盒旁边还应呈现该手办本体的实物效果，采用逼真的、具有真实感的渲染风格。\n\n*注意： 日常必备物品此处稍作修改。请参考原文。*\n\n**需上传参考图片：** 一张半身或者全身照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/14/example_one_piece_figure_creation.png",
      "type": "image_to_image"
    },
    {
      "title": "3D Q版风格",
      "author": "@dotey",
      "prompt": "将场景中的角色转化为3D Q版风格，同时保持原本的场景布置和服装造型不变。\n\n\n**需上传参考图片：** 一张照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/13/example_photo_to_3d_q.png",
      "type": "image_to_image"
    },
    {
      "title": "3D 情侣珠宝盒摆件",
      "author": "@dotey",
      "prompt": "根据照片上的内容打造一款细致精美、萌趣可爱的3D渲染收藏摆件，装置在柔和粉彩色调、温馨浪漫的展示盒中。展示盒为浅奶油色搭配柔和的金色装饰，形似精致的便携珠宝盒。打开盒盖，呈现出一幕温暖浪漫的场景：两位Q版角色正甜蜜相望。盒顶雕刻着“FOREVER TOGETHER”（永远在一起）的字样，周围点缀着小巧精致的星星与爱心图案。\n盒内站着照片上的女性，手中捧着一束小巧的白色花束。她的身旁是她的伴侣，照片上的男性。两人都拥有大而闪亮、充满表现力的眼睛，以及柔和、温暖的微笑，传递出浓浓的爱意和迷人的气质。\n他们身后有一扇圆形窗户，透过窗户能看到阳光明媚的中国古典小镇天际线和轻柔飘浮的云朵。盒内以温暖的柔和光线进行照明，背景中漂浮着花瓣点缀气氛。整个展示盒和角色的色调优雅和谐，营造出一个奢华而梦幻的迷你纪念品场景。\n尺寸：9:16\n\n\n**需上传参考图片：** 一张情侣照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/12/example_3d_collectible_couple_box.png",
      "type": "image_to_image"
    },
    {
      "title": "乐高收藏品",
      "author": "@ZHO_ZHO_ZHO",
      "prompt": "根据我上传的照片，生成一张纵向比例的照片，使用以下提示词：\n经典乐高人偶风格，一个微缩场景 —— 一只动物站在我身旁。这只动物的配色与我相匹配。\n请根据你对我的理解来创造这只动物（你可以选择任何你认为适合我的动物，不论是真实存在的，还是超现实的、幻想的，只要你觉得符合我的气质即可）。\n整个场景设定在一个透明玻璃立方体内，布景极简。\n微缩场景的底座是哑光黑色，配以银色装饰，风格简约且时尚。\n底座上有一块优雅雕刻的标签牌，字体为精致的衬线体，上面写着该动物的名称。\n底部设计中还巧妙融入了类似自然历史博物馆展示的生物学分类信息，以精细蚀刻的方式呈现。\n整体构图像是一件高端收藏艺术品：精心打造、策展般呈现、灯光细致。\n构图重在平衡。背景为渐变色，从深色到浅色过渡（颜色基于主色调进行选择）。\n\n\n**需上传参考图片：** 一张半身或者全身单人照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/8/example_lego_collectible.png",
      "type": "image_to_image"
    },
    {
      "title": "角色穿越传送门",
      "author": "@dotey",
      "prompt": "照片中的角色的 3D Q 版形象穿过传送门，牵着观众的手，在将观众拉向前时动态地回头一看。传送门外的背景是观众的现实世界，一个典型的程序员的书房，有书桌，显示器和笔记本电脑，传送门内是角色所处的3D Q 版世界，细节可以参考照片，整体呈蓝色调，和现实世界形成鲜明对比。传送门散发着神秘的蓝色和紫色色调，是两个世界之间的完美椭圆形框架处在画面中间。从第三人称视角拍摄的摄像机角度，显示观看者的手被拉入角色世界。2：3 的宽高比。\n\n\n**需上传参考图片：** 一张半身或者全身单人照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/6/example_portal_crossing_handhold.png",
      "type": "image_to_image"
    },
    {
      "title": "吉卜力风格",
      "author": "AnimeAI",
      "prompt": "以吉卜力风格重绘这张照片\n\n*注意： 如果遇到违反内容政策的情况，提示词增加一句：如果背景里有不合适（敏感）的内容，可以进行修改或删除。*\n\n**需上传参考图片：** 一张人物或者其他照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/5/ghibli-style-mona-lisa.png",
      "type": "image_to_image"
    },
    {
      "title": "3D Q版中式婚礼图",
      "author": "@balconychy",
      "prompt": "将照片里的两个人转换成Q版 3D人物，中式古装婚礼，大红颜色，背景“囍”字剪纸风格图案。 服饰要求：写实，男士身着长袍马褂，主体为红色，上面以金色绣龙纹图案，彰显尊贵大气 ，胸前系着大红花，寓意喜庆吉祥。女士所穿是秀禾服，同样以红色为基调，饰有精美的金色花纹与凤凰刺绣，展现出典雅华丽之感 ，头上搭配花朵发饰，增添柔美温婉气质。二者皆为中式婚礼中经典着装，蕴含着对新人婚姻美满的祝福。 头饰要求： 男士：中式状元帽，主体红色，饰有金色纹样，帽顶有精致金饰，尽显传统儒雅庄重。 女士：凤冠造型，以红色花朵为中心，搭配金色立体装饰与垂坠流苏，华丽富贵，古典韵味十足。\n\n\n**需上传参考图片：** 一张情侣照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/4/example_q_chinese_wedding.png",
      "type": "image_to_image"
    },
    {
      "title": "3D Q版人物立体相框",
      "author": "@dotey",
      "prompt": "将场景中的角色转化为3D Q版风格，放在一张拍立得照片上，相纸被一只手拿着，照片中的角色正从拍立得照片中走出，呈现出突破二维相片边框、进入二维现实空间的视觉效果。\n\n\n**需上传参考图片：** 一张半身或者全身单人照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/2/example_polaroid_breakout.png",
      "type": "image_to_image"
    },
    {
      "title": "Q版求婚场景",
      "author": "@balconychy",
      "prompt": "将照片里的两个人转换成Q版 3D人物，场景换成求婚，背景换成淡雅五彩花瓣做的拱门，背景换成浪漫颜色，地上散落着玫瑰花瓣。除了人物采用Q版 3D人物风格，其他环境采用真实写实风格。\n\n\n**需上传参考图片：** 一张情侣照片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/cases/1/example_proposal_scene_q_realistic.png",
      "type": "image_to_image"
    },
    {
      "title": "浮雕商务名片字母组合",
      "author": "OpenAI",
      "prompt": "请在此商务名片上添加 “G / I” 字母组合，并以浮雕（embossed）效果呈现。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/business-card-result.png",
      "type": "image_to_image"
    },
    {
      "title": "手袋搭配服装",
      "author": "OpenAI",
      "prompt": "生成一张手袋图片，使其能够与这套服装完美搭配。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/handbag-output.png",
      "type": "image_to_image"
    },
    {
      "title": "家用音箱广告",
      "author": "OpenAI",
      "prompt": "为家用蓝牙音箱生成一张广告图：在日式极简室内场景中，将产品置于正中的极简置物架上，背景为混凝土墙；加入绿植及其它时尚饰品，使整体氛围像家居摄影。右下角以无衬线字体（Helvetica Light）小号、低调地加入文字 “agi.fm”。除该文字外不包含任何文字或图形元素。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/speaker-output.png",
      "type": "image_to_image"
    },
    {
      "title": "球鞋材料再创想",
      "author": "OpenAI",
      "prompt": "我正在设计一款球鞋，你是我的设计伙伴。请重新构想这双球鞋，仿佛它由 {material} 制成。无需考虑实用性，尽情发挥创意，为我提供全新形态与材料的灵感。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/sneakers-poster.png",
      "type": "image_to_image"
    },
    {
      "title": "巧克力包装口味变体",
      "author": "OpenAI",
      "prompt": "为这款巧克力包装设计新口味——{flavor}：\n1. 将 “single origin” 改为口味名称 {flavor}；\n2. 选择符合口味的新主色，并将背景调整为该色的柔和米白调，文字用该色深色系；\n3. 调整可可果插图以呼应新口味；\n4. 保持活版印刷质感。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/chocolate-poster.png",
      "type": "image_to_image"
    },
    {
      "title": "生日卡礼物插画",
      "author": "OpenAI",
      "prompt": "为我妈妈的 50 岁生日制作一张生日卡片图片，将我送给她的所有礼物以单色黑墨线稿的形式绘制在同一张图中。添加一行优雅的黑色手写体标题：“Happy 50th Birthday, Mom!”",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/gift-basket.png",
      "type": "image_to_image"
    },
    {
      "title": "牙买加 Jerk 餐车品牌化",
      "author": "OpenAI",
      "prompt": "将这辆餐车调整为jamaican jerk chicken的主题品牌。创建合适的图形元素并添加与该美食相匹配的配色。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/food-truck-output.png",
      "type": "image_to_image"
    },
    {
      "title": "停车场立柱图案应用",
      "author": "OpenAI",
      "prompt": "将 {pattern-number} 号图案应用到停车场立柱上，效果应仿佛彩绘覆盖在混凝土之上。在图案参考图中，1 号位于左上角，9 号位于右下角。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/parking-poster.png",
      "type": "image_to_image"
    },
    {
      "title": "室内空间再设计",
      "author": "OpenAI",
      "prompt": "将该空间重新想象为 {style} 风格美学。添加符合风格的家具与配饰，并保持与原照一致的拍摄角度。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/interior-design-poster.png",
      "type": "image_to_image"
    },
    {
      "title": "虚拟试衣",
      "author": "OpenAI",
      "prompt": "将照片中模特的服装替换为一套新造型。输出方形图片。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/tryon-output.png",
      "type": "image_to_image"
    },
    {
      "title": "平面图到 3D 渲染",
      "author": "OpenAI",
      "prompt": "对这张建筑平面进行超写实 3D 渲染：不得改变墙体位置，保持所有线条与平面图一致，但添加家具、饰面、材质与纵深。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/floorplan-output.png",
      "type": "image_to_image"
    },
    {
      "title": "演唱会门票设计（朋克风）",
      "author": "OpenAI",
      "prompt": "为歌手 “Jax Bennett” 设计一张朋克 zine 风格的逼真演唱会门票：\n1. 使用单色丝网印刷风格侧面肖像（已附照片）做主视觉；\n2. 采用不规则朋克排版清晰呈现演出信息：\n  Artist: Jax Bennett\n  Tour: “Echoes & Reflections Tour 2024”\n  Venue: The Paramount Theatre, Seattle, WA\n  Date & Time: Saturday, Aug 17, 2024, 8:00 PM\n  Seat: Section A Row 4 Seat 12\n3. 门票比例需纵向细长。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/concert-ticket.png",
      "type": "image_to_image"
    },
    {
      "title": "重金属唱片封套设计",
      "author": "OpenAI",
      "prompt": "为重金属乐队设计一张唱片封套：\n1. 主文字以极其复杂、几乎难辨的金属字体覆盖全幅，文字内容为“token sounds”；\n2. 左下角小号字体标注 “abc records”；\n3. 右下角放置条形码；\n4. 背景纯黑，文字颜色白色。\n最终封面叠加到参考图片上。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/vinyl-output.png",
      "type": "image_to_image"
    },
    {
      "title": "番茄酱广告包装镜头",
      "author": "OpenAI",
      "prompt": "创建一张番茄酱广告镜头：将番茄酱瓶置于白色空间右下角，稍向中心倾斜；中央用番茄酱书写脚本字体文字 “The king of tomatoes”，文字应红色高光并漂浮于空中；番茄酱瓶开启，营造文字由瓶口流出的错觉。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/ketchup-ad.png",
      "type": "image_to_image"
    },
    {
      "title": "温馨客厅氛围添加",
      "author": "OpenAI",
      "prompt": "将这些物品添加到客厅照片中，使空间更显舒适温馨。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/living-room-output-b.png",
      "type": "image_to_image"
    },
    {
      "title": "橄榄油瓶融入静物画",
      "author": "OpenAI",
      "prompt": "将这瓶橄榄油无缝融入静物画。确保输出方形图像，并在左下角以经典衬线字体小号文字加入标题 “timeless taste”。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/ad-olive-oil.png",
      "type": "image_to_image"
    },
    {
      "title": "礼品篮合成图",
      "author": "OpenAI",
      "prompt": "在白色背景上生成一张礼品篮的照片级写实图像，标签 “Relax & Unwind” 以缎带和手写体字体呈现；礼篮内包含参考图中的所有物品。",
      "thumbnail": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/gpt-image-1/examples/bath-set-result.png",
      "type": "image_to_image"
    }
  ]
}